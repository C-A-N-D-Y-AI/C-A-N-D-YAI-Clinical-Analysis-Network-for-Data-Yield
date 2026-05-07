"use client";
import React, { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { createUser, updateUser } from '@/app/actions/user.actions';
import Swal from 'sweetalert2';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
  onSuccess: () => void;
}

export function UserFormModal({ isOpen, onClose, userToEdit, onSuccess }: UserFormModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        email: userToEdit.email,
        role: userToEdit.role,
        isActive: userToEdit.isActive,
        password: '' // Don't show password, only edit if filled
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'USER',
        isActive: true
      });
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (userToEdit && userToEdit.id) {
        response = await updateUser(userToEdit.id, formData);
      } else {
        // Validación básica
        if (!formData.firstName || !formData.email || !formData.password) {
          throw new Error('Nombre, email y contraseña son obligatorios');
        }
        response = await createUser(formData as Omit<User, 'id'>);
      }

      if (response.success) {
        Swal.fire({
          title: '¡Éxito!',
          text: userToEdit ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente',
          icon: 'success',
          background: '#0D1525',
          color: '#FFFFFF',
          timer: 1500,
          showConfirmButton: false
        });
        onSuccess();
        onClose();
      } else {
        throw new Error(response.error);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Hubo un problema al guardar el usuario';
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        background: '#0D1525',
        color: '#FFFFFF'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050A18]/80 backdrop-blur-sm">
      <div className="bg-[#0D1525] rounded-2xl border border-[#1A263D] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-[#1A263D] flex justify-between items-center bg-[#050A18]/50">
          <h2 className="text-xl font-bold text-[#FFFFFF] tracking-tight">
            {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button 
            onClick={onClose}
            className="text-[#A0AEC0] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Nombre</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName || ''}
                onChange={handleChange}
                className="w-full bg-[#050A18] border border-[#1A263D] p-3 rounded-xl text-[#FFFFFF] placeholder:text-[#A0AEC0]/50 focus:outline-none focus:ring-2 focus:ring-[#0091DA]/40 focus:border-[#0091DA] transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Apellido</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName || ''}
                onChange={handleChange}
                className="w-full bg-[#050A18] border border-[#1A263D] p-3 rounded-xl text-[#FFFFFF] placeholder:text-[#A0AEC0]/50 focus:outline-none focus:ring-2 focus:ring-[#0091DA]/40 focus:border-[#0091DA] transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full bg-[#050A18] border border-[#1A263D] p-3 rounded-xl text-[#FFFFFF] placeholder:text-[#A0AEC0]/50 focus:outline-none focus:ring-2 focus:ring-[#0091DA]/40 focus:border-[#0091DA] transition-all text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">
              {userToEdit ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}
            </label>
            <input
              type="password"
              name="password"
              required={!userToEdit}
              value={formData.password || ''}
              onChange={handleChange}
              placeholder={userToEdit ? 'Dejar en blanco para no cambiar' : '••••••••'}
              className="w-full bg-[#050A18] border border-[#1A263D] p-3 rounded-xl text-[#FFFFFF] placeholder:text-[#A0AEC0]/50 focus:outline-none focus:ring-2 focus:ring-[#0091DA]/40 focus:border-[#0091DA] transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Rol</label>
              <select
                name="role"
                value={formData.role || 'USER'}
                onChange={handleChange}
                className="w-full bg-[#050A18] border border-[#1A263D] p-3 rounded-xl text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#0091DA]/40 focus:border-[#0091DA] transition-all text-sm"
              >
                <option value="USER">Usuario (USER)</option>
                <option value="ADMIN">Administrador (ADMIN)</option>
              </select>
            </div>

            <div className="flex flex-col justify-center space-y-2">
              <label className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Estado</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive || false}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-[#1A263D] bg-[#050A18] text-[#0091DA] focus:ring-[#0091DA]/40 focus:ring-offset-[#0D1525]"
                />
                <span className="text-[#FFFFFF] text-sm font-medium">Activo</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-[#1A263D]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl font-bold border border-[#1A263D] text-[#A0AEC0] hover:text-white hover:bg-[#1A263D]/50 transition-all text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#0091DA] hover:bg-[#007AB8] text-[#FFFFFF] py-3 rounded-xl font-bold transition-all active:scale-[0.98] text-sm flex justify-center items-center gap-2"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
