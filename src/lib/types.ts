export type Role = "PATIENT" | "DOCTOR" | "RESPONDER" | "ADMIN";

export type User = {
  id: string;
  email: string;
  role: Role;
  patientProfile?: { firstName: string; lastName: string } | null;
  doctorProfile?: { fullName: string } | null;
};