import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Calendar, BarChart3, Settings, Trash2, Edit2, AlertCircle } from 'lucide-react';

const Header = ({ view, onViewChange, onOpenProjectModal }) => (
  <header className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Gestion de Projet</h1>

    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onViewChange('tasks')}
        className={`flex items-center gap-2 px-4 py-2 rounded ${
          view === 'tasks' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        <Calendar className="w-4 h-4" />
        Tâches
      </button>
      <button
        onClick={() => onViewChange('stats')}
        className={`flex items-center gap-2 px-4 py-2 rounded ${
          view === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        Statistiques
      </button>
      <button
        onClick={onOpenProjectModal}
        className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 ml-auto"
      >
        <Settings className="w-4 h-4" />
        Projets
      </button>
    </div>
  </header>
);

export default Header;