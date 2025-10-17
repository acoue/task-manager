import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, X } from 'lucide-react';


// ==================== IMPORTS FIREBASE ====================
import { firebaseTaskService } from '../services/firebaseService.js';
import { FIREBASE_TASK_CONFIG } from '../config/firebaseTask.config.js';


export default function AppDaily({ onRetour }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    label: '',
    urgency: 'moyen',
    comment: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    label: '',
    urgency: 'moyen',
    comment: ''
  });

  const urgencyColors = {
    faible: 'bg-blue-100 text-blue-800 border-blue-300',
    moyen: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    élevé: 'bg-red-100 text-red-800 border-red-300'
  };

  const urgencyBadge = {
    faible: 'bg-blue-200',
    moyen: 'bg-yellow-200',
    élevé: 'bg-red-200'
  };

  const statusColors = {
    pending: 'bg-blue-50 border-blue-300',
    doing: 'bg-orange-50 border-orange-300',
    done: 'bg-green-50 border-green-300'
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {

        setLoading(true);
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
      const [loadedTasks] = await Promise.all([
        firebaseTaskService.getDailyTasks()
      ]);
      setTasks(loadedTasks);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    }
  };


  const handleAddTask = async () => {
    if (formData.label.trim()) {
      firebaseTaskService.addDailyTask({
        label: formData.label,
        urgency: formData.urgency,
        comment: formData.comment,
        status: 'pending'
      });

      await loadData();
      setFormData({ label: '', urgency: 'moyen', comment: '' });
    }
  };

  const handleUpdateStatus = async (firebaseId, status) => {

    await firebaseTaskService.updateDailyTask(firebaseId, { status });
    await loadData();
  };

  const handleDeleteTask = async (firebaseId) => {
    await firebaseTaskService.deleteDailyTask(firebaseId);
    await loadData();
  };

  const handleSaveEdit = async (firebaseId) => {
    await firebaseTaskService.updateDailyTask(firebaseId, {
      label: editData.label,
      urgency: editData.urgency,
      comment: editData.comment
    });
    setEditingId(null);
    await loadData();
  };

  const startEditing = (task) => {
    setEditingId(task.firebaseId);  // ← Utilisez firebaseId
    setEditData({
      label: task.label,
      urgency: task.urgency,
      comment: task.comment
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const doingTasks = tasks.filter(t => t.status === 'doing');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const TaskCard = ({ task }) => (
    <div className={`p-4 rounded-lg border-2 mb-3 ${statusColors[task.status]} cursor-move transition-shadow hover:shadow-md`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold flex-1 pr-2">{task.label}</h4>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => startEditing(task)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {task.comment && (
        <p className="text-sm opacity-75 mb-2">{task.comment}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold px-2 py-1 rounded ${urgencyBadge[task.urgency]}`}>
          {task.urgency.toUpperCase()}
        </span>
      </div>
    </div>
  );

  const EditTaskModal = ({ task }) => {
    if (!task) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Modifier la tâche</h2>
            <button
              onClick={cancelEdit}
              className="text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Libellé de la tâche"
              value={editData.label}
              onChange={(e) => setEditData({ ...editData, label: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={editData.urgency}
              onChange={(e) => setEditData({ ...editData, urgency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="faible">Urgence : Faible</option>
              <option value="moyen">Urgence : Moyen</option>
              <option value="élevé">Urgence : Élevé</option>
            </select>
            <textarea
              placeholder="Commentaire (optionnel)"
              value={editData.comment}
              onChange={(e) => handleSaveEdit({ ...editData, comment: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="2"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleSaveEdit(task.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Enregistrer
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Column = ({ title, status, columnTasks }) => (
    <div
      className="flex-1 bg-gray-50 rounded-lg p-4 min-h-96"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        handleUpdateStatus(taskId, status);
      }}
    >
      <h3 className="font-bold text-lg mb-4 text-gray-800">{title}</h3>
      <div className="space-y-2">
        {columnTasks.map(task => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('taskId', task.id.toString());
            }}
          >
            <TaskCard task={task} />
          </div>
        ))}
        {columnTasks.length === 0 && (
          <p className="text-gray-400 text-center py-8 text-sm">Aucune tâche</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4l mx-auto p-5">
        <button
          onClick={onRetour}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          ← Retour à l'accueil
        </button>
      </div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Gestionnaire de Tâches
        </h1>
        <p className="text-gray-600 mb-8">Organisez votre journée de travail</p>

        {/* Formulaire d'ajout */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Libellé"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="px-5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="faible">Faible</option>
              <option value="moyen">Moyen</option>
              <option value="élevé">Élevé</option>
            </select>
            <button
              onClick={handleAddTask}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              Ajouter
            </button>
          </div>
          <input
            type="text"
            placeholder="Commentaire (optionnel)"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          />
        </div>

        {/* Kanban */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          <Column
            title="📋 À faire"
            status="pending"
            columnTasks={pendingTasks}
          />
          <Column
            title="🚀 En cours"
            status="doing"
            columnTasks={doingTasks}
          />
          <Column
            title="✅ Terminé"
            status="done"
            columnTasks={doneTasks}
          />
        </div>

        {/* Résumé
        <div className="mt-8 bg-white rounded-lg shadow p-4">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{pendingTasks.length}</p>
              <p className="text-gray-600">À faire</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-600">{doingTasks.length}</p>
              <p className="text-gray-600">En cours</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{doneTasks.length}</p>
              <p className="text-gray-600">Terminé</p>
            </div>
          </div>
        </div>*/}
      </div>

      {editingId !== null && (
        <EditTaskModal
          task={tasks.find(t => t.firebaseId === editingId)}  // ← Cherchez par firebaseId
        />
      )}
    </div>
  );
}