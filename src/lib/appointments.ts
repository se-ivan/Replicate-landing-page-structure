import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "appointments.json");

export type AppointmentStatus = "pendiente" | "confirmada" | "completada" | "cancelada";

export interface Appointment {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  fechaPreferida: string;
  horaPreferida: string;
  tipoServicio: "psicologia" | "legal" | "ambos";
  notas: string;
  estado: AppointmentStatus;
  creadoEn: string;
  actualizadoEn: string;
}

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
}

function readAppointments(): Appointment[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeAppointments(appointments: Appointment[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2), "utf-8");
}

export function getAll(): Appointment[] {
  return readAppointments().sort(
    (a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
  );
}

export function getById(id: string): Appointment | undefined {
  return readAppointments().find((a) => a.id === id);
}

export function create(
  data: Omit<Appointment, "id" | "estado" | "creadoEn" | "actualizadoEn">
): Appointment {
  const appointments = readAppointments();
  const now = new Date().toISOString();
  const appointment: Appointment = {
    ...data,
    id: randomUUID(),
    estado: "pendiente",
    creadoEn: now,
    actualizadoEn: now,
  };
  appointments.push(appointment);
  writeAppointments(appointments);
  return appointment;
}

export function update(
  id: string,
  data: Partial<Pick<Appointment, "estado" | "notas" | "fechaPreferida" | "horaPreferida">>
): Appointment | null {
  const appointments = readAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) return null;

  appointments[index] = {
    ...appointments[index],
    ...data,
    actualizadoEn: new Date().toISOString(),
  };
  writeAppointments(appointments);
  return appointments[index];
}

export function remove(id: string): boolean {
  const appointments = readAppointments();
  const filtered = appointments.filter((a) => a.id !== id);
  if (filtered.length === appointments.length) return false;
  writeAppointments(filtered);
  return true;
}
