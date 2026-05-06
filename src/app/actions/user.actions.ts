'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteUser(userId: number) {
  try {
    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    // Revalidate the dashboard page so it fetches the updated data
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'No se pudo eliminar el usuario' };
  }
}
