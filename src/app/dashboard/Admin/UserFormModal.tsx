"use client";
import React, { useState } from "react";
import { User } from "@/types/user";
import { createUser, updateUser } from "@/actions/user.actions";
import Swal from "sweetalert2";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
  onSuccess: () => void;
}

export function UserFormModal({ isOpen, onClose, userToEdit, onSuccess }: UserFormModalProps) {
  if (!isOpen) return null;

  return (
    <UserFormModalContent
      key={userToEdit?.id ?? "new-user"}
      onClose={onClose}
      userToEdit={userToEdit}
      onSuccess={onSuccess}
    />
  );
}

function getInitialFormData(userToEdit?: User | null): Partial<User> {
  if (!userToEdit) {
    return { firstName: "", lastName: "", email: "", password: "", role: "USER", isActive: true };
  }

  return {
    firstName: userToEdit.firstName,
    lastName: userToEdit.lastName,
    email: userToEdit.email,
    role: userToEdit.role,
    isActive: userToEdit.isActive,
    password: "",
  };
}

function UserFormModalContent({
  onClose,
  userToEdit,
  onSuccess,
}: Omit<UserFormModalProps, "isOpen">) {
  const [formData, setFormData] = useState<Partial<User>>(() => getInitialFormData(userToEdit));
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
        if (!formData.firstName || !formData.email || !formData.password) {
          throw new Error("Nombre, email y contraseña son obligatorios");
        }
        response = await createUser(formData as Omit<User, "id">);
      }

      if (response.success) {
        Swal.fire({
          title: "¡Éxito!",
          text: userToEdit ? "Usuario actualizado correctamente" : "Usuario creado correctamente",
          icon: "success", background: "#FFFFFF", color: "#0F172A", timer: 1500, showConfirmButton: false,
        });
        onSuccess();
        onClose();
      } else {
        throw new Error(response.error);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Hubo un problema al guardar";
      Swal.fire({ title: "Error", text: message, icon: "error", background: "#FFFFFF", color: "#0F172A" });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm";
  const labelClass = "text-xs font-bold text-slate-500 uppercase tracking-wider";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {userToEdit ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Nombre</label>
              <input type="text" name="firstName" required value={formData.firstName || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Apellido</label>
              <input type="text" name="lastName" required value={formData.lastName || ""} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Email</label>
            <input type="email" name="email" required value={formData.email || ""} onChange={handleChange} className={inputClass} />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{userToEdit ? "Nueva Contraseña (Opcional)" : "Contraseña"}</label>
            <input
              type="password" name="password" required={!userToEdit}
              value={formData.password || ""} onChange={handleChange}
              placeholder={userToEdit ? "Dejar en blanco para no cambiar" : "••••••••"}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <label className={labelClass}>Rol</label>
              <select name="role" value={formData.role || "USER"} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm">
                <option value="USER">Usuario (USER)</option>
                <option value="ADMIN">Administrador (ADMIN)</option>
              </select>
            </div>
            <div className="flex flex-col justify-center space-y-2">
              <label className={labelClass}>Estado</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isActive" checked={formData.isActive || false} onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-300 bg-slate-50 text-blue-600" />
                <span className="text-slate-900 text-sm font-medium">Activo</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="flex-1 py-3 rounded-xl font-bold border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all text-sm flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20">
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
