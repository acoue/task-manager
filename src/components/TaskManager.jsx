import React, { useState, useEffect } from 'react';
import { Settings, BarChart3 } from 'lucide-react';
import Statistics from './Statistics';
import ProjectManager , { addProject, updateProject, deleteProject } from './Project';
import DateAccordion, { addTask, updateTask, deleteTask, changeTaskDate } from './DateAccordion';
// Composant principal
const TaskManager = () => {
  // const [tasks, setTasks] = useState({});
  // const [projects, setProjects] = useState([]);
  // const [openDates, setOpenDates] = useState({});
  // const [showProjectManager, setShowProjectManager] = useState(false);
  // const [showStatistics, setShowStatistics] = useState(false);

  // // Simulation du stockage en fichier local
  // const saveToFile = (data) => {
  //   // Dans un vrai projet avec Vite, vous utiliseriez fs pour écrire dans un fichier
  //   // Ici nous simulons avec le state
  //   console.log('Données sauvegardées:', data);
  // };

  // const loadFromFile = () => {
  //   // Simulation du chargement depuis un fichier
  //   // Dans un vrai projet, vous liriez un fichier JSON
  //   const defaultProjects = [
  //     { id: '1', label: 'Personnel', color: '#10B981' },
  //     { id: '2', label: 'Travail', color: '#3B82F6' },
  //     { id: '3', label: 'Urgent', color: '#EF4444' }
  //   ];

  //   const today = new Date().toISOString().split('T')[0];
  //   const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  //   const defaultTasks = {
  //     [today]: [
  //       {
  //         id: '1',
  //         projectId: '1',
  //         label: 'Faire les courses',
  //         urgency: 'moyenne',
  //         comment: 'Acheter du pain et du lait'
  //       },
  //       {
  //         id: '2',
  //         projectId: '2',
  //         label: 'Réunion équipe',
  //         urgency: 'élevée',
  //         comment: 'Présentation du nouveau projet'
  //       }
  //     ],
  //     [tomorrow]: [
  //       {
  //         id: '3',
  //         projectId: '1',
  //         label: 'Médecin',
  //         urgency: 'moyenne',
  //         comment: 'Rendez-vous à 14h'
  //       }
  //     ]
  //   };

  //   setProjects(defaultProjects);
  //   setTasks(defaultTasks);

  //   // Ouvrir la date d'aujourd'hui par défaut
  //   setOpenDates({ [today]: true });
  // };

  // useEffect(() => {
  //   loadFromFile();
  // }, []);

  // const toggleDate = (date) => {
  //   setOpenDates(prev => ({
  //     ...prev,
  //     [date]: !prev[date]
  //   }));
  // };



  // // Générer les dates pour les prochains 30 jours (pour permettre plus de flexibilité)
  // const getDates = () => {
  //   const dates = [];
  //   for (let i = 0; i < 30; i++) {
  //     const date = new Date();
  //     date.setDate(date.getDate() + i);
  //     dates.push(date.toISOString().split('T')[0]);
  //   }
  //   return dates;
  // };

  // // Obtenir toutes les dates qui ont des tâches (même si elles ne sont pas dans les 30 prochains jours)
  // const getAllDatesWithTasks = () => {
  //   const futureDates = getDates();
  //   const existingDates = Object.keys(tasks);
  //   const allDates = [...new Set([...futureDates, ...existingDates])].sort();
  //   return allDates;
  // };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestionnaire de Tâches</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowStatistics(true)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 flex items-center gap-2"
            >
              <BarChart3 size={16} /> Statistiques
            </button>
            <button
              onClick={() => setShowProjectManager(true)}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 flex items-center gap-2"
            >
              <Settings size={16} /> Gérer les projets
            </button>
          </div>
        </div>

        {/* <div className="space-y-2">
          {getAllDatesWithTasks().map(date => (
            <DateAccordion
              key={date}
              date={date}
              tasks={tasks[date] || []}
              isOpen={openDates[date] || false}
              onToggle={() => toggleDate(date)}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onChangeTaskDate={changeTaskDate}
              projects={projects}
            />
          ))}
        </div>

        <Statistics
          tasks={tasks}
          projects={projects}
          isOpen={showStatistics}
          onClose={() => setShowStatistics(false)}
        />

        <ProjectManager
          projects={projects}
          onAddProject={addProject}
          onUpdateProject={updateProject}
          onDeleteProject={deleteProject}
          isOpen={showProjectManager}
          onClose={() => setShowProjectManager(false)}
        /> */}
      </div>
    </div>
  );
};

export default TaskManager;