import React, { useState, useCallback } from 'react';
import { User, UserRole, UserProgress, Formation, Part, Course, Exam, CourseType } from './types';
import { INITIAL_USERS, INITIAL_FORMATIONS, INITIAL_PARTS, INITIAL_COURSES, INITIAL_EXAMS, UserCircleIcon } from './constants';
import { translations } from './i18n';
import LoginScreen from './components/LoginScreen';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import FormationScreen from './components/FormationScreen';
import FormationManagement from './components/FormationManagement';
import ProfileScreen from './components/ProfileScreen';
import Logo from './components/Logo';

const Header: React.FC<{
  user: User;
  onLogout: () => void;
  onShowProfile: () => void;
  language: 'fr' | 'ar';
  setLanguage: (lang: 'fr' | 'ar') => void;
  adminView?: 'users' | 'dashboard' | 'management';
  setAdminView?: (view: 'users' | 'dashboard' | 'management') => void;
}> = ({ user, onLogout, onShowProfile, language, setLanguage, adminView, setAdminView }) => {
    const t = translations[language];
    const isPrivileged = user.role === UserRole.Administrateur || user.role === UserRole.Formateur;

    return (
        <header className="bg-white shadow-md sticky top-0 z-40" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="p-4 flex justify-between items-center">
                <Logo className="header-logo" />
                <div className="flex items-center space-x-4">
                    <select 
                        value={language} 
                        onChange={e => setLanguage(e.target.value as 'fr' | 'ar')}
                        className="p-1 border rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="fr">{t.french}</option>
                        <option value="ar">{t.arabic}</option>
                    </select>
                    <button onClick={onShowProfile} className="text-gray-600 hover:text-indigo-600" aria-label={t.profile}>
                        <UserCircleIcon className="w-7 h-7" />
                    </button>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-600"
                    >
                        {t.logout}
                    </button>
                </div>
            </div>
            {isPrivileged && setAdminView && (
                <nav className="px-4 flex space-x-4 border-b">
                    {user.role === UserRole.Administrateur && (
                         <button
                            onClick={() => setAdminView('users')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                adminView === 'users' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {t.userManagement}
                        </button>
                    )}
                    <button
                        onClick={() => setAdminView('dashboard')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                            adminView === 'dashboard' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t.formationsOverview}
                    </button>
                    <button
                        onClick={() => setAdminView('management')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                            adminView === 'management' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t.formationsManagement}
                    </button>
                </nav>
            )}
        </header>
    );
};

// New component for forcing password change
const ForcePasswordChangeModal: React.FC<{
  onSave: (newPass: string) => void;
  user: User;
}> = ({ onSave, user }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    onSave(newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Changement de mot de passe requis</h2>
        <p className="text-gray-600 mb-6">Bonjour {user.firstName}, pour des raisons de sécurité, veuillez définir un nouveau mot de passe pour votre première connexion.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end pt-4">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Enregistrer le mot de passe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [view, setView] = useState<'dashboard' | 'formation' | 'profile'>('dashboard');
  const [selectedFormationId, setSelectedFormationId] = useState<number | null>(null);
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  
  // Centralized state for all app data
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [formations, setFormations] = useState<Formation[]>(INITIAL_FORMATIONS);
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  
  const [userProgress, setUserProgress] = useState<{ [userId: number]: UserProgress }>({});
  const [adminView, setAdminView] = useState<'users' | 'dashboard' | 'management'>('users');
  const [forcePasswordChange, setForcePasswordChange] = useState(false);

  const handleAdminViewChange = (newAdminView: 'users' | 'dashboard' | 'management') => {
    // If the user is on the profile page, navigating to another admin tab
    // should close the profile and return to the dashboard view.
    if (view === 'profile') {
      setView('dashboard');
    }
    setAdminView(newAdminView);
  };

  const handleLogin = useCallback((emailOrLoginId: string, pass: string) => {
    const user = users.find(u => (u.email === emailOrLoginId || u.loginId === emailOrLoginId) && u.password === pass);
    if (user) {
      if (!user.isActive) {
        setLoginError("Ce compte est désactivé.");
        return;
      }
      setCurrentUser(user);
      setLoginError(null);

      if (user.mustChangePassword) {
          setForcePasswordChange(true);
      } else {
          setView('dashboard');
          if (user.role === UserRole.Administrateur) {
            setAdminView('users');
          } else if (user.role === UserRole.Formateur) {
            setAdminView('dashboard');
          }
      }
    } else {
      setLoginError("Identifiant ou mot de passe incorrect.");
    }
  }, [users]);

  // --- CRUD Handlers ---
  const handleSaveUser = (userToSave: Partial<User>) => {
    if (userToSave.id) {
      setUsers(users.map(u => (u.id === userToSave.id ? { ...u, ...userToSave } as User : u)));
    } else {
      const newUser: User = { 
          ...userToSave, 
          id: Math.max(...users.map(u => u.id), 0) + 1,
          mustChangePassword: true,
      } as User;
      setUsers([...users, newUser]);
    }
  };
  const handleDeleteUser = (userId: number) => setUsers(users.filter(u => u.id !== userId));
  const handleToggleUserStatus = (userId: number) => setUsers(users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  
  const handleSaveFormation = (formationToSave: Partial<Formation>) => {
     if (formationToSave.id) {
      setFormations(formations.map(f => (f.id === formationToSave.id ? { ...f, ...formationToSave } as Formation : f)));
    } else {
      const newFormation: Formation = { 
          ...formationToSave, 
          id: Math.max(...formations.map(f => f.id), 0) + 1,
          partIds: [],
      } as Formation;
      setFormations([...formations, newFormation]);
    }
  }
  const handleDeleteFormation = (formationId: number) => setFormations(formations.filter(f => f.id !== formationId));
  
  const handleSavePart = (formationId: number, partToSave: Partial<Part>) => {
    if (partToSave.id) {
        setParts(prev => prev.map(p => p.id === partToSave.id ? {...p, ...partToSave} as Part : p));
    } else {
        const newExam: Exam = {
          id: Math.max(0, ...exams.map(e => e.id)) + 1,
          title: `Examen - ${partToSave.title || "Nouvelle partie"}`,
          questions: [],
          passingScore: 80
        };
        setExams(prev => [...prev, newExam]);
        
        const newPart: Part = {
            id: Math.max(0, ...parts.map(p => p.id)) + 1,
            title: partToSave.title || "Nouvelle partie",
            courseIds: [],
            examId: newExam.id
        };
        setParts(prev => [...prev, newPart]);
        setFormations(prev => prev.map(f =>
            f.id === formationId
            ? { ...f, partIds: [...f.partIds, newPart.id] }
            : f
        ));
    }
  };

  const handleDeletePart = (formationId: number, partId: number) => {
    const partToDelete = parts.find(p => p.id === partId);
    if (!partToDelete) return;

    setCourses(prev => prev.filter(c => !partToDelete.courseIds.includes(c.id)));
    setExams(prev => prev.filter(e => e.id !== partToDelete.examId));
    setParts(prev => prev.filter(p => p.id !== partId));
    setFormations(prev => prev.map(f =>
      f.id === formationId
      ? { ...f, partIds: f.partIds.filter(id => id !== partId) }
      : f
    ));
  };

  const handleSaveCourse = (partId: number, courseToSave: Partial<Course>) => {
    if (courseToSave.id) {
        setCourses(prev => prev.map(c => c.id === courseToSave.id ? {...c, ...courseToSave} as Course : c));
    } else {
        const newCourse: Course = {
            id: Math.max(0, ...courses.map(c => c.id)) + 1,
            title: courseToSave.title || "Nouveau cours",
            type: courseToSave.type || CourseType.ARTICLE,
            content: courseToSave.content || "Contenu à rédiger...",
            quickTestQuestions: courseToSave.quickTestQuestions || []
        };
        setCourses(prev => [...prev, newCourse]);
        setParts(prev => prev.map(p =>
            p.id === partId
            ? { ...p, courseIds: [...p.courseIds, newCourse.id] }
            : p
        ));
    }
  };
  
  const handleDeleteCourse = (partId: number, courseId: number) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setParts(prev => prev.map(p => 
      p.id === partId
      ? { ...p, courseIds: p.courseIds.filter(id => id !== courseId) }
      : p
    ));
  };

  const handleSaveExam = (examToSave: Exam) => {
    setExams(prev => prev.map(e => (e.id === examToSave.id ? examToSave : e)));
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setView('dashboard');
  };
  const handleSelectFormation = (formationId: number) => {
      setSelectedFormationId(formationId);
      setView('formation');
  };
  const handleBackToDashboard = () => {
      setSelectedFormationId(null);
      setView('dashboard');
  };
  const handleShowProfile = () => setView('profile');

  const handleChangePassword = (currentPass: string, newPass: string): boolean => {
    if (!currentUser || currentUser.password !== currentPass) return false;
    
    const updatedUser = { ...currentUser, password: newPass };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => (u.id === currentUser.id ? updatedUser : u)));
    return true;
  };

  const handleForceChangePassword = (newPass: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, password: newPass, mustChangePassword: false };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => (u.id === currentUser.id ? updatedUser : u)));
    setForcePasswordChange(false);
    setView('dashboard');
  };

  const handleProgressUpdate = (formationId: number, newProgressData: UserProgress[number]) => {
    if (!currentUser) return;
    setUserProgress(prev => ({
      ...prev,
      [currentUser.id]: {
        ...(prev[currentUser.id] || {}),
        [formationId]: newProgressData,
      },
    }));
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  const renderDashboardContent = () => {
    const role = currentUser.role;

    if (role === UserRole.Administrateur) {
        switch (adminView) {
            case 'users':
                return <AdminDashboard 
                    users={users} 
                    formations={formations} 
                    onSaveUser={handleSaveUser} 
                    onDeleteUser={handleDeleteUser} 
                    onToggleUserStatus={handleToggleUserStatus}
                    userProgress={userProgress}
                    parts={parts}
                    exams={exams}
                />;
            case 'management':
                return <FormationManagement 
                    formations={formations}
                    parts={parts}
                    courses={courses}
                    exams={exams}
                    onSaveFormation={handleSaveFormation}
                    onDeleteFormation={handleDeleteFormation}
                    onSavePart={handleSavePart}
                    onDeletePart={handleDeletePart}
                    onSaveCourse={handleSaveCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onSaveExam={handleSaveExam}
                />;
            case 'dashboard':
            default:
                return <StudentDashboard
                    user={currentUser}
                    userProgress={userProgress[currentUser.id] || {}}
                    onSelectFormation={handleSelectFormation}
                    formations={formations}
                    parts={parts}
                    courses={courses}
                />;
        }
    } else if (role === UserRole.Formateur) {
        switch (adminView) {
            case 'management':
                return <FormationManagement 
                    formations={formations}
                    parts={parts}
                    courses={courses}
                    exams={exams}
                    onSaveFormation={handleSaveFormation}
                    onDeleteFormation={handleDeleteFormation}
                    onSavePart={handleSavePart}
                    onDeletePart={handleDeletePart}
                    onSaveCourse={handleSaveCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onSaveExam={handleSaveExam}
                />;
            case 'dashboard':
            default:
                 return <StudentDashboard
                    user={currentUser}
                    userProgress={userProgress[currentUser.id] || {}}
                    onSelectFormation={handleSelectFormation}
                    formations={formations}
                    parts={parts}
                    courses={courses}
                />;
        }
    } else { // Candidates
        return <StudentDashboard
            user={currentUser}
            userProgress={userProgress[currentUser.id] || {}}
            onSelectFormation={handleSelectFormation}
            formations={formations}
            parts={parts}
            courses={courses}
        />;
    }
  };

  const renderContent = () => {
      switch(view) {
          case 'profile':
            return <ProfileScreen 
                user={currentUser}
                userProgress={userProgress[currentUser.id] || {}}
                formations={formations}
                parts={parts}
                allCourses={courses}
                language={language}
                onBackToDashboard={handleBackToDashboard}
                onChangePassword={handleChangePassword}
            />;
          case 'formation':
            return selectedFormationId ? <FormationScreen
                    formationId={selectedFormationId}
                    user={currentUser}
                    userProgress={userProgress[currentUser.id] || {}}
                    onProgressUpdate={handleProgressUpdate}
                    onBackToDashboard={handleBackToDashboard}
                    formations={formations}
                    parts={parts}
                    courses={courses}
                    exams={exams}
                /> : null;
            case 'dashboard':
            default:
                return renderDashboardContent();
      }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        user={currentUser}
        onLogout={handleLogout}
        onShowProfile={handleShowProfile}
        language={language}
        setLanguage={setLanguage}
        adminView={adminView}
        setAdminView={(currentUser.role === UserRole.Administrateur || currentUser.role === UserRole.Formateur) ? handleAdminViewChange : undefined}
      />
      <main>{renderContent()}</main>
      {forcePasswordChange && currentUser && (
        <ForcePasswordChangeModal onSave={handleForceChangePassword} user={currentUser} />
      )}
    </div>
  );
};

export default App;