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
  isAdmin: boolean;
  adminView?: 'users' | 'dashboard' | 'management';
  setAdminView?: (view: 'users' | 'dashboard' | 'management') => void;
}> = ({ user, onLogout, onShowProfile, language, setLanguage, isAdmin, adminView, setAdminView }) => {
    const t = translations[language];
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
            {isAdmin && setAdminView && (
                <nav className="px-4 flex space-x-4 border-b">
                    <button
                        onClick={() => setAdminView('users')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                            adminView === 'users' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t.userManagement}
                    </button>
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

  const handleLogin = useCallback((email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      if (!user.isActive) {
        setLoginError("Ce compte est désactivé.");
        return;
      }
      setCurrentUser(user);
      setLoginError(null);
      setView('dashboard');
      if (user.role === UserRole.Administrateur) {
        setAdminView('users');
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
          assignedFormationIds: [],
          password: 'password', // Default password
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
          passingScore: 70
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
    if (currentUser.role === UserRole.Administrateur) {
      switch (adminView) {
        case 'users':
          return <AdminDashboard users={users} onSaveUser={handleSaveUser} onDeleteUser={handleDeleteUser} onToggleUserStatus={handleToggleUserStatus} />;
        case 'dashboard':
          return (
            <StudentDashboard
              user={currentUser}
              userProgress={userProgress[currentUser.id] || {}}
              onSelectFormation={handleSelectFormation}
              formations={formations}
              parts={parts}
              courses={courses}
            />
          );
        case 'management':
            return (
                <FormationManagement 
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
                />
            );
        default:
          return <AdminDashboard users={users} onSaveUser={handleSaveUser} onDeleteUser={handleDeleteUser} onToggleUserStatus={handleToggleUserStatus} />;
      }
    } else {
      return (
        <StudentDashboard
          user={currentUser}
          userProgress={userProgress[currentUser.id] || {}}
          onSelectFormation={handleSelectFormation}
          formations={formations}
          parts={parts}
          courses={courses}
        />
      );
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
        isAdmin={currentUser.role === UserRole.Administrateur}
        adminView={adminView}
        setAdminView={currentUser.role === UserRole.Administrateur ? setAdminView : undefined}
      />
      <main>{renderContent()}</main>
    </div>
  );
};

export default App;