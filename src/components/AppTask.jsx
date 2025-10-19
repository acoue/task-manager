// App.jsx
import React, { useState, useEffect } from 'react';

// ==================== IMPORTS DES COMPOSANTS ====================
// Composants UI de base
import Modal from './ui/Modal.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';
import ErrorDisplay from './ui/ErrorDisplay.jsx';
import ConfigWarning from './ui/ConfigWarning.jsx';

// Composants Tâches
import TasksView from './tasks/TaskView.jsx';
import TaskForm from './tasks/TaskForm.jsx';

// Composants Projets
import ProjectManager from './taskProjects/ProjectManager.jsx';

// Composants Statistiques
import Statistics from './statistics/Statistics.jsx';

// Layout
import HeaderTask from './ui/HeaderTask.jsx';

// ==================== IMPORTS FIREBASE ====================
import { firebaseTaskService } from '../services/firebaseService.js';
import { FIREBASE_TASK_CONFIG } from '../config/firebaseTask.config.js';

// ==================== COMPOSANT PRINCIPAL ====================
const AppTask = ({ onRetour }) => {
  // ========== États ===========
  const [view, setView] = useState('tasks');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfigWarning, setShowConfigWarning] = useState(false);

  // ========== Initialisation ===========
  useEffect(() => {
    const initializeApp = async () => {
      try {

        setLoading(true);

        // Vérifier la configuration Firebase
        // if (FIREBASE_TASK_CONFIG.apiKey === 'AIzaSyDlsIXNdq13usk8a_QqXZYcAKyPaeAKbpo') {
        //   setShowConfigWarning(true);
        // }

        // Initialiser Firebase
        await firebaseTaskService.initialize(FIREBASE_TASK_CONFIG);

        // Charger les données
        await loadData();
      } catch (err) {
        setError(err.message);
        console.error('Erreur initialisation:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // ========== Fonctions de chargement ===========
  const loadData = async () => {
    try {
      const [loadedTasks, loadedProjects] = await Promise.all([
        firebaseTaskService.getTasks(),
        firebaseTaskService.getProjects()
      ]);

      // console.log('Tâches chargées:', loadedTasks);
      // console.log('Projets chargés:', loadedProjects);
      setTasks(loadedTasks);
      setProjects(loadedProjects);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    }
  };

  // ========== Gestionnaires de Tâches ===========
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await firebaseTaskService.updateTask(editingTask.id, taskData);
      } else {
        await firebaseTaskService.addTask(taskData);
      }
      await loadData();
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (err) {
      alert('Erreur lors de la sauvegarde: ' + err.message);
    }
  };

  const handleUpdateTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await firebaseTaskService.deleteTask(taskId);
        await loadData();
      } catch (err) {
        alert('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  // ========== Gestionnaires de Projets ===========
  const handleSaveProject = async (projectData, editingId) => {
    try {
      if (editingId) {
        await firebaseTaskService.updateProject(editingId, projectData);
      } else {
        await firebaseTaskService.addProject(projectData);
      }
      await loadData();
    } catch (err) {
      alert('Erreur lors de la sauvegarde: ' + err.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (tasks.some(t => t.projectId === projectId)) {
      alert('Impossible de supprimer ce projet car des tâches y sont associées');
      return;
    }
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await firebaseTaskService.deleteProject(projectId);
        await loadData();
      } catch (err) {
        alert('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  // ========== Navigation ===========
  const changeMonth = (direction) => {
    const date = new Date(currentMonth + '-01');
    date.setMonth(date.getMonth() + direction);
    setCurrentMonth(date.toISOString().slice(0, 7));
  };

  // ========== Rendu conditionnel ===========
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  // ========== Rendu principal ===========
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4l mx-auto p-5">
        <button
          onClick={onRetour}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          ← Retour à l'accueil
        </button>
      </div>
      <div className="max-w-6xl mx-auto ">
        {/* Avertissement de configuration */}
        {showConfigWarning && (
          <ConfigWarning onClose={() => setShowConfigWarning(false)} />
        )}

        {/* En-tête avec navigation */}
        <HeaderTask
          view={view}
          onViewChange={setView}
          onOpenProjectModal={() => setShowProjectModal(true)}
        />

        {/* Vue Tâches */}
        {view === 'tasks' && (
          <TasksView
            currentMonth={currentMonth}
            tasks={tasks}
            projects={projects}
            onChangeMonth={changeMonth}
            onAddTask={() => {
              setEditingTask(null);
              setShowTaskModal(true);
            }}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {/* Vue Statistiques */}
        {view === 'stats' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Statistiques</h2>
            <Statistics tasks={tasks} projects={projects} />
          </div>
        )}

        {/* Modal Tâche */}
        <Modal
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          title={editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
        >
          <TaskForm
            task={editingTask}
            projects={projects}
            onSave={handleSaveTask}
            onCancel={() => {
              setShowTaskModal(false);
              setEditingTask(null);
            }}
          />
        </Modal>

        {/* Modal Projet */}
        <Modal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          title="Gestion des projets"
        >
          <ProjectManager
            projects={projects}
            onSave={handleSaveProject}
            onDelete={handleDeleteProject}
          />
        </Modal>
      </div>
    </div>
  );
}

export default AppTask;