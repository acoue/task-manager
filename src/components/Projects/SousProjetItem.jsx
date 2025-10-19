import React from 'react';
import { ChevronRight, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';
import TacheItem from './TacheItem';

function SousProjetItem({
  sousProjet,
  intervenants,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddTache,
  onEditTache,
  onDeleteTache
}) {
  return (
    <div className="border-l-2 border-blue-300 pl-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button onClick={onToggle} className="mt-1">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="flex-1">
            <h4 className="font-medium">{sousProjet.libelle}</h4>
            <div className="flex gap-2 mt-1 items-center flex-wrap">
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(sousProjet.statut)}`}>
                {sousProjet.statut}
              </span>
              <span className="text-xs text-gray-600">
                {sousProjet.dateDebut} → {sousProjet.dateFin}
              </span>
            </div>
            {sousProjet.commentaire && (
              <p className="text-xs text-gray-600 mt-1">{sousProjet.commentaire}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Edit2 className="w-3 h-3" />
          </button>
          <button onClick={onDelete} className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            onClick={onAddTache}
            className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            + Tâche
          </button>
        </div>
      </div>

      {isExpanded && sousProjet.taches && sousProjet.taches.length > 0 && (
        <div className="mt-3 ml-7 space-y-2">
          {sousProjet.taches.map(tache => {
            const intervenant = intervenants.find(i => i.id === tache.intervenant);
            return (
              <TacheItem
                key={tache.id}
                tache={tache}
                intervenant={intervenant}
                onEdit={() => onEditTache(tache)}
                onDelete={() => onDeleteTache(tache.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SousProjetItem;