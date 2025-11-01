import React, { useState, useMemo } from 'react';
// Fix: Imported FormationProgress to explicitly type the iterated object.
import { User, UserProgress, Formation, Part, Course, UserRole, FormationProgress } from '../types';
import { translations } from '../i18n';

interface ProfileScreenProps {
  user: User;
  userProgress: UserProgress;
  formations: Formation[];
  parts: Part[];
  allCourses: Course[];
  language: 'fr' | 'ar';
  onBackToDashboard: () => void;
  onChangePassword: (currentPass: string, newPass: string) => boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  userProgress,
  formations,
  parts,
  allCourses,
  language,
  onBackToDashboard,
  onChangePassword,
}) => {
  const t = translations[language];

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const assignedFormations = useMemo(() => {
    if (user.role === UserRole.Administrateur) return formations;
    return formations.filter(f => user.assignedFormationIds.includes(f.id));
  }, [formations, user]);

  const { totalCourses, completedCourses } = useMemo(() => {
    let total = 0;
    let completed = 0;

    const progressForUser = userProgress || {};

    for (const formation of assignedFormations) {
        const progress = progressForUser[formation.id];
        const formationParts = parts.filter(p => formation.partIds.includes(p.id));
        const formationCoursesCount = formationParts.reduce((sum, part) => sum + part.courseIds.length, 0);
        total += formationCoursesCount;
        if(progress) {
            completed += progress.completedCourseIds.length;
        }
    }
    return { totalCourses: total, completedCourses: completed };
  }, [assignedFormations, userProgress, parts]);

  const overallProgressPercentage = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;
  
  const completedPartsWithAttestation = useMemo(() => {
    const completed = new Set<Part>();
    const progressForUser = userProgress || {};

    // Fix: Explicitly typed 'formationProgress' to avoid 'unknown' type from Object.values().
    Object.values(progressForUser).forEach((formationProgress: FormationProgress) => {
        if(formationProgress.examAttempts) {
            for (const attempt of formationProgress.examAttempts) {
                if (attempt.passed) {
                    const part = parts.find(p => p.id === attempt.partId);
                    if(part) completed.add(part);
                }
            }
        }
    });
    return Array.from(completed);
  }, [userProgress, parts]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' });
      return;
    }
    const success = onChangePassword(currentPassword, newPassword);
    if (success) {
      setPasswordMessage({ type: 'success', text: t.passwordChanged });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMessage({ type: 'error', text: 'Le mot de passe actuel est incorrect.' });
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto">
            <button onClick={onBackToDashboard} className="mb-4 text-sm text-indigo-600 hover:underline">
                &larr; {t.backToDashboard}
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{t.profile}</h1>

            {/* Overall Progress */}
            {user.role !== UserRole.Administrateur && (
                <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-3">{t.overallProgress}</h2>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${overallProgressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-right text-sm text-gray-600 mt-2">{Math.round(overallProgressPercentage)}%</p>
                </div>
            )}
            
            <div className="grid md:grid-cols-3 gap-8">
                {/* Personal Info */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t.personalInfo}</h2>
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="font-semibold text-gray-500">{t.fullName}</p>
                            <p className="text-gray-800">{user.firstName} {user.lastName}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-500">{t.status}</p>
                            <p className="text-gray-800">{user.role}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-500">{t.cin}</p>
                            <p className="text-gray-800">{user.cin}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-500">{t.birthDate}</p>
                            <p className="text-gray-800">{new Date(user.birthDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'ar-EG')}</p>
                        </div>
                    </div>
                </div>

                {/* Account Management & Attestations */}
                <div className="md:col-span-2 space-y-8">
                     {/* Attestations */}
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">{t.myAttestations}</h2>
                        {completedPartsWithAttestation.length > 0 ? (
                            <ul className="space-y-2">
                                {completedPartsWithAttestation.map(part => (
                                    <li key={part.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                        <span className="text-gray-700">{part.title}</span>
                                        <button className="text-sm font-medium text-indigo-600 hover:underline">{t.download}</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">{t.noAttestations}</p>
                        )}
                    </div>
                    {/* Change Password */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">{t.changePassword}</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <input type="password" placeholder={t.currentPassword} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full p-2 border rounded-md"/>
                            <input type="password" placeholder={t.newPassword} value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full p-2 border rounded-md"/>
                            <input type="password" placeholder={t.confirmNewPassword} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-2 border rounded-md"/>
                            {passwordMessage && <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{passwordMessage.text}</p>}
                            <div className="text-right">
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{t.savePassword}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfileScreen;