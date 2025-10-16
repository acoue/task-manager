import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Calendar, BarChart3, Settings, Trash2, Edit2, AlertCircle } from 'lucide-react';
import ProjectItem from './ProjectItem';
const ProjectManager = ({ projects, onSave, onDelete }) => {
  const [formData, setFormData] = useState({ name: '', color: '#3b82f6' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name) {
      alert('Veuillez entrer un nom de projet');
      return;
    }
    setLoading(true);
    await onSave(formData, editingId);
    setFormData({ name: '', color: '#3b82f6' });
    setEditingId(null);
    setLoading(false);
  };

  const handleEdit = (project) => {
    setFormData({ name: project.name, color: project.color });
    setEditingId(project.id);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nom du projet *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Couleur</label>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
            className="w-full h-10 border border-gray-300 rounded cursor-pointer"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'En cours...' : (editingId ? 'Modifier' : 'Ajouter')} le projet
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Projets existants</h3>
        {projects.map(project => (
          <ProjectItem
            key={project.id}
            project={project}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
export default ProjectManager;