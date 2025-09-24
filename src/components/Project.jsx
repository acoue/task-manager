import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Save, X } from 'lucide-react';

const addProject = (projectData) => {
  const newProject = {
    ...projectData,
    id: Date.now().toString()
  };
  const newProjects = [...projects, newProject];
  setProjects(newProjects);
  saveToFile({ tasks, projects: newProjects });
};

const updateProject = (updatedProject) => {
  const newProjects = projects.map(project =>
    project.id === updatedProject.id ? updatedProject : project
  );
  setProjects(newProjects);
  saveToFile({ tasks, projects: newProjects });
};

const deleteProject = (projectId) => {
  const newProjects = projects.filter(project => project.id !== projectId);
  setProjects(newProjects);

  // Supprimer la référence du projet dans les tâches
  const newTasks = { ...tasks };
  Object.keys(newTasks).forEach(date => {
    newTasks[date] = newTasks[date].map(task =>
      task.projectId === projectId ? { ...task, projectId: '' } : task
    );
  });
  setTasks(newTasks);

  saveToFile({ tasks: newTasks, projects: newProjects });
};


// Composant Task
const ProjectManager = ({ projects, onAddProject, onUpdateProject, onDeleteProject, isOpen, onClose }) => {
  const [newProject, setNewProject] = useState({ label: '', color: '#3B82F6' });
  const [editingProject, setEditingProject] = useState(null);



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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gestion des Projets</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Nom du projet"
              value={newProject.label}
              onChange={(e) => setNewProject({ ...newProject, label: e.target.value })}
              className="flex-1 p-2 border rounded-md"
              required
            />
            <input
              type="color"
              value={newProject.color}
              onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
              className="w-12 h-10 border rounded-md cursor-pointer"
            />
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Ajouter le projet
          </button>
        </div>

        <div className="space-y-2">
          {projects.map(project => (
            <div key={project.id} className="flex items-center justify-between p-2 border rounded-md">
              {editingProject === project.id ? (
                <div className="flex gap-2 flex-1">
                  <input
                    type="text"
                    value={project.label}
                    onChange={(e) => handleUpdateProject({ ...project, label: e.target.value })}
                    className="flex-1 p-1 border rounded"
                  />
                  <input
                    type="color"
                    value={project.color}
                    onChange={(e) => handleUpdateProject({ ...project, color: e.target.value })}
                    className="w-8 h-8 border rounded cursor-pointer"
                  />
                  <button
                    onClick={() => setEditingProject(null)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Save size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <span>{project.label}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingProject(project.id)}
                      className="text-gray-500 hover:text-blue-500"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;