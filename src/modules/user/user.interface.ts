import {Role} from "../../../generated/prisma";

export interface UserInterface {}

export interface AuthenticatedUser {
  id: string;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
}
