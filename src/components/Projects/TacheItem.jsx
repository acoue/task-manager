import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { getStatusColor, getUrgencyColor } from '../../utils/helpers';

function TacheItem({ tache, intervenant, onEdit, onDelete }) {
  return (
    <div className="bg-gray-50 p-3 rounded border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h5 className="font-medium text-sm">{tache.libelle}</h5>
          <div className="flex gap-2 mt-1 items-center flex-wrap">
            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(tache.statut)}`}>
              {tache.statut}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs ${getUrgencyColor(tache.urgence)}`}>
              {tache.urgence}
            </span>
            {intervenant && (
              <span className="text-xs text-gray-600">👤 {intervenant.nom}</span>
            )}
          </div>
          {tache.commentaire && (
            <p className="text-xs text-gray-600 mt-1">{tache.commentaire}</p>
          )}
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Edit2 className="w-3 h-3" />
          </button>
          <button onClick={onDelete} className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TacheItem;