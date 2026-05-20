CREATE TYPE "AppointmentStatus" AS ENUM ('pendiente', 'confirmada', 'completada', 'cancelada');

CREATE TYPE "ServiceType" AS ENUM ('psicologia', 'legal', 'ambos');

CREATE TABLE "Appointment" (
  "id" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "apellido" TEXT NOT NULL,
  "fechaNacimiento" TEXT NOT NULL,
  "telefono" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "fechaPreferida" TEXT NOT NULL,
  "horaPreferida" TEXT NOT NULL,
  "tipoServicio" "ServiceType" NOT NULL,
  "notas" TEXT NOT NULL DEFAULT '',
  "estado" "AppointmentStatus" NOT NULL DEFAULT 'pendiente',
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizadoEn" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Appointment_creadoEn_idx" ON "Appointment"("creadoEn");
CREATE INDEX "Appointment_fechaPreferida_idx" ON "Appointment"("fechaPreferida");
CREATE INDEX "Appointment_estado_idx" ON "Appointment"("estado");
