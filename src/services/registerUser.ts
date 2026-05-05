import { User } from "@/types/user";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/hash";

/**
 * Registra un nuevo usuario en la base de datos.
 */
export async function registerUser(user: User): Promise<void> {

    const validateRegister = await prisma.user.findUnique({
        where: { email: user.email }
    });

    if (validateRegister) {
        throw new Error("El usuario ya existe");
    }

    const hashed = await hashPassword(user.password);

    await prisma.user.create({
        data: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: hashed,
            role: user.role || 'USER'
        }
    });
}