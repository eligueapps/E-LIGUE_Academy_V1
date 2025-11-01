import React, { useState, useMemo } from 'react';
import { User, UserRole, Formation, UserProgress, Part, Exam } from '../types';
import { PencilIcon, TrashIcon, ArrowPathIcon, PrinterIcon, DocumentChartBarIcon } from '../constants';

const UserFormModal: React.FC<{
  user: Partial<User> | null;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  formations: Formation[];
  isLoginIdUnique: (loginId: string) => boolean;
}> = ({ user, onClose, onSave, formations, isLoginIdUnique }) => {
  const [formData, setFormData] = useState<Partial<User>>({});

  // Generate unique loginId and temporary password for new users
  useMemo(() => {
    if (user && !user.id) { // This is a new user
      let newLoginId;
      do {
        newLoginId = `EA-${Math.floor(1000000 + Math.random() * 9000000)}`;
      } while (!isLoginIdUnique(newLoginId));
      
      const tempPassword = Math.random().toString(36).slice(-8);
      
      setFormData({
        ...user,
        role: UserRole.Employe,
        isActive: true,
        loginId: newLoginId,
        password: tempPassword,
        assignedFormationIds: [],
      });
    } else {
      setFormData(user || {});
    }
  }, [user, isLoginIdUnique]);


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

  const handleFormationChange = (formationId: number) => {
    const currentIds = formData.assignedFormationIds || [];
    const newIds = currentIds.includes(formationId)
      ? currentIds.filter(id => id !== formationId)
      : [...currentIds, formationId];
    setFormData({ ...formData, assignedFormationIds: newIds });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!user) return null;

  const showFormations = formData.role && [UserRole.Arbitre, UserRole.Entraineur, UserRole.Employe, UserRole.Club].includes(formData.role as UserRole);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{user.id ? 'Modifier' : 'Ajouter'} un utilisateur</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" name="firstName" placeholder="Prénom" value={formData.firstName || ''} onChange={handleChange} required className="p-2 border rounded-md" />
             <input type="text" name="lastName" placeholder="Nom" value={formData.lastName || ''} onChange={handleChange} required className="p-2 border rounded-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" name="birthDate" value={formData.birthDate || ''} onChange={handleChange} required className="p-2 border rounded-md" />
            <input type="text" name="cin" placeholder="CINE" value={formData.cin || ''} onChange={handleChange} required className="p-2 border rounded-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="email" name="email" placeholder="Email" value={formData.email || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            <input type="tel" name="phone" placeholder="Téléphone" value={formData.phone || ''} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md">
            {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          
          {showFormations && (
            <div className="border p-4 rounded-md">
              <h3 className="font-semibold mb-2">Formations à suivre</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {formations.map(formation => (
                  <label key={formation.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={(formData.assignedFormationIds || []).includes(formation.id)}
                      onChange={() => handleFormationChange(formation.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <span>{formation.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {!user.id && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-500">Login (identifiant automatique)</label>
                <input type="text" value={formData.loginId || ''} readOnly className="mt-1 w-full p-2 border rounded-md bg-gray-200" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-500">Mot de passe provisoire</label>
                <input type="text" value={formData.password || ''} readOnly className="mt-1 w-full p-2 border rounded-md bg-gray-200" />
              </div>
            </div>
          )}

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
    formations: Formation[];
    onSaveUser: (user: Partial<User>) => void;
    onDeleteUser: (userId: number) => void;
    onToggleUserStatus: (userId: number) => void;
    userProgress: { [userId: number]: UserProgress };
    parts: Part[];
    exams: Exam[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, formations, onSaveUser, onDeleteUser, onToggleUserStatus, userProgress, parts, exams }) => {
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' ||
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower) ||
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower) ||
            user.loginId.toLowerCase().includes(searchLower) ||
            user.cin.toLowerCase().includes(searchLower);

        const matchesStatus = statusFilter === '' || user.role === statusFilter;

        return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  const calculateOverallProgress = (user: User): number => {
    if (user.role === UserRole.Administrateur || user.role === UserRole.Formateur) return 0;

    const assignedFormations = formations.filter(f => user.assignedFormationIds.includes(f.id));
    if (assignedFormations.length === 0) return 0;

    let totalCourses = 0;
    let completedCourses = 0;

    const progressForUser = userProgress[user.id] || {};

    for (const formation of assignedFormations) {
        const progress = progressForUser[formation.id];
        const formationParts = parts.filter(p => formation.partIds.includes(p.id));
        const formationCoursesCount = formationParts.reduce((sum, part) => sum + part.courseIds.length, 0);
        totalCourses += formationCoursesCount;
        if (progress && progress.completedCourseIds) {
            const formationCourseIds = new Set(formationParts.flatMap(p => p.courseIds));
            const completedInFormation = progress.completedCourseIds.filter(id => formationCourseIds.has(id)).length;
            completedCourses += completedInFormation;
        }
    }
    
    if (totalCourses === 0) return 0;
    return Math.round((completedCourses / totalCourses) * 100);
  };

  const handleSave = (userToSave: Partial<User>) => {
    onSaveUser(userToSave);
    setEditingUser(null);
  };
  
  const handleDelete = (userId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      onDeleteUser(userId);
    }
  };

  const isLoginIdUnique = (loginId: string): boolean => {
    return !users.some(u => u.loginId === loginId);
  };
  
  const handleDownloadPDF = () => {
    let title = 'Liste des utilisateurs';
    const searchPart = searchTerm ? `Recherche: "${searchTerm}"` : '';
    const statusPart = statusFilter ? `Statut: ${statusFilter}` : '';
    
    if (statusPart && searchPart) {
      title = `Utilisateurs - ${statusPart} - ${searchPart}`;
    } else if (statusPart) {
      title = `Liste des ${statusFilter.toLowerCase()}s`;
    } else if (searchPart) {
      title = `Utilisateurs - ${searchPart}`;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>' + title + '</title>');
      printWindow.document.write(`
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1 { text-align: center; font-size: 18px; }
        </style>
      `);
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<h1>${title}</h1>`);
      printWindow.document.write('<table><thead><tr><th>Nom & Prénom</th><th>Email</th><th>Login</th><th>CINE</th><th>Rôle</th></tr></thead><tbody>');
      
      filteredUsers.forEach(user => {
        printWindow.document.write(`
          <tr>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.loginId}</td>
            <td>${user.cin}</td>
            <td>${user.role}</td>
          </tr>
        `);
      });

      printWindow.document.write('</tbody></table></body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };
  
  const handlePrintNotification = (user: User) => {
    const username = `${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`.replace(/[^a-z0-9]/gi, '') + '.e-academy.ma';

    const printContent = `
      <html>
      <head>
        <title>Notification de Sélection - ${user.firstName} ${user.lastName}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #333; margin: 2cm; }
          h1, h2, h3 { font-family: "Century Gothic", sans-serif; color: #111; }
          h1 { font-size: 16pt; margin-bottom: 0.5cm; }
          h2 { font-size: 13pt; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-top: 1.2cm; margin-bottom: 0.8cm; }
          p, ul { margin-bottom: 0.5cm; }
          strong { font-weight: 600; }
          .header { text-align: center; margin-bottom: 1.5cm; }
          .header-main { font-size: 14pt; font-weight: bold; }
          .header-sub { font-size: 12pt; color: #555; }
          .section { margin-bottom: 1cm; }
          .credentials { background-color: #f7f7f7; padding: 1cm; border-radius: 8px; border-left: 4px solid #3533cd; }
          .credentials p { margin-bottom: 0.3cm; }
          .footer { margin-top: 2cm; text-align: right; }
          .signature { font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-main">Notification de Sélection et Informations d’Authentification</div>
          <div class="header-sub">Formation en ligne – LRTDF E-LIGUE Academy</div>
        </div>

        <div class="section">
          <p><strong>Nom du destinataire :</strong><br>M. ${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()} (CINE N° ${user.cin})</p>
          <p>Madame, Monsieur,</p>
          <p>Nous avons le plaisir de vous informer que votre candidature a été retenue pour participer à la formation en ligne organisée par la Ligue Régionale Drâa-Tafilalet de Football (LRTDF), via sa plateforme de formation E-LIGUE Academy.</p>
          <p>Afin de vous permettre d’accéder à votre espace personnel et de commencer votre parcours de formation, veuillez trouver ci-dessous vos informations d’authentification :</p>
        </div>

        <div class="section credentials">
          <h2>🔒 Identifiants d’accès à la plateforme</h2>
          <p><strong>Lien de connexion :</strong> <a href="https://e-ligue-academy.ma">https://e-ligue-academy.ma</a></p>
          <p><strong>Nom d’utilisateur :</strong> ${username}</p>
          <p><strong>Mot de passe temporaire :</strong> ${user.password} (à modifier lors de la première connexion)</p>
        </div>
        
        <div class="section">
          <h2>📌 Instructions importantes</h2>
          <ul>
            <li>Connectez-vous dans un délai de 48 heures pour activer votre compte.</li>
            <li>Après connexion, changez votre mot de passe temporaire.</li>
            <li>Une fois connecté(e), accédez à la rubrique “Aperçu des formations” pour démarrer le programme.</li>
            <li>En cas de difficulté, contactez le support technique : <a href="mailto:academy@e-ligue.ma">academy@e-ligue.ma</a></li>
          </ul>
        </div>
        
        <div class="section">
          <h2>📚 Informations sur la formation</h2>
          <p><strong>Thématique :</strong> Initiation à l’arbitrage</p>
          <p><strong>Durée :</strong> 4 semaines</p>
          <p><strong>Début de la formation :</strong> 15 juin 2025</p>
          <p><strong>Modalité :</strong> 100 % en ligne – vidéos, quiz, lectures et évaluation finale.</p>
        </div>
        
        <div class="footer">
          <p>Nous vous félicitons pour votre sélection et vous souhaitons plein succès dans ce parcours de formation, qui constitue une étape importante dans votre engagement sportif et professionnel.</p>
          <p>Sportivement,</p>
          <p class="signature">Le Comité de Formation<br>E-LIGUE Academy</p>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };
  
  const handlePrintTranscript = (user: User) => {
    const userProgressData = userProgress[user.id];
    const allAttempts = userProgressData ? Object.values(userProgressData).flatMap(fp => fp.examAttempts || []) : [];

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableRows = allAttempts.map(attempt => {
        const part = parts.find(p => p.id === attempt.partId);
        if (!part) return '';
        const observation = attempt.passed ? 'Admis' : 'Non admis';
        return `
            <tr>
                <td>${part.title}</td>
                <td>${attempt.lastScore !== undefined ? `${attempt.lastScore}%` : 'N/A'}</td>
                <td style="color: ${attempt.passed ? 'green' : 'red'}; font-weight: bold;">${observation}</td>
            </tr>
        `;
    }).join('');
    
    const printContent = `
        <html>
        <head>
            <title>Relevé de Notes - ${user.firstName} ${user.lastName}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 11pt; color: #333; margin: 2cm; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #eee; padding-bottom: 1cm; margin-bottom: 1cm; }
                .logo { font-family: "Century Gothic", sans-serif; font-weight: 800; font-size: 20pt; color: #3533cd; }
                h1 { text-align: center; font-size: 18pt; margin: 0; flex-grow: 1; }
                .info-box { border: 1px solid #ccc; padding: 1cm; border-radius: 8px; margin-bottom: 1.5cm; }
                .info-box p { margin: 0.3cm 0; }
                .info-box strong { display: inline-block; width: 150px; color: #555; }
                table { width: 100%; border-collapse: collapse; margin-top: 1cm; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">E-LIGUE Academy</div>
                <h1>Relevé de Notes</h1>
            </div>
            
            <div class="info-box">
                <p><strong>Nom et prénom:</strong> ${user.firstName} ${user.lastName}</p>
                <p><strong>CIN:</strong> ${user.cin}</p>
                <p><strong>Numéro de candidat:</strong> ${user.loginId}</p>
            </div>

            ${allAttempts.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Thématique</th>
                            <th>Note (%)</th>
                            <th>Observation</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            ` : `<p style="text-align: center; margin-top: 2cm;">Aucun examen n'a encore été passé par ce candidat.</p>`}
        </body>
        </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
  };


  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <button onClick={() => setEditingUser({})} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Ajouter un utilisateur
        </button>
      </div>

      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Rechercher par nom, login, CINE..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Tous les statuts</option>
          {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
        </select>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Télécharger en PDF
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                        <span className="font-semibold">Login:</span> {user.loginId} | <span className="font-semibold">CINE:</span> {user.cin}
                    </div>
                    {[UserRole.Arbitre, UserRole.Entraineur, UserRole.Employe, UserRole.Club].includes(user.role) && (
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${calculateOverallProgress(user)}%` }}></div>
                            </div>
                             <p className="text-xs text-right text-gray-500 mt-1">Progression: {calculateOverallProgress(user)}%</p>
                        </div>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                   <button onClick={() => handlePrintTranscript(user)} className="text-gray-500 hover:text-gray-700" title="Télécharger le relevé de notes">
                     <DocumentChartBarIcon className="w-5 h-5" />
                   </button>
                   <button onClick={() => handlePrintNotification(user)} className="text-gray-500 hover:text-gray-700" title="Imprimer la notification">
                     <PrinterIcon className="w-5 h-5" />
                   </button>
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
      
      {editingUser && <UserFormModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSave} formations={formations} isLoginIdUnique={isLoginIdUnique} />}
    </div>
  );
};

export default AdminDashboard;