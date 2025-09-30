import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Calendar, BarChart3, Settings, Trash2, Edit2, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, projects, onUpdate, onDelete }) => {
  const getProjectColor = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.color : '#cccccc';
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Sans projet';
  };

  const urgencyLabels = { low: 'Faible', medium: 'Moyen', high: 'Élevé' };
  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getProjectColor(task.projectId) }}
            />
            <span className="text-sm font-medium text-gray-600">{getProjectName(task.projectId)}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${urgencyColors[task.urgency]}`}>
              {urgencyLabels[task.urgency]}
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-2">{task.label}</h3>
          {task.comment && (
            <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded">{task.comment}</p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onUpdate(task)}
            className="text-blue-600 hover:text-blue-800 p-1"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;