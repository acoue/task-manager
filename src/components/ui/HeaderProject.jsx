import React from 'react';
import {  Users , BarChart3, Settings} from 'lucide-react';

const HeaderProject = ({ view, onViewChange }) => (
  <header className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Gestion de Projet 2</h1>

    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onViewChange('projets')}
        className={`flex items-center gap-2 px-4 py-2 rounded ${
          view === 'projets' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        <Settings className="w-4 h-4" />
        Projet
      </button>
      <button
        onClick={() => onViewChange('intervenants')}
        className={`flex items-center gap-2 px-4 py-2 rounded ${
          view === 'intervenants' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        Intervenants
      </button>
    </div>
  </header>
);

export default HeaderProject;