import React, { useState } from 'react';
import { Edit2, Trash2, Save, X } from 'lucide-react';

const Task = ({ task, onUpdate, onDelete, onChangeDate, projects, currentDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [editedDate, setEditedDate] = useState(currentDate);

  const project = projects.find(p => p.id === task.projectId);
  const urgencyColors = {
    'faible': 'bg-green-100 text-green-700 border-green-200',
    'moyenne': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'élevée': 'bg-red-100 text-red-700 border-red-200'
  };

  const handleSave = () => {
    if (editedDate !== currentDate) {
      onChangeDate(task.id, currentDate, editedDate, editedTask);
    } else {
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
      <div className="bg-white p-3 border rounded shadow-sm">
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
              className="w-full p-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Projet</label>
            <select
              value={editedTask.projectId}
              onChange={(e) => setEditedTask({...editedTask, projectId: e.target.value})}
              className="w-full p-1 border rounded text-sm"
            >
              <option value="">Aucun projet</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tâche</label>
            <input
              type="text"
              value={editedTask.label}
              onChange={(e) => setEditedTask({...editedTask, label: e.target.value})}
              className="w-full p-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Urgence</label>
            <select
              value={editedTask.urgency}
              onChange={(e) => setEditedTask({...editedTask, urgency: e.target.value})}
              className="w-full p-1 border rounded text-sm"
            >
              <option value="faible">Faible</option>
              <option value="moyenne">Moyenne</option>
              <option value="élevée">Élevée</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Commentaire</label>
            <textarea
              value={editedTask.comment}
              onChange={(e) => setEditedTask({...editedTask, comment: e.target.value})}
              className="w-full p-1 border rounded text-sm h-12"
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1 text-xs"
            >
              <Save size={12} />
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 flex items-center gap-1 text-xs"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 border rounded shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1 flex-wrap">
            {project && (
              <span
                className="px-1.5 py-0.5 rounded text-xs text-white truncate"
                style={{ backgroundColor: project.color }}
                title={project.label}
              >
                {project.label}
              </span>
            )}
            <span className={`px-1.5 py-0.5 rounded text-xs border ${urgencyColors[task.urgency]}`}>
              {task.urgency}
            </span>
          </div>

          <h4 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">{task.label}</h4>

          {task.comment && (
            <p className="text-xs text-gray-600 truncate" title={task.comment}>
              {task.comment}
            </p>
          )}
        </div>

        <div className="flex gap-0.5 ml-1">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-500 p-1 rounded hover:bg-blue-50"
            title="Modifier"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50"
            title="Supprimer"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Task;