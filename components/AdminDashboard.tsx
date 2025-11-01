import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { PencilIcon, TrashIcon, ArrowPathIcon } from '../constants';

const UserFormModal: React.FC<{
  user: Partial<User> | null;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
}> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<User>>(
    user || { role: UserRole.Employe, isActive: true }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    if (isCheckbox) {
      const checkbox = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checkbox.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">{user.id ? 'Modifier' : 'Ajouter'} un utilisateur</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" name="firstName" placeholder="Prénom" value={formData.firstName || ''} onChange={handleChange} required className="p-2 border rounded-md" />
             <input type="text" name="lastName" placeholder="Nom" value={formData.lastName || ''} onChange={handleChange} required className="p-2 border rounded-md" />
          </div>
          <input type="email" name="email" placeholder="Email" value={formData.email || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" name="birthDate" value={formData.birthDate || ''} onChange={handleChange} required className="p-2 border rounded-md" />
            <input type="text" name="cin" placeholder="CIN" value={formData.cin || ''} onChange={handleChange} required className="p-2 border rounded-md" />
          </div>
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md">
            {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          <div className="flex items-center">
            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Actif</label>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
    users: User[];
    onSaveUser: (user: Partial<User>) => void;
    onDeleteUser: (userId: number) => void;
    onToggleUserStatus: (userId: number) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, onSaveUser, onDeleteUser, onToggleUserStatus }) => {
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  const handleSave = (userToSave: Partial<User>) => {
    onSaveUser(userToSave);
    setEditingUser(null);
  };
  
  const handleDelete = (userId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      onDeleteUser(userId);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <button onClick={() => setEditingUser({})} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Ajouter un utilisateur
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => onToggleUserStatus(user.id)} className="text-gray-400 hover:text-gray-600" title={user.isActive ? 'Désactiver' : 'Activer'}>
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => setEditingUser(user)} className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900" title="Supprimer">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editingUser && <UserFormModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSave} />}
    </div>
  );
};

export default AdminDashboard;