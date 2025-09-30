// App.jsx
import React, { useState, useEffect } from 'react';

// ==================== IMPORTS DES COMPOSANTS ====================
// Composants UI de base
import Modal from './components/ui/Modal';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorDisplay from './components/ui/ErrorDisplay';
import ConfigWarning from './components/ui/ConfigWarning';

// Composants Tâches
import TasksView from './components/tasks/TaskView';
import TaskForm from './components/tasks/TaskForm';

// Composants Projets
import ProjectManager from './components/projects/ProjectManager';

// Composants Statistiques
import Statistics from './components/statistics/Statistics';

// Layout
import Header from './components/ui/Header';

// ==================== IMPORTS FIREBASE ====================
import { firebaseService } from './services/firebaseService';
import { FIREBASE_CONFIG } from './config/firebase.config.js';

// ==================== COMPOSANT PRINCIPAL ====================
export default function App() {
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
        // if (FIREBASE_CONFIG.apiKey === 'AIzaSyDlsIXNdq13usk8a_QqXZYcAKyPaeAKbpo') {
        //   setShowConfigWarning(true);
        // }

        // Initialiser Firebase
        await firebaseService.initialize(FIREBASE_CONFIG);

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
        firebaseService.getTasks(),
        firebaseService.getProjects()
      ]);
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
        await firebaseService.updateTask(editingTask.id, taskData);
      } else {
        await firebaseService.addTask(taskData);
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
        await firebaseService.deleteTask(taskId);
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
        await firebaseService.updateProject(editingId, projectData);
      } else {
        await firebaseService.addProject(projectData);
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
        await firebaseService.deleteProject(projectId);
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
      <div className="max-w-4xl mx-auto p-4">
        {/* Avertissement de configuration */}
        {showConfigWarning && (
          <ConfigWarning onClose={() => setShowConfigWarning(false)} />
        )}

        {/* En-tête avec navigation */}
        <Header
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