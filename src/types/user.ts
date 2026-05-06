export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string; // Opcional porque no se envía al frontend
    role?: "USER" | "ADMIN";
    isActive?: boolean;
    createdAt?: Date;
}