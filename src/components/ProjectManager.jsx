import React, { useState } from 'react';
import { X, Edit2, Trash2, Save } from 'lucide-react';

const ProjectManager = ({ projects, onAddProject, onUpdateProject, onDeleteProject, isOpen, onClose }) => {
  const [newProject, setNewProject] = useState({ label: '', color: '#3B82F6' });
  const [editingProject, setEditingProject] = useState(null);

  if (!isOpen) return null;

  const handleAddProject = () => {
    if (newProject.label.trim()) {
      onAddProject(newProject);
      setNewProject({ label: '', color: '#3B82F6' });
    }
  };

  const handleUpdateProject = (project) => {
    onUpdateProject(project);
    setEditingProject(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddProject();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🎯 Gestion des Projets</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulaire d'ajout */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Nouveau Projet</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nom du projet"
                value={newProject.label}
                onChange={(e) => setNewProject({...newProject, label: e.target.value})}
                onKeyPress={handleKeyPress}
                className="flex-1 p-2 border rounded-md focus:border-blue-500 focus:outline-none"
                required
              />
              <input
                type="color"
                value={newProject.color}
                onChange={(e) => setNewProject({...newProject, color: e.target.value})}
                className="w-12 h-10 border rounded-md cursor-pointer"
                title="Couleur du projet"
              />
            </div>
            <button
              type="button"
              onClick={handleAddProject}
              disabled={!newProject.label.trim()}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Ajouter le projet
            </button>
          </div>
        </div>

        {/* Liste des projets */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Projets Existants ({projects.length})
          </h3>

          {projects.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">Aucun projet créé</p>
              <p className="text-gray-400 text-xs mt-1">Ajoutez votre premier projet ci-dessus</p>
            </div>
          ) : (
            projects.map(project => (
              <div key={project.id} className="flex items-center justify-between p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                {editingProject === project.id ? (
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={project.label}
                      onChange={(e) => handleUpdateProject({...project, label: e.target.value})}
                      className="flex-1 p-1 border rounded text-sm focus:border-blue-500 focus:outline-none"
                      autoFocus
                    />
                    <input
                      type="color"
                      value={project.color}
                      onChange={(e) => handleUpdateProject({...project, color: e.target.value})}
                      className="w-8 h-8 border rounded cursor-pointer"
                    />
                    <button
                      onClick={() => setEditingProject(null)}
                      className="text-green-600 hover:text-green-800 p-1 hover:bg-green-100 rounded transition-colors"
                      title="Valider"
                    >
                      <Save size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: project.color }}
                        title={`Couleur: ${project.color}`}
                      ></div>
                      <span className="font-medium text-gray-800">{project.label}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingProject(project.id)}
                        className="text-gray-500 hover:text-blue-500 p-1 hover:bg-blue-100 rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.label}" ?`)) {
                            onDeleteProject(project.id);
                          }
                        }}
                        className="text-gray-500 hover:text-red-500 p-1 hover:bg-red-100 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 <strong>Astuce :</strong> Les couleurs des projets apparaîtront sur vos tâches pour une meilleure organisation visuelle.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;