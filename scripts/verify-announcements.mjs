import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const smoke = process.argv.includes("--smoke");
const migrate = process.argv.includes("--migrate");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || databaseUrl.includes("[SENSITIVE]")) {
  throw new Error("A real DATABASE_URL is required in the deployment environment.");
}
const prisma = new PrismaClient();
const fixtureId = `announcement-verification-${randomUUID()}`;
let storageFile;

try {
  const tables = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
  let names = tables.map((table) => table.tablename);
  console.log("Database tables:", names.join(", "));
  if (names.includes("_prisma_migrations")) {
    const migrations = await prisma.$queryRaw`SELECT migration_name, finished_at IS NOT NULL AS applied, rolled_back_at IS NOT NULL AS rolled_back FROM "_prisma_migrations" ORDER BY started_at`;
    console.log("Migration history:", JSON.stringify(migrations));
  } else {
    console.log("Migration history: not initialized");
  }
  if (migrate) {
    assert.ok(names.includes("_prisma_migrations"), "Baseline an existing database before deploying migrations.");
    const migrationUrl = new URL(process.env.DATABASE_URL_UNPOOLED || databaseUrl);
    if (migrationUrl.hostname.endsWith(".neon.tech")) migrationUrl.hostname = migrationUrl.hostname.replace("-pooler.", ".");
    const migration = spawnSync(process.execPath, [fileURLToPath(new URL("../node_modules/prisma/build/index.js", import.meta.url)), "migrate", "deploy"], {
      env: { ...process.env, DATABASE_URL: migrationUrl.href },
      stdio: "inherit",
    });
    assert.equal(migration.status, 0, "Database migrations must succeed before deployment.");
    const updatedTables = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
    names = updatedTables.map((table) => table.tablename);
  }
  const columns = await prisma.$queryRaw`SELECT table_name, column_name, udt_name, is_nullable FROM information_schema.columns WHERE table_schema = 'public' AND table_name IN ('Article', 'Appointment', 'News') ORDER BY table_name, ordinal_position`;
  console.log("Application schema:", JSON.stringify(columns));
  console.log("Storage configuration:", JSON.stringify({
    projectId: Boolean(process.env.FIREBASE_PROJECT_ID),
    clientEmail: Boolean(process.env.FIREBASE_CLIENT_EMAIL),
    privateKey: Boolean(process.env.FIREBASE_PRIVATE_KEY),
    customBucket: Boolean(process.env.FIREBASE_STORAGE_BUCKET),
  }));

  if (smoke) {
    assert.ok(names.includes("News"), "Apply the News migration before running the smoke check.");
    const item = await prisma.news.create({ data: {
      id: fixtureId,
      title: "Temporary deployment verification",
      summary: "",
      imageUrl: "/favicon-192.png",
      published: false,
    } });
    assert.equal(item.summary, "");
    assert.equal(await prisma.news.count({ where: { id: fixtureId, published: true } }), 0);
    assert.ok(await prisma.news.findUnique({ where: { id: fixtureId } }));
    console.log("PASS: image-only announcement persists and remains hidden.");

    for (const key of ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"]) {
      assert.ok(process.env[key] && !process.env[key].includes("[SENSITIVE]"), `${key} is required.`);
    }
    const app = getApps()[0] ?? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
    });
    const bucket = getStorage(app).bucket();
    const token = randomUUID();
    const objectPath = `announcements/verification/${fixtureId}.png`;
    const original = await readFile(new URL("../public/favicon-192.png", import.meta.url));
    storageFile = bucket.file(objectPath);
    await storageFile.save(original, {
      resumable: false,
      metadata: {
        contentType: "image/png",
        cacheControl: "public, max-age=31536000, immutable",
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
    const response = await fetch(url);
    assert.equal(response.status, 200, "The uploaded announcement must be publicly readable with its download token.");
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), original);
    console.log("PASS: Firebase accepts the upload and serves the original image.");
  }
} catch (error) {
  let message = error instanceof Error ? error.message : "Unknown verification error";
  for (const [key, value] of Object.entries(process.env)) {
    if (value && value.length > 6 && /SECRET|PASSWORD|PRIVATE_KEY|DATABASE_URL|TOKEN/.test(key)) message = message.replaceAll(value, "[REDACTED]");
  }
  console.error("Announcement deployment verification failed:", message);
  process.exitCode = 1;
} finally {
  if (smoke) {
    try {
      await prisma.news.deleteMany({ where: { id: fixtureId } });
      if (storageFile) await storageFile.delete({ ignoreNotFound: true });
      console.log("Temporary verification data removed.");
    } catch {
      console.error("Temporary verification data could not be removed; inspect the verification ID:", fixtureId);
      process.exitCode = 1;
    }
  }
  await prisma.$disconnect();
}
