export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  name?: string | null;
  email: string;
  password?: string;
  role?: "USER" | "ADMIN";
  isActive?: boolean;
  status?: string;
  createdAt?: Date;
}
