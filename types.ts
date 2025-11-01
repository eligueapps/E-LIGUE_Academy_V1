export enum UserRole {
  Arbitre = 'Arbitre',
  Entraineur = 'Entraîneur',
  Employe = 'Employé',
  Formateur = 'Formateur',
  Club = 'Club',
  Administrateur = 'Administrateur',
}

export enum CourseType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  PDF = 'PDF',
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  cin: string;
  role: UserRole;
  email: string;
  phone?: string;
  loginId: string;
  password?: string; // Should be hashed in a real app
  mustChangePassword?: boolean;
  isActive: boolean;
  assignedFormationIds: number[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Course {
  id: number;
  title: string;
  type: CourseType;
  content: string; // URL for video/pdf or markdown for article
  quickTestQuestions: Question[];
}

export interface Exam {
  id: number;
  title: string;
  questions: Question[];
  passingScore: number; // e.g. 70 for 70%
}

export interface Part {
  id: number;
  title: string;
  courseIds: number[];
  examId: number;
}

export interface Formation {
  id: number;
  title: string;
  description: string;
  partIds: number[];
  imageUrl?: string;
}

export interface ExamAttempt {
  partId: number;
  attempts: number;
  lastScore?: number;
  passed: boolean;
}

// Fix: Created a named interface for formation progress to improve type inference.
export interface FormationProgress {
  completedCourseIds: number[];
  examAttempts: ExamAttempt[];
}

export interface UserProgress {
  [formationId: number]: FormationProgress;
}