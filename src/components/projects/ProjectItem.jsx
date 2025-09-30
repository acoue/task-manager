import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';

const ProjectItem = ({ project, onEdit, onDelete }) => (
  <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: project.color }} />
      <span>{project.name}</span>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(project)}
        className="text-blue-600 hover:text-blue-800 p-1"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(project.id)}
        className="text-red-600 hover:text-red-800 p-1"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);
export default ProjectItem;