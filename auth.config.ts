import Credentials from "@auth/core/providers/credentials";
import { defineConfig } from "auth-astro";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

function normalizePublicOrigin(value: string | undefined): string | null {
  if (!value) return null;

  const urlValue = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(urlValue);
    return LOCAL_HOSTNAMES.has(url.hostname) ? null : url.origin;
  } catch {
    return null;
  }
}

function getAppOrigin(baseUrl: string): string {
  return (
    normalizePublicOrigin(import.meta.env.PUBLIC_SITE_URL) ||
    normalizePublicOrigin(import.meta.env.SITE_URL) ||
    normalizePublicOrigin(import.meta.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizePublicOrigin(import.meta.env.VERCEL_URL) ||
    normalizePublicOrigin(import.meta.env.AUTH_URL) ||
    normalizePublicOrigin(import.meta.env.NEXTAUTH_URL) ||
    baseUrl
  );
}

export default defineConfig({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const adminUser = import.meta.env.ADMIN_USER || "admin";
        const adminPassword = import.meta.env.ADMIN_PASSWORD || "plenitud2026";

        if (
          credentials?.username === adminUser &&
          credentials?.password === adminPassword
        ) {
          return {
            id: "1",
            name: "Administrador",
            email: "admin@plenitudemocional.com",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      const appOrigin = getAppOrigin(baseUrl);
      const authOrigin = normalizePublicOrigin(baseUrl) || baseUrl;

      try {
        const target = url.startsWith("/") ? new URL(url, appOrigin) : new URL(url);
        const isLocalRedirect = LOCAL_HOSTNAMES.has(target.hostname);
        const isAllowedOrigin = target.origin === appOrigin || target.origin === authOrigin;

        if (isLocalRedirect || isAllowedOrigin) {
          return `${appOrigin}${target.pathname}${target.search}${target.hash}`;
        }
      } catch {
        return appOrigin;
      }

      return appOrigin;
    },
  },
});
