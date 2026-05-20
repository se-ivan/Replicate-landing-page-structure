import type { AppointmentStatus, ServiceType } from "@prisma/client";
import { prisma } from "./prisma";

const VALID_STATUSES: AppointmentStatus[] = [
  "pendiente",
  "confirmada",
  "completada",
  "cancelada",
];

export interface Appointment {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  fechaPreferida: string;
  horaPreferida: string;
  tipoServicio: ServiceType;
  notas: string;
  estado: AppointmentStatus;
  creadoEn: string;
  actualizadoEn: string;
}

function serializeAppointment(appointment: {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  fechaPreferida: string;
  horaPreferida: string;
  tipoServicio: ServiceType;
  notas: string;
  estado: AppointmentStatus;
  creadoEn: Date;
  actualizadoEn: Date;
}): Appointment {
  return {
    ...appointment,
    creadoEn: appointment.creadoEn.toISOString(),
    actualizadoEn: appointment.actualizadoEn.toISOString(),
  };
}

export async function getAll(): Promise<Appointment[]> {
  const appointments = await prisma.appointment.findMany({
    orderBy: { creadoEn: "desc" },
  });
  return appointments.map(serializeAppointment);
}

export async function getById(id: string): Promise<Appointment | null> {
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  return appointment ? serializeAppointment(appointment) : null;
}

export async function create(
  data: Omit<Appointment, "id" | "estado" | "creadoEn" | "actualizadoEn">
): Promise<Appointment> {
  const appointment = await prisma.appointment.create({
    data,
  });
  return serializeAppointment(appointment);
}

export async function update(
  id: string,
  data: Partial<Pick<Appointment, "estado" | "notas" | "fechaPreferida" | "horaPreferida">>
): Promise<Appointment | null> {
  const updateData: Partial<Pick<Appointment, "estado" | "notas" | "fechaPreferida" | "horaPreferida">> = {};

  if (data.estado && VALID_STATUSES.includes(data.estado)) {
    updateData.estado = data.estado;
  }
  if (typeof data.notas === "string") {
    updateData.notas = data.notas;
  }
  if (typeof data.fechaPreferida === "string") {
    updateData.fechaPreferida = data.fechaPreferida;
  }
  if (typeof data.horaPreferida === "string") {
    updateData.horaPreferida = data.horaPreferida;
  }

  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
    });
    return serializeAppointment(appointment);
  } catch {
    return null;
  }
}

export async function remove(id: string): Promise<boolean> {
  const deleted = await prisma.appointment.deleteMany({
    where: { id },
  });
  return deleted.count > 0;
}
