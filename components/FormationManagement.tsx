import React, { useState } from 'react';
import { Formation, Part, Course, Exam, CourseType, Question } from '../types';
import { PencilIcon, TrashIcon } from '../constants';

// --- Reusable Modal Component ---
const Modal: React.FC<{ title: string, onClose: () => void, children: React.ReactNode }> = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
);

// --- Formation Form ---
const FormationForm: React.FC<{ 
    formation: Partial<Formation> | null, 
    onSave: (formation: Partial<Formation>) => void, 
    onClose: () => void 
}> = ({ formation, onSave, onClose }) => {
    const [formData, setFormData] = useState(formation || {});
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="title" placeholder="Titre de la formation" value={formData.title || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            <textarea name="description" placeholder="Description" value={formData.description || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" rows={4}></textarea>
            <input type="text" name="imageUrl" placeholder="URL de l'image de couverture" value={formData.imageUrl || ''} onChange={handleChange} className="w-full p-2 border rounded-md" />
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Enregistrer</button>
            </div>
        </form>
    );
}

// --- Part Form ---
const PartFormModal: React.FC<{
    part: Partial<Part>,
    onSave: (part: Partial<Part>) => void,
    onClose: () => void
}> = ({ part, onSave, onClose }) => {
    const [formData, setFormData] = useState(part);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }
    
    return (
        <Modal title={part.id ? "Modifier la partie" : "Nouvelle partie"} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" placeholder="Titre de la partie" value={formData.title || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Enregistrer</button>
                </div>
            </form>
        </Modal>
    );
};

// --- Course Form ---
const CourseFormModal: React.FC<{
    courseData: { partId: number, course: Partial<Course> },
    onSave: (partId: number, course: Partial<Course>) => void,
    onClose: () => void,
}> = ({ courseData, onSave, onClose }) => {
    const [formData, setFormData] = useState<Partial<Course>>({
        ...courseData.course,
        type: courseData.course.type || CourseType.ARTICLE,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'type') {
            setFormData(prev => ({ ...prev, type: value as CourseType, content: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const updateQuestion = (qIndex: number, newQuestionData: Partial<Question>) => {
        const updatedQuestions = (formData.quickTestQuestions || []).map((q, index) => 
            index === qIndex ? { ...q, ...newQuestionData } : q
        );
        setFormData({ ...formData, quickTestQuestions: updatedQuestions });
    };

    const addQuestion = () => {
        const newQuestion: Question = { id: Date.now(), text: '', options: ['', '', '', ''], correctAnswerIndex: 0 };
        setFormData({ ...formData, quickTestQuestions: [...(formData.quickTestQuestions || []), newQuestion] });
    };

    const removeQuestion = (qIndex: number) => {
        const filteredQuestions = (formData.quickTestQuestions || []).filter((_, index) => index !== qIndex);
        setFormData({ ...formData, quickTestQuestions: filteredQuestions });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(courseData.partId, formData);
    };

    return (
        <Modal title={formData.id ? "Modifier le cours" : "Nouveau cours"} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
                <input type="text" name="title" placeholder="Titre du cours" value={formData.title || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded-md">
                    {Object.values(CourseType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                
                {formData.type === CourseType.VIDEO && (
                    <div>
                        <label htmlFor="content-video" className="block text-sm font-medium text-gray-700 mb-1">Lien de la vidéo</label>
                        <input
                            id="content-video"
                            type="text"
                            name="content"
                            placeholder="Lien de la vidéo YouTube"
                            value={formData.content || ''}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                )}
                {formData.type === CourseType.ARTICLE && (
                    <div>
                         <label htmlFor="content-article" className="block text-sm font-medium text-gray-700 mb-1">Contenu de l'article</label>
                        <textarea
                            id="content-article"
                            name="content"
                            placeholder="Contenu de l'article"
                            value={formData.content || ''}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                            rows={6}
                        ></textarea>
                    </div>
                )}
                {formData.type === CourseType.PDF && (
                    <div>
                        <label htmlFor="content-pdf" className="block text-sm font-medium text-gray-700 mb-1">URL du document PDF</label>
                        <input
                            id="content-pdf"
                            type="text"
                            name="content"
                            placeholder="URL du document PDF"
                            value={formData.content || ''}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                )}
                
                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Questions de test rapide</h3>
                    <div className="space-y-4">
                        {(formData.quickTestQuestions || []).map((q, qIndex) => (
                            <div key={q.id || qIndex} className="bg-gray-100 p-3 rounded-md border">
                                <div className="flex items-center mb-2">
                                    <input type="text" placeholder={`Question ${qIndex + 1}`} value={q.text} onChange={(e) => updateQuestion(qIndex, { text: e.target.value })} required className="flex-grow p-2 border rounded-md text-sm"/>
                                    <button type="button" onClick={() => removeQuestion(qIndex)} className="ml-2 text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} className="flex items-center">
                                            <input type="radio" name={`correct-answer-${q.id || qIndex}`} checked={q.correctAnswerIndex === oIndex} onChange={() => updateQuestion(qIndex, { correctAnswerIndex: oIndex })} className="mr-2 h-4 w-4 text-indigo-600"/>
                                            <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => {
                                                    const newOptions = [...q.options]; newOptions[oIndex] = e.target.value; updateQuestion(qIndex, { options: newOptions });
                                                }} required className="w-full p-1 border rounded-sm text-sm" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addQuestion} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800">+ Ajouter une question</button>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Enregistrer</button>
                </div>
            </form>
        </Modal>
    );
};

// --- Detail View for a single Formation ---
const FormationDetailEditor: React.FC<{
    formation: Formation;
    parts: Part[];
    courses: Course[];
    onBack: () => void;
    onSavePart: (formationId: number, part: Partial<Part>) => void;
    onDeletePart: (formationId: number, partId: number) => void;
    onSaveCourse: (partId: number, course: Partial<Course>) => void;
    onDeleteCourse: (partId: number, courseId: number) => void;
}> = ({ formation, parts, courses, onBack, onSavePart, onDeletePart, onSaveCourse, onDeleteCourse }) => {
    const [editingPart, setEditingPart] = useState<Partial<Part> | null>(null);
    const [editingCourse, setEditingCourse] = useState<{ partId: number, course: Partial<Course> } | null>(null);

    const formationParts = parts.filter(p => formation.partIds.includes(p.id));

    const handleSavePart = (partData: Partial<Part>) => {
        onSavePart(formation.id, partData);
        setEditingPart(null);
    };

    const handleSaveCourse = (partId: number, courseData: Partial<Course>) => {
        onSaveCourse(partId, courseData);
        setEditingCourse(null);
    };
    
    const handleDeletePart = (partId: number) => {
        if(window.confirm("Supprimer cette partie et tous ses cours ?")) {
             onDeletePart(formation.id, partId);
        }
    }
    
    const handleDeleteCourse = (partId: number, courseId: number) => {
         if(window.confirm("Supprimer ce cours ?")) {
            onDeleteCourse(partId, courseId);
        }
    }

    return (
        <div>
            <button onClick={onBack} className="text-sm text-indigo-600 hover:underline mb-4">&larr; Retour à la liste</button>
            <h2 className="text-2xl font-bold mb-1">{formation.title}</h2>
            <p className="text-gray-600 mb-6">{formation.description}</p>
            
            <div className="space-y-6">
                {formationParts.map(part => {
                    const partCourses = courses.filter(c => part.courseIds.includes(c.id));
                    return (
                        <div key={part.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">{part.title}</h3>
                                <div>
                                    <button onClick={() => setEditingPart(part)} className="text-indigo-600 hover:text-indigo-900 mr-2"><PencilIcon/></button>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDeletePart(part.id)}><TrashIcon/></button>
                                </div>
                            </div>
                            <ul className="mt-4 space-y-2">
                                {partCourses.map(course => (
                                    <li key={course.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                        <span>{course.title} ({course.type})</span>
                                        <div className="flex items-center">
                                            <button onClick={() => setEditingCourse({partId: part.id, course})} className="text-indigo-600 hover:text-indigo-900 mr-2"><PencilIcon className="w-4 h-4"/></button>
                                            <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteCourse(part.id, course.id)}><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                             <button onClick={() => setEditingCourse({partId: part.id, course: {}})} className="mt-4 text-sm text-indigo-600 font-semibold">+ Ajouter un cours</button>
                        </div>
                    );
                })}
            </div>
             <button onClick={() => setEditingPart({})} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">+ Ajouter une partie</button>
             
            {editingPart && <PartFormModal part={editingPart} onSave={handleSavePart} onClose={() => setEditingPart(null)} />}
            {editingCourse && <CourseFormModal courseData={editingCourse} onSave={handleSaveCourse} onClose={() => setEditingCourse(null)} />}
        </div>
    );
};


// --- Main Management Component ---
interface FormationManagementProps {
    formations: Formation[];
    parts: Part[];
    courses: Course[];
    exams: Exam[];
    onSaveFormation: (formation: Partial<Formation>) => void;
    onDeleteFormation: (formationId: number) => void;
    onSavePart: (formationId: number, part: Partial<Part>) => void;
    onDeletePart: (formationId: number, partId: number) => void;
    onSaveCourse: (partId: number, course: Partial<Course>) => void;
    onDeleteCourse: (partId: number, courseId: number) => void;
}

const FormationManagement: React.FC<FormationManagementProps> = ({ 
    formations, parts, courses, exams, 
    onSaveFormation, onDeleteFormation, 
    onSavePart, onDeletePart, onSaveCourse, onDeleteCourse
}) => {
    const [editingFormation, setEditingFormation] = useState<Partial<Formation> | null>(null);
    const [selectedFormationId, setSelectedFormationId] = useState<number | null>(null);

    const handleSave = (formation: Partial<Formation>) => {
        onSaveFormation(formation);
        setEditingFormation(null);
    }
    
    const handleDelete = (formationId: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
            onDeleteFormation(formationId);
        }
    }

    const selectedFormation = selectedFormationId ? formations.find(f => f.id === selectedFormationId) : null;
    
    if (selectedFormation) {
        return (
            <div className="p-4 sm:p-6 md:p-8">
                <FormationDetailEditor 
                    formation={selectedFormation} 
                    parts={parts} 
                    courses={courses} 
                    onBack={() => setSelectedFormationId(null)}
                    onSavePart={onSavePart}
                    onDeletePart={onDeletePart}
                    onSaveCourse={onSaveCourse}
                    onDeleteCourse={onDeleteCourse}
                />
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gestion des formations</h1>
                <button onClick={() => setEditingFormation({})} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Ajouter une formation
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {formations.map(formation => (
                    <div key={formation.id} className="bg-white rounded-lg shadow-md flex flex-col">
                         <img className="h-48 w-full object-cover rounded-t-lg" src={formation.imageUrl || 'https://placehold.co/600x400/e2e8f0/e2e8f0'} alt={formation.title} />
                         <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold">{formation.title}</h3>
                            <p className="text-gray-600 text-sm flex-grow mt-1">{formation.description}</p>
                            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                 <button onClick={() => setSelectedFormationId(formation.id)} className="text-sm text-indigo-600 hover:underline">Gérer le contenu</button>
                                 <div className="space-x-2">
                                    <button onClick={() => setEditingFormation(formation)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon/></button>
                                    <button onClick={() => handleDelete(formation.id)} className="text-red-600 hover:text-red-900"><TrashIcon/></button>
                                 </div>
                            </div>
                         </div>
                    </div>
                ))}
            </div>

            {editingFormation && (
                <Modal title={editingFormation.id ? "Modifier la formation" : "Nouvelle formation"} onClose={() => setEditingFormation(null)}>
                    <FormationForm formation={editingFormation} onSave={handleSave} onClose={() => setEditingFormation(null)} />
                </Modal>
            )}
        </div>
    );
};

export default FormationManagement;