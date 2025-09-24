import React, { useState} from 'react';
import {  Edit2, Trash2,  Save, X} from 'lucide-react';


  const addTask = (date, taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString()
    };

    setTasks(prev => ({
      ...prev,
      [date]: [...(prev[date] || []), newTask]
    }));

    saveToFile({ tasks: { ...tasks, [date]: [...(tasks[date] || []), newTask] }, projects });
  };

  const updateTask = (updatedTask) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach(date => {
        newTasks[date] = newTasks[date].map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );
      });
      saveToFile({ tasks: newTasks, projects });
      return newTasks;
    });
  };

  const changeTaskDate = (taskId, oldDate, newDate, updatedTask) => {
    setTasks(prev => {
      const newTasks = { ...prev };

      // Supprimer la tâche de l'ancienne date
      if (newTasks[oldDate]) {
        newTasks[oldDate] = newTasks[oldDate].filter(task => task.id !== taskId);
      }

      // Ajouter la tâche à la nouvelle date
      if (!newTasks[newDate]) {
        newTasks[newDate] = [];
      }
      newTasks[newDate].push(updatedTask);

      saveToFile({ tasks: newTasks, projects });
      return newTasks;
    });

    // Ouvrir automatiquement l'accordéon de la nouvelle date si elle est différente
    if (oldDate !== newDate) {
      setOpenDates(prev => ({
        ...prev,
        [newDate]: true
      }));
    }
  };

  const deleteTask = (taskId) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach(date => {
        newTasks[date] = newTasks[date].filter(task => task.id !== taskId);
      });
      saveToFile({ tasks: newTasks, projects });
      return newTasks;
    });
  };
// Composant Task
const Task = ({ task, onUpdate, onDelete, onChangeDate, projects, currentDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [editedDate, setEditedDate] = useState(currentDate);

  const project = projects.find(p => p.id === task.projectId);
  const urgencyColors = {
    'faible': 'bg-green-100 text-green-800',
    'moyenne': 'bg-yellow-100 text-yellow-800',
    'élevée': 'bg-red-100 text-red-800'
  };

  const handleSave = () => {
    if (editedDate !== currentDate) {
      // Si la date a changé, déplacer la tâche
      onChangeDate(task.id, currentDate, editedDate, editedTask);
    } else {
      // Sinon, juste mettre à jour la tâche
      onUpdate(editedTask);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setEditedDate(currentDate);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Projet</label>
            <select
              value={editedTask.projectId}
              onChange={(e) => setEditedTask({...editedTask, projectId: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Aucun projet</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
            <input
              type="text"
              value={editedTask.label}
              onChange={(e) => setEditedTask({...editedTask, label: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgence</label>
            <select
              value={editedTask.urgency}
              onChange={(e) => setEditedTask({...editedTask, urgency: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              <option value="faible">Faible</option>
              <option value="moyenne">Moyenne</option>
              <option value="élevée">Élevée</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
            <textarea
              value={editedTask.comment}
              onChange={(e) => setEditedTask({...editedTask, comment: e.target.value})}
              className="w-full p-2 border rounded-md h-20"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center gap-1"
            >
              <Save size={16} /> Sauvegarder
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 flex items-center gap-1"
            >
              <X size={16} /> Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {project && (
              <span
                className="px-2 py-1 rounded-full text-xs text-white"
                style={{ backgroundColor: project.color }}
              >
                {project.label}
              </span>
            )}
            <span className={`px-2 py-1 rounded-full text-xs ${urgencyColors[task.urgency]}`}>
              {task.urgency}
            </span>
          </div>
          <h4 className="font-medium text-gray-800 mb-2">{task.label}</h4>
          {task.comment && (
            <p className="text-sm text-gray-600 mb-2">{task.comment}</p>
          )}
        </div>
        <div className="flex gap-1 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-blue-500 p-1"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-500 hover:text-red-500 p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task;