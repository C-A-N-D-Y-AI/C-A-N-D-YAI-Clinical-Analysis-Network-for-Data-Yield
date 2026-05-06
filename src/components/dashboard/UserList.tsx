"use client";
import React from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { User } from '@/types/user';
import { UserFormModal } from './UserFormModal';

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const { 
    handleDelete, 
    isModalOpen, 
    userToEdit, 
    openCreateModal, 
    openEditModal, 
    closeModal,
    searchQuery,
    setSearchQuery,
    filteredUsers
  } = useUserManagement(users);

  return (
    <>
      <div className="w-full bg-[#0D1525] rounded-2xl border border-[#1A263D] overflow-hidden shadow-md flex flex-col">
        <div className="p-6 border-b border-[#1A263D] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#050A18]/50">
          <h2 className="text-xl font-bold text-[#FFFFFF] tracking-tight">Gestión de Usuarios</h2>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
            {/* Buscador */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-[#A0AEC0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#050A18] border border-[#1A263D] py-2 pl-9 pr-3 rounded-xl text-[#FFFFFF] placeholder:text-[#A0AEC0]/50 focus:outline-none focus:ring-2 focus:ring-[#0091DA]/40 focus:border-[#0091DA] transition-all text-sm"
              />
            </div>

            <div className="flex items-center justify-between md:justify-start gap-4">
              <span className="bg-[#0091DA]/10 text-[#0091DA] py-1.5 px-3 rounded-full text-xs font-bold border border-[#0091DA]/20">
                {filteredUsers.length} Usuarios
              </span>
              <button 
                onClick={openCreateModal}
                className="bg-[#0091DA] hover:bg-[#007AB8] text-[#FFFFFF] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap shadow-lg shadow-[#0091DA]/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Usuario
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#050A18]/30 text-[#A0AEC0] text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-[#1A263D]">Usuario</th>
                <th className="p-4 font-semibold border-b border-[#1A263D]">Email</th>
                <th className="p-4 font-semibold border-b border-[#1A263D]">Rol</th>
                <th className="p-4 font-semibold border-b border-[#1A263D]">Estado</th>
                <th className="p-4 font-semibold border-b border-[#1A263D]">Fecha Registro</th>
                <th className="p-4 font-semibold border-b border-[#1A263D] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#A0AEC0] flex flex-col items-center justify-center gap-3">
                    <svg className="w-12 h-12 text-[#1A263D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>No se encontraron usuarios que coincidan con la búsqueda.</span>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="border-b border-[#1A263D]/50 hover:bg-[#1A263D]/30 transition-colors"
                  >
                    <td className="p-4 font-medium text-[#FFFFFF]">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-4 text-[#A0AEC0]">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span className={`py-1 px-2 rounded-md text-xs font-bold ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-[#1A263D] text-[#A0AEC0] border border-[#1A263D]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`flex items-center gap-2 text-xs font-medium ${
                        user.isActive ? 'text-[#00C2A8]' : 'text-red-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          user.isActive ? 'bg-[#00C2A8] shadow-[0_0_5px_#00C2A8]' : 'bg-red-400'
                        }`}></span>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-[#A0AEC0] text-xs">
                      {new Date(user.createdAt || new Date()).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="text-[#0091DA] hover:text-white bg-[#0091DA]/10 hover:bg-[#0091DA] border border-[#0091DA]/20 hover:border-[#0091DA] px-3 py-1.5 rounded-md transition-all text-xs font-medium flex items-center gap-1"
                          title="Editar usuario"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(user)}
                          className="text-red-400 hover:text-white bg-red-400/10 hover:bg-red-500 border border-red-400/20 hover:border-red-500 px-3 py-1.5 rounded-md transition-all text-xs font-medium flex items-center gap-1"
                          title="Eliminar usuario"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserFormModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        userToEdit={userToEdit}
        onSuccess={() => {
          // Revalidado en el server
        }}
      />
    </>
  );
}
