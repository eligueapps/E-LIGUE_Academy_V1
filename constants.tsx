import React from 'react';
import { User, Formation, Part, Course, Exam, UserRole, CourseType } from './types';

// Icons
export const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
);
export const LockClosedIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
);
export const PlayCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
);
export const VideoCameraIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412a9.957 9.957 0 00-6.54-5.493z" /></svg>
);
export const DocumentTextIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}><path fillRule="evenodd" d="M4.25 5.5A.75.75 0 003.5 6.25v7.5A.75.75 0 004.25 14h11.5a.75.75 0 00.75-.75v-7.5A.75.75 0 0015.75 5.5H4.25zM5.5 7a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 015.5 7zm0 2.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zm0 2.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
);
export const PencilIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>
);
export const TrashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1H8.75zM10 4.5a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0v-8.5A.75.75 0 0110 4.5z" clipRule="evenodd" /></svg>
);
export const ArrowPathIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201-4.456 5.5 5.5 0 011.533-2.006l.51.511a.75.75 0 001.06-1.06l-1.59-1.59a.75.75 0 00-1.06 0l-1.59 1.59a.75.75 0 101.06 1.06l.509-.51a4 4 0 00-1.09 3.882 4 4 0 006.68 2.84l.876.875a.75.75 0 001.06-1.06l-.875-.876a4 4 0 00-2.84-6.68 4.002 4.002 0 00-3.882 1.09l.51-.509a.75.75 0 00-1.06-1.06l-1.59 1.59a.75.75 0 000 1.06l1.59 1.59a.75.75 0 101.06-1.06l-.51-.51a2.5 2.5 0 011.83-4.192 2.5 2.5 0 011.767 4.266l.875.876a.75.75 0 001.06 1.06l-.876-.875a2.5 2.5 0 01-4.266-1.767 2.5 2.5 0 014.192-1.83l.51.51a.75.75 0 101.06-1.06l-1.59-1.59a.75.75 0 00-1.06 0l-1.59 1.59a.75.75 0 101.06 1.06l.51-.51A5.48 5.48 0 0110 5.5a5.5 5.5 0 014.456 9.201l-1.144 1.144a.75.75 0 101.06 1.06l1.59-1.59a.75.75 0 000-1.06l-1.59-1.59a.75.75 0 00-1.06 1.06l1.144 1.143z" clipRule="evenodd" /></svg>
);
export const UserCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg>
);


// Mock Data
export const INITIAL_USERS: User[] = [
  { id: 1, firstName: 'Jean', lastName: 'Dupont', birthDate: '1985-05-20', cin: 'AB123456', role: UserRole.Arbitre, email: 'arbitre@ligue.com', password: 'password', isActive: true, assignedFormationIds: [1] },
  { id: 2, firstName: 'Marie', lastName: 'Curie', birthDate: '1990-11-15', cin: 'CD789012', role: UserRole.Entraineur, email: 'entraineur@ligue.com', password: 'password', isActive: true, assignedFormationIds: [1] },
  { id: 3, firstName: 'Pierre', lastName: 'Martin', birthDate: '1980-01-30', cin: 'EF345678', role: UserRole.Administrateur, email: 'admin@ligue.com', password: 'admin', isActive: true, assignedFormationIds: [] },
  { id: 4, firstName: 'Sophie', lastName: 'Bernard', birthDate: '1992-07-22', cin: 'GH901234', role: UserRole.Employe, email: 'employe@ligue.com', password: 'password', isActive: false, assignedFormationIds: [1] },
  { id: 5, firstName: 'Admin', lastName: 'Principal', birthDate: '1995-02-22', cin: 'ADMIN', role: UserRole.Administrateur, email: 'eligue_academy_admin', password: 'Ca@199522;;', isActive: true, assignedFormationIds: [] },
];

export const INITIAL_COURSES: Course[] = [
  { id: 101, title: 'Introduction aux règles du jeu', type: CourseType.VIDEO, content: 'https://www.youtube.com/embed/8ca4qNI4qYI', quickTestQuestions: [
    {id: 1, text: 'Quelle est la première règle du club?', options: ["On ne parle pas du club", "Toujours être à l'heure", "Respecter l'adversaire"], correctAnswerIndex: 0}
  ]},
  { id: 102, title: 'Le hors-jeu expliqué', type: CourseType.ARTICLE, content: 'Le hors-jeu est une règle fondamentale du football. Un joueur est en position de hors-jeu s\'il est plus près de la ligne de but adverse que le ballon et l\'avant-dernier adversaire. Cette règle vise à empêcher les attaquants de rester près du but adverse pour marquer facilement.', quickTestQuestions: [
     {id: 2, text: 'Quand un joueur est-il hors-jeu?', options: ["Derrière le ballon", "Plus près de la ligne de but que le ballon et l'avant-dernier adversaire", "Quand il touche le ballon"], correctAnswerIndex: 1}
  ]},
  { id: 103, title: 'Gestion des cartons', type: CourseType.PDF, content: 'path/to/document1.pdf', quickTestQuestions: []},
  { id: 201, title: 'Stratégies défensives', type: CourseType.VIDEO, content: 'https://www.youtube.com/embed/8ca4qNI4qYI', quickTestQuestions: [] },
  { id: 202, title: 'Construire une attaque', type: CourseType.ARTICLE, content: 'Contenu de l\'article sur les attaques...', quickTestQuestions: [] },
];

export const INITIAL_EXAMS: Exam[] = [
  { id: 1, title: 'Examen - Les Fondamentaux', passingScore: 80, questions: [
    {id: 1, text: "Combien de joueurs y a-t-il dans une équipe de football sur le terrain?", options: ["10", "11", "12", "9"], correctAnswerIndex: 1},
    {id: 2, text: "Que signifie un carton jaune?", options: ["Expulsion", "Avertissement", "Changement de joueur", "But"], correctAnswerIndex: 1},
    {id: 3, text: "Quelle est la durée d'un match de football standard?", options: ["80 minutes", "90 minutes", "100 minutes", "120 minutes"], correctAnswerIndex: 1},
  ]},
  { id: 2, title: 'Examen - Stratégies Avancées', passingScore: 70, questions: [
    {id: 4, text: "Quelle formation est la plus défensive?", options: ["4-4-2", "4-3-3", "5-3-2", "3-5-2"], correctAnswerIndex: 2},
    {id: 5, text: "Qu'est-ce que le 'pressing'?", options: ["Une passe longue", "Une technique de tir", "Une tactique pour récupérer le ballon", "Une célébration"], correctAnswerIndex: 2},
  ]},
];

export const INITIAL_PARTS: Part[] = [
  { id: 1, title: 'Partie 1: Les Fondamentaux', courseIds: [101, 102, 103], examId: 1 },
  { id: 2, title: 'Partie 2: Stratégies Avancées', courseIds: [201, 202], examId: 2 },
];

export const INITIAL_FORMATIONS: Formation[] = [
  { 
    id: 1, 
    title: 'Formation Initiale des Arbitres', 
    description: 'Apprenez les bases de l\'arbitrage, des règles du jeu à la gestion de match.', 
    partIds: [1, 2],
    imageUrl: 'https://images.unsplash.com/photo-1599408998246-e575d2753a22?q=80&w=2070&auto=format&fit=crop'
  }
];