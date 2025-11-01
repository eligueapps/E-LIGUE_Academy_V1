import React from 'react';
import { Formation, User, UserProgress, UserRole, Course, Part } from '../types';

interface StudentDashboardProps {
  user: User;
  userProgress: UserProgress;
  onSelectFormation: (formationId: number) => void;
  formations: Formation[];
  parts: Part[];
  courses: Course[];
}

const FormationOverviewCard: React.FC<{
  formation: Formation;
  progressPercentage: number;
  onClick: () => void;
}> = ({ formation, progressPercentage, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <img className="h-48 w-full object-cover" src={formation.imageUrl || 'https://placehold.co/600x400/e2e8f0/e2e8f0'} alt={formation.title} />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{formation.title}</h3>
        <p className="text-gray-600 mb-4 h-12 flex-grow">{formation.description}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-auto">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-500 mt-2">{Math.round(progressPercentage)}% complété</p>
      </div>
    </div>
  );
};


const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, userProgress, onSelectFormation, formations, parts, courses }) => {
  const formationsToDisplay = (user.role === UserRole.Administrateur || user.role === UserRole.Formateur)
    ? formations
    : formations.filter(f => user.assignedFormationIds.includes(f.id));

  const getFormationCourses = (formationId: number): Course[] => {
    const formation = formations.find(f => f.id === formationId);
    if (!formation) return [];
    
    const partIds = formation.partIds;
    const partsInFormation = parts.filter(p => partIds.includes(p.id));
    
    const courseIds = partsInFormation.flatMap(p => p.courseIds);
    return courses.filter(c => courseIds.includes(c.id));
  }
    
  const calculateProgress = (formationId: number) => {
    if (user.role === UserRole.Administrateur || user.role === UserRole.Formateur) return 0;

    const progress = userProgress[formationId];
    if (!progress) return 0;

    const totalCourses = getFormationCourses(formationId).length;
    if (totalCourses === 0) return 100; // No courses means 100% complete
    
    return (progress.completedCourseIds.length / totalCourses) * 100;
  };
  
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
      <p className="text-lg text-gray-600 mb-8">Bonjour {user.firstName}, bienvenue sur votre espace d'apprentissage.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {formationsToDisplay.length > 0 ? (
          formationsToDisplay.map(formation => (
            <FormationOverviewCard 
              key={formation.id}
              formation={formation}
              progressPercentage={calculateProgress(formation.id)}
              onClick={() => onSelectFormation(formation.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">
              {(user.role === UserRole.Administrateur || user.role === UserRole.Formateur)
                ? "Aucune formation n'a encore été créée."
                : "Aucune formation ne vous est actuellement assignée."
              }
            </p>
         </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;