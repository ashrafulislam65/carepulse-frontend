import { Role } from "./types";

export const homeFor = (role: Role) => {
  switch (role) {
    case "PATIENT":
      return "/patient";
    case "DOCTOR":
      return "/doctor";
    case "RESPONDER":
      return "/responder";
    case "ADMIN":
      return "/admin";
  }
};