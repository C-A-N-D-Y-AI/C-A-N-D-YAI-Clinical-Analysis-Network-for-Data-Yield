import { User } from "@/types/user";
import prisma from "@/lib/db";
import { compareHashed } from "@/lib/hash";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

/**
 * Autentica un usuario y genera sus tokens.
 */
export async function LoginUser(user: Partial<User>) {

    if (!user.email || !user.password) {
        throw new Error("Email y contraseña son requeridos");
    }

    const validateUser = await prisma.user.findUnique({
        where: { email: user.email }
    });

    if (!validateUser) {
        throw new Error("Usuario no encontrado");
    }

    const validateHash = await compareHashed(user.password, validateUser.password);
    if (!validateHash) {
        throw new Error("Contraseña incorrecta");
    }

    const payload = {
        id: validateUser.id,
        email: validateUser.email,
        role: validateUser.role
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
        accessToken,
        refreshToken,
        user: {
            id: validateUser.id,
            email: validateUser.email,
            role: validateUser.role
        }
    }
}