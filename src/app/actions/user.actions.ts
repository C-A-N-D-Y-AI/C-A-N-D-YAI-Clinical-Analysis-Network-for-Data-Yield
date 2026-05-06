'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { hashPassword } from '@/lib/hash';
import { User } from '@/types/user';

export async function deleteUser(userId: number) {
  try {
    await prisma.user.delete({
      where: { id: userId }
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'No se pudo eliminar el usuario' };
  }
}

export async function createUser(data: Omit<User, 'id'>) {
  try {
    const validateRegister = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (validateRegister) {
      return { success: false, error: 'El usuario con ese email ya existe' };
    }

    const hashed = await hashPassword(data.password || '123456');

    await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashed,
        role: data.role || 'USER',
        isActive: data.isActive ?? true
      }
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'No se pudo crear el usuario' };
  }
}

export async function updateUser(userId: number, data: Partial<User>) {
  try {
    const updateData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: "USER" | "ADMIN";
      isActive?: boolean;
      password?: string;
    } = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role as "USER" | "ADMIN" | undefined,
      isActive: data.isActive
    };

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'No se pudo actualizar el usuario' };
  }
}
