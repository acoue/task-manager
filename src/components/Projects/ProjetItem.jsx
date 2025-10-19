import React from 'react';
import { ChevronRight, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';
import SousProjetItem from './SousProjetItem';

function ProjetItem({
  projet,
  intervenants,
  isExpanded,
  expandedSubProjects,
  onToggle,
  onToggleSubProject,
  onEdit,
  onDelete,
  onAddSousProjet,
  onEditSousProjet,
  onDeleteSousProjet,
  onAddTache,
  onEditTache,
  onDeleteTache
}) {
  return (
    <div className="border rounded-lg bg-white">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <button onClick={onToggle} className="mt-1">
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{projet.libelle}</h3>
              <div className="flex gap-2 mt-2 items-center flex-wrap">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(projet.statut)}`}>
                  {projet.statut}
                </span>
                <span className="text-sm text-gray-600">
                  {projet.dateDebut} → {projet.dateFin}
                </span>
              </div>
              {projet.commentaire && (
                <p className="text-sm text-gray-600 mt-2">{projet.commentaire}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded">
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onAddSousProjet}
              className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Sous-Projet
            </button>
          </div>
        </div>

        {isExpanded && projet.sousProjets && projet.sousProjets.length > 0 && (
          <div className="mt-4 ml-8 space-y-3">
            {projet.sousProjets.map(sousProjet => (
              <SousProjetItem
                key={sousProjet.id}
                sousProjet={sousProjet}
                intervenants={intervenants}
                isExpanded={expandedSubProjects[sousProjet.id]}
                onToggle={() => onToggleSubProject(sousProjet.id)}
                onEdit={() => onEditSousProjet(sousProjet)}
                onDelete={() => onDeleteSousProjet(sousProjet.id)}
                onAddTache={() => onAddTache(sousProjet.id)}
                onEditTache={(tache) => onEditTache(sousProjet.id, tache)}
                onDeleteTache={(tacheId) => onDeleteTache(sousProjet.id, tacheId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjetItem;