import { User } from "@/types/user";
import prisma from "@/lib/db";
import { compareHashed } from "@/lib/hash";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export async function LoginUser(user: User) {

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
        email: user.email
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
        accessToken,
        refreshToken
    }
}