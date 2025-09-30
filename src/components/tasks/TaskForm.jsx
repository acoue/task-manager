import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Calendar, BarChart3, Settings, Trash2, Edit2, AlertCircle } from 'lucide-react';


const TaskForm = ({ task, projects, onSave, onCancel }) => {
  const [formData, setFormData] = useState(task || {
    label: '',
    projectId: '',
    urgency: 'medium',
    comment: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.label || !formData.projectId || !formData.date) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Libellé *</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({...formData, label: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Projet *</label>
        <select
          value={formData.projectId}
          onChange={(e) => setFormData({...formData, projectId: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Sélectionner un projet</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date *</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Urgence</label>
        <select
          value={formData.urgency}
          onChange={(e) => setFormData({...formData, urgency: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="low">Faible</option>
          <option value="medium">Moyen</option>
          <option value="high">Élevé</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Commentaire</label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData({...formData, comment: e.target.value})}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'En cours...' : (task ? 'Modifier' : 'Ajouter')}
        </button>
      </div>
    </div>
  );
};
export default TaskForm;