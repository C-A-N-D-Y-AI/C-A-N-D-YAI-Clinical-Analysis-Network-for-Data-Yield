'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { hashPassword } from '@/lib/hash';
import { User } from '@/types/user';
import { cookies } from 'next/headers';
import { validateAccessToken } from '@/lib/jwt';

/**
 * Verifica que el usuario autenticado sea ADMIN antes de ejecutar cualquier action.
 * Fix #8: Los Server Actions pueden ser llamados directamente vía fetch —
 * no podemos confiar solo en que el layout los proteja.
 */
async function requireAdmin(): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = token ? validateAccessToken(token) : null;

    if (!user || user.role !== 'ADMIN') {
        throw new Error('No autorizado');
    }
}

// ─── Rutas que se revalidan tras cualquier mutación de usuarios ───────────────
const USER_PATHS = ['/dashboard', '/dashboard/users', '/dashboard/estadisticas'];

function revalidateUserPaths() {
    USER_PATHS.forEach(path => revalidatePath(path));
}

// ─────────────────────────────────────────────────────────────────────────────

export async function deleteUser(userId: number) {
    await requireAdmin(); // Fix #8

    try {
        await prisma.user.delete({ where: { id: userId } });
        revalidateUserPaths(); // Fix #5
        return { success: true };
    } catch (error) {
        console.error('[ACTION deleteUser]', error);
        return { success: false, error: 'No se pudo eliminar el usuario' };
    }
}

export async function createUser(data: Omit<User, 'id'>) {
    await requireAdmin(); // Fix #8

    try {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            return { success: false, error: 'El usuario con ese email ya existe' };
        }

        // Fix #6: No usar contraseña por defecto — si no viene, falla explícitamente
        if (!data.password) {
            return { success: false, error: 'La contraseña es obligatoria' };
        }

        const hashed = await hashPassword(data.password);

        await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: hashed,
                role: data.role || 'USER',
                isActive: data.isActive ?? true,
            }
        });

        revalidateUserPaths(); // Fix #5
        return { success: true };
    } catch (error) {
        console.error('[ACTION createUser]', error);
        return { success: false, error: 'No se pudo crear el usuario' };
    }
}

export async function updateUser(userId: number, data: Partial<User>) {
    await requireAdmin(); // Fix #8

    try {
        const updateData: {
            firstName?: string;
            lastName?: string;
            email?: string;
            role?: 'USER' | 'ADMIN';
            isActive?: boolean;
            password?: string;
        } = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role as 'USER' | 'ADMIN' | undefined,
            isActive: data.isActive,
        };

        if (data.password) {
            updateData.password = await hashPassword(data.password);
        }

        await prisma.user.update({ where: { id: userId }, data: updateData });
        revalidateUserPaths(); // Fix #5
        return { success: true };
    } catch (error) {
        console.error('[ACTION updateUser]', error);
        return { success: false, error: 'No se pudo actualizar el usuario' };
    }
}
