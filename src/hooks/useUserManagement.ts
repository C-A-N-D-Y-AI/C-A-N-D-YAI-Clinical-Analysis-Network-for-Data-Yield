import { useState } from 'react';
import Swal from 'sweetalert2';
import { deleteUser } from '@/app/actions/user.actions';
import { User } from '@/types/user';

export function useUserManagement(users: User[] = []) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const openCreateModal = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleDelete = async (user: User) => {
    if (user.role === 'ADMIN') {
        await Swal.fire({
            title: 'Acción no permitida',
            text: 'No está permitido eliminar a otros administradores del sistema.',
            icon: 'warning',
            confirmButtonText: 'Entendido',
            background: '#0D1525',
            color: '#FFFFFF',
        });
        return; // Fix #16: detenemos aquí, no mostramos el segundo popup
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar permanentemente al usuario ${user.firstName} ${user.lastName}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1A263D',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#0D1525',
      color: '#FFFFFF'
    });

    if (!user.id) {
        Swal.fire({ title: 'Error', text: 'El usuario no tiene un ID válido', icon: 'error' });
        return;
    }

    if (result.isConfirmed) {
      const response = await deleteUser(user.id);
      
      if (response.success) {
        Swal.fire({
          title: 'Eliminado',
          text: 'El usuario ha sido eliminado correctamente.',
          icon: 'success',
          background: '#0D1525',
          color: '#FFFFFF',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: response.error || 'Hubo un problema al eliminar.',
          icon: 'error',
          background: '#0D1525',
          color: '#FFFFFF'
        });
      }
    }
  };

  // Lógica de filtrado separada de la vista
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.role || '').toLowerCase().includes(searchLower)
    );
  });

  return {
    isModalOpen,
    userToEdit,
    openCreateModal,
    openEditModal,
    closeModal,
    handleDelete,
    searchQuery,
    setSearchQuery,
    filteredUsers
  };
}
