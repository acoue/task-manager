import React, { useState } from 'react';

const TaskForm = ({ onAdd, projects, onCancel, selectedDate }) => {
  const [task, setTask] = useState({
    projectId: '',
    label: '',
    urgency: 'moyenne',
    comment: ''
  });

  const handleSubmit = () => {
    if (task.label.trim()) {
      onAdd(task);
      setTask({ projectId: '', label: '', urgency: 'moyenne', comment: '' });
    }
  };

  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={selectedDate}
            className="w-full p-2 border rounded-md bg-gray-100"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Projet</label>
          <select
            value={task.projectId}
            onChange={(e) => setTask({...task, projectId: e.target.value})}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Aucun projet</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
          <input
            type="text"
            value={task.label}
            onChange={(e) => setTask({...task, label: e.target.value})}
            className="w-full p-2 border rounded-md"
            placeholder="Entrez le libellé de la tâche"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urgence</label>
          <select
            value={task.urgency}
            onChange={(e) => setTask({...task, urgency: e.target.value})}
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
            value={task.comment}
            onChange={(e) => setTask({...task, comment: e.target.value})}
            className="w-full p-2 border rounded-md h-20"
            placeholder="Commentaires optionnels..."
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Ajouter la tâche
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;