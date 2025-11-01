import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Formation, Part, Course, User, UserProgress, Exam, CourseType } from '../types';
import { CheckCircleIcon, LockClosedIcon, PlayCircleIcon, VideoCameraIcon, DocumentTextIcon } from '../constants';

const getYouTubeVideoId = (url: string): string | null => {
  if (!url) {
    return null;
  }
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|watch\?v=)|(?:shorts\/))([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[1] && match[1].length === 11) ? match[1] : null;
};

// --- YouTube Player API Implementation ---
let apiPromise: Promise<void> | null = null;
const loadYouTubeApi = () => {
    if (!apiPromise) {
        apiPromise = new Promise((resolve) => {
            if (typeof window !== 'undefined' && (window as any).YT && (window as any).YT.Player) {
                return resolve();
            }
            const previousCallback = (window as any).onYouTubeIframeAPIReady;
            (window as any).onYouTubeIframeAPIReady = () => {
                if (previousCallback) {
                    previousCallback();
                }
                resolve();
            };
            if (typeof window !== 'undefined' && !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
            }
        });
    }
    return apiPromise;
};

const useYouTubeApi = () => {
  const [isReady, setIsReady] = useState(!!(typeof window !== 'undefined' && (window as any).YT && (window as any).YT.Player));

  useEffect(() => {
    if (isReady) return;
    let isMounted = true;
    loadYouTubeApi().then(() => {
        if (isMounted) {
            setIsReady(true);
        }
    });
    return () => { isMounted = false; };
  }, [isReady]);

  return isReady;
};

const YouTubePlayer: React.FC<{ videoId: string, onEnded: () => void, title: string }> = ({ videoId, onEnded, title }) => {
  const playerRef = useRef<any>(null); // YT.Player
  const playerContainerId = useMemo(() => `yt-player-container-${videoId}-${Math.random().toString(36).substring(7)}`, [videoId]);
  const isApiReady = useYouTubeApi();

  useEffect(() => {
    if (!isApiReady || !document.getElementById(playerContainerId)) {
      return;
    }

    const onPlayerStateChange = (event: any) => { // YT.OnStateChangeEvent
      if (event.data === (window as any).YT.PlayerState.ENDED) {
        onEnded();
      }
    };
    
    const onError = (event: any) => {
      console.error(`YouTube Player Error for video ${videoId}:`, event.data);
    };

    playerRef.current = new (window as any).YT.Player(playerContainerId, {
      host: 'https://www.youtube-nocookie.com', // Use privacy-enhanced mode to avoid embedding errors.
      videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        origin: window.location.origin, // Explicitly set origin to fix embedding errors in sandboxed environments.
        playsinline: 1,
        rel: 0,
        modestbranding: 1
      },
      events: {
        'onStateChange': onPlayerStateChange,
        'onError': onError
      }
    });

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    }
  }, [isApiReady, videoId, onEnded, playerContainerId]);

  return <div id={playerContainerId} className="w-full h-full" />;
};


const CourseContent: React.FC<{ course: Course, onComplete: () => void }> = ({ course, onComplete }) => {
    const [answers, setAnswers] = useState<{[key: number]: number}>({});
    const [submitted, setSubmitted] = useState(false);
    const [isVideoWatched, setIsVideoWatched] = useState(course.type !== CourseType.VIDEO);

    const videoId = useMemo(() => getYouTubeVideoId(course.content), [course.content]);

    useEffect(() => {
        setAnswers({});
        setSubmitted(false);
        setIsVideoWatched(course.type !== CourseType.VIDEO);
    }, [course.id, course.type]);

    const handleVideoEnded = () => {
        setIsVideoWatched(true);
        if (course.quickTestQuestions.length === 0) {
            onComplete();
        }
    };

    const allCorrect = useMemo(() => {
        if (course.quickTestQuestions.length === 0) return true;
        if (Object.keys(answers).length !== course.quickTestQuestions.length) return false;
        return course.quickTestQuestions.every(q => answers[q.id] === q.correctAnswerIndex);
    }, [answers, course.quickTestQuestions]);
    
    const showCompletionButton = course.type !== CourseType.VIDEO || course.quickTestQuestions.length > 0;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-4">{course.title}</h2>
            {course.type === CourseType.VIDEO && videoId && (
                <div className="mb-4">
                    <div className="aspect-video rounded-lg shadow-lg overflow-hidden relative bg-black">
                       <YouTubePlayer videoId={videoId} onEnded={handleVideoEnded} title={course.title}/>
                    </div>
                </div>
            )}
            {course.type === CourseType.VIDEO && !videoId && (
                 <div className="aspect-video bg-gray-200 flex items-center justify-center rounded-lg shadow-lg">
                    <p className="text-gray-500">Lien vidéo invalide ou format non supporté.</p>
                </div>
            )}
            {course.type === CourseType.ARTICLE && <div className="prose lg:prose-xl max-w-none bg-white p-6 rounded-lg shadow">{course.content}</div>}
            {course.type === CourseType.PDF && <a href={course.content} target="_blank" rel="noopener noreferrer" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">Télécharger le PDF</a>}
            
            {course.quickTestQuestions.length > 0 && (
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Test Rapide</h3>
                    {course.quickTestQuestions.map(q => (
                        <div key={q.id} className="mb-4">
                            <p className="font-medium">{q.text}</p>
                            <div className="space-y-2 mt-2">
                                {q.options.map((opt, index) => (
                                    <label key={index} className={`block p-2 rounded-md border ${submitted && index === q.correctAnswerIndex ? 'border-green-500 bg-green-100' : ''} ${submitted && answers[q.id] === index && index !== q.correctAnswerIndex ? 'border-red-500 bg-red-100' : ''}`}>
                                        <input type="radio" name={`q-${q.id}`} value={index} onChange={() => setAnswers(prev => ({...prev, [q.id]: index}))} disabled={submitted || !isVideoWatched} className="mr-2"/>
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    {!submitted && <button onClick={() => setSubmitted(true)} disabled={!isVideoWatched} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-400">Vérifier</button>}
                </div>
            )}

            {showCompletionButton && (
                 <div className="mt-8 text-center">
                     <button 
                        onClick={onComplete} 
                        disabled={!isVideoWatched || (course.quickTestQuestions.length > 0 && (!submitted || !allCorrect))}
                        className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                     >
                        Marquer comme terminé
                    </button>
                 </div>
            )}
        </div>
    );
}


const ExamContent: React.FC<{ exam: Exam, onFinishExam: (score: number) => void }> = ({ exam, onFinishExam }) => {
    const [answers, setAnswers] = useState<{[key: number]: number}>({});

    const handleSubmit = () => {
        let correctCount = 0;
        exam.questions.forEach(q => {
            if(answers[q.id] === q.correctAnswerIndex) {
                correctCount++;
            }
        });
        const score = Math.round((correctCount / exam.questions.length) * 100);
        onFinishExam(score);
    }
    
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">{exam.title}</h2>
            <div className="space-y-6">
                {exam.questions.map((q, qIndex) => (
                    <div key={q.id} className="bg-white p-4 rounded-lg shadow">
                        <p className="font-semibold">{qIndex + 1}. {q.text}</p>
                        <div className="mt-2 space-y-2">
                            {q.options.map((opt, index) => (
                                <label key={index} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                    <input type="radio" name={`q-${q.id}`} onChange={() => setAnswers(prev => ({...prev, [q.id]: index}))} className="mr-3" />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <button onClick={handleSubmit} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Soumettre l'examen</button>
            </div>
        </div>
    );
};

const AttestationContent: React.FC<{ part: Part, user: User }> = ({ part, user }) => {
    return (
        <div className="p-8 text-center">
             <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-2xl border-4 border-indigo-600">
                <h2 className="text-4xl font-bold text-indigo-800 mb-4">Attestation de Réussite</h2>
                <p className="text-lg text-gray-600 mb-8">Ceci certifie que</p>
                <p className="text-3xl font-semibold text-gray-900 mb-8">{user.firstName} {user.lastName}</p>
                <p className="text-lg text-gray-600 mb-8">a complété avec succès la partie</p>
                <p className="text-2xl font-medium text-gray-800 mb-10">"{part.title}"</p>
                <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString('fr-FR')}</p>
                <button onClick={() => window.print()} className="mt-10 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 print:hidden">
                    Imprimer
                </button>
            </div>
        </div>
    );
}

interface FormationScreenProps {
  formationId: number;
  user: User;
  userProgress: UserProgress;
  onProgressUpdate: (formationId: number, newProgress: UserProgress[number]) => void;
  onBackToDashboard: () => void;
  formations: Formation[];
  parts: Part[];
  courses: Course[];
  exams: Exam[];
}

const FormationScreen: React.FC<FormationScreenProps> = ({ 
    formationId, user, userProgress, onProgressUpdate, onBackToDashboard,
    formations, parts: allParts, courses: allCourses, exams: allExams
}) => {
  const formation = formations.find(f => f.id === formationId);

  if (!formation) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Formation introuvable</h2>
          <button onClick={onBackToDashboard} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const parts = allParts.filter(p => formation.partIds.includes(p.id));
  const initialCourseId = parts.length > 0 && parts[0].courseIds.length > 0 ? parts[0].courseIds[0] : null;

  const [activeView, setActiveView] = useState<{ type: 'course' | 'exam' | 'attestation', id: number } | null>(
      initialCourseId ? {type: 'course', id: initialCourseId} : null
  );
  
  const progress = userProgress[formationId] || { completedCourseIds: [], examAttempts: [] };
  
  const getCourseStatus = (courseId: number, part: Part, partIndex: number) => {
    if(progress.completedCourseIds.includes(courseId)) return 'completed';

    for (let i = 0; i < partIndex; i++) {
      const prevPart = parts[i];
      const prevExamAttempt = progress.examAttempts.find(ea => ea.partId === prevPart.id);
      if (!prevExamAttempt || !prevExamAttempt.passed) return 'locked';
    }

    const courseIndex = part.courseIds.indexOf(courseId);
    for (let i = 0; i < courseIndex; i++) {
        if (!progress.completedCourseIds.includes(part.courseIds[i])) return 'locked';
    }
    
    return 'unlocked';
  };
  
  const handleCompleteCourse = (courseId: number) => {
      if(!progress.completedCourseIds.includes(courseId)) {
        const newProgress = { ...progress, completedCourseIds: [...progress.completedCourseIds, courseId] };
        onProgressUpdate(formationId, newProgress);
        alert('Cours terminé !');
      }
  }

  const handleFinishExam = (partId: number, score: number) => {
      const part = allParts.find(p => p.id === partId);
      if (!part) return;

      const exam = allExams.find(e => e.id === part.examId);
      if (!exam) {
          alert("Erreur: Examen introuvable.");
          return;
      }
      
      const currentAttempt = progress.examAttempts.find(ea => ea.partId === partId) || {partId, attempts: 0, passed: false};
      
      const newAttempt = {...currentAttempt, attempts: currentAttempt.attempts + 1, lastScore: score};
      let newProgress;

      if(score >= exam.passingScore) {
          newAttempt.passed = true;
          alert(`Félicitations! Vous avez réussi avec un score de ${score}%.`);
          setActiveView({type: 'attestation', id: partId});
      } else {
          if (newAttempt.attempts >= 3) {
              alert(`Échec. Vous avez utilisé vos 3 tentatives. Vous devez revoir les cours de cette partie.`);
              const partCourses = part.courseIds;
              const completedCourses = progress.completedCourseIds.filter(id => !partCourses.includes(id));
              newProgress = { ...progress, completedCourseIds: completedCourses };
              newAttempt.attempts = 0; // Reset attempts
          } else {
             alert(`Échec avec un score de ${score}%. Il vous reste ${3 - newAttempt.attempts} tentative(s).`);
          }
      }
      
      const otherAttempts = progress.examAttempts.filter(ea => ea.partId !== partId);
      newProgress = newProgress || progress;
      onProgressUpdate(formationId, { ...newProgress, examAttempts: [...otherAttempts, newAttempt] });
  };
  
  const totalCourses = parts.reduce((acc, part) => acc + part.courseIds.length, 0);
  const progressPercentage = totalCourses > 0 ? (progress.completedCourseIds.length / totalCourses) * 100 : 100;

  const renderActiveView = () => {
    if (!activeView) {
      return <div className="p-8 text-center text-gray-500">Sélectionnez un cours pour commencer.</div>;
    }
    switch(activeView.type) {
        case 'course': {
            const course = allCourses.find(c => c.id === activeView.id);
            if (!course) return <div className="p-8 text-center text-gray-500">Contenu du cours introuvable.</div>;
            return <CourseContent course={course} onComplete={() => handleCompleteCourse(activeView.id)} />;
        }
        case 'exam': {
            const partForExam = allParts.find(p => p.id === activeView.id);
            if (!partForExam) return <div className="p-8 text-center text-gray-500">Partie de formation introuvable.</div>;
            const exam = allExams.find(e => e.id === partForExam.examId);
            if (!exam) return <div className="p-8 text-center text-gray-500">Examen introuvable.</div>;
            return <ExamContent exam={exam} onFinishExam={(score) => handleFinishExam(activeView.id, score)} />;
        }
        case 'attestation': {
            const partForAttestation = allParts.find(p => p.id === activeView.id);
            if (!partForAttestation) return <div className="p-8 text-center text-gray-500">Partie de formation introuvable.</div>;
            return <AttestationContent part={partForAttestation} user={user} />;
        }
        default:
            return <div className="p-8 text-center text-gray-500">Sélectionnez un contenu à afficher.</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-gray-100" style={{ height: 'calc(100vh - 70px)'}}>
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <button onClick={onBackToDashboard} className="text-sm text-indigo-600 hover:underline">&larr; Retour</button>
          <h2 className="text-xl font-bold mt-2">{formation.title}</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          {parts.map((part, partIndex) => {
            const partCourses = allCourses.filter(c => part.courseIds.includes(c.id));
            const partExamAttempt = progress.examAttempts.find(ea => ea.partId === part.id);
            const isPartCompleted = partExamAttempt && partExamAttempt.passed;
            const areAllCoursesCompleted = part.courseIds.every(cid => progress.completedCourseIds.includes(cid));
            const examForPart = allExams.find(e => e.id === part.examId);
            
            return (
              <div key={part.id}>
                <h3 className="font-semibold text-gray-800 flex items-center">
                  {isPartCompleted && <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/>}
                  {part.title}
                </h3>
                <ul className="mt-2 ml-2 border-l border-gray-200 pl-4 space-y-1">
                  {partCourses.map(course => {
                    const status = getCourseStatus(course.id, part, partIndex);
                    const isActive = activeView?.type === 'course' && activeView.id === course.id;
                    return (
                      <li key={course.id}>
                        <button 
                          onClick={() => status !== 'locked' && setActiveView({type: 'course', id: course.id})}
                          disabled={status === 'locked'}
                          className={`w-full text-left flex items-center space-x-3 p-2 rounded-md ${
                            isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                          } ${status === 'locked' ? 'text-gray-400 cursor-not-allowed' : ''}`}
                        >
                          {status === 'completed' ? <CheckCircleIcon className="w-5 h-5 text-green-500"/> : 
                           status === 'locked' ? <LockClosedIcon className="w-5 h-5 text-gray-400"/> :
                           <PlayCircleIcon className="w-5 h-5 text-gray-500"/>}
                          <span className="flex-1">{course.title}</span>
                          {course.type === CourseType.VIDEO && <VideoCameraIcon className="w-4 h-4 text-gray-400" />}
                          {course.type === CourseType.ARTICLE && <DocumentTextIcon className="w-4 h-4 text-gray-400" />}
                          {course.type === CourseType.PDF && <DocumentTextIcon className="w-4 h-4 text-gray-400" />}
                        </button>
                      </li>
                    );
                  })}
                   <li className="pt-2">
                       <button 
                          onClick={() => setActiveView({type: 'exam', id: part.id})}
                          disabled={!areAllCoursesCompleted || (partExamAttempt?.attempts || 0) >= 3 && !partExamAttempt?.passed}
                          className={`w-full text-left flex items-center space-x-3 p-2 rounded-md font-semibold ${
                            activeView?.type === 'exam' && activeView.id === part.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                          } ${!areAllCoursesCompleted ? 'text-gray-400 cursor-not-allowed' : ''}`}
                       >
                         {isPartCompleted ? <CheckCircleIcon className="w-5 h-5 text-green-500"/> :
                           !areAllCoursesCompleted ? <LockClosedIcon className="w-5 h-5 text-gray-400"/> :
                           <PlayCircleIcon className="w-5 h-5 text-gray-500"/>
                         }
                         <span>Examen: {examForPart?.title || 'Titre introuvable'}</span>
                       </button>
                   </li>
                   {isPartCompleted && (
                       <li className="pt-1">
                          <button 
                             onClick={() => setActiveView({type: 'attestation', id: part.id})}
                             className={`w-full text-left flex items-center space-x-3 p-2 rounded-md text-sm text-green-700 hover:bg-green-50`}
                          >
                            <span className="ml-8">Voir l'attestation</span>
                          </button>
                       </li>
                   )}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>
      
      <main className="flex-1 overflow-y-auto">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default FormationScreen;