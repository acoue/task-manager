import React from 'react';
import { Plus } from 'lucide-react';
import ProjetItem from './ProjetItem';

function ProjetsList({
  projets,
  intervenants,
  expandedProjects,
  expandedSubProjects,
  onToggleProject,
  onToggleSubProject,
  onAddProjet,
  onEditProjet,
  onDeleteProjet,
  onAddSousProjet,
  onEditSousProjet,
  onDeleteSousProjet,
  onAddTache,
  onEditTache,
  onDeleteTache
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Projets</h2>
        <button
          onClick={onAddProjet}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouveau Projet
        </button>
      </div>

      {projets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Aucun projet. Créez-en un pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projets.map(projet => (
            <ProjetItem
              key={projet.id}
              projet={projet}
              intervenants={intervenants}
              isExpanded={expandedProjects[projet.id]}
              expandedSubProjects={expandedSubProjects}
              onToggle={() => onToggleProject(projet.id)}
              onToggleSubProject={onToggleSubProject}
              onEdit={() => onEditProjet(projet)}
              onDelete={() => onDeleteProjet(projet.id)}
              onAddSousProjet={() => onAddSousProjet(projet.id)}
              onEditSousProjet={(sp) => onEditSousProjet(projet.id, sp)}
              onDeleteSousProjet={(spId) => onDeleteSousProjet(projet.id, spId)}
              onAddTache={(spId) => onAddTache(projet.id, spId)}
              onEditTache={(spId, tache) => onEditTache(projet.id, spId, tache)}
              onDeleteTache={(spId, tacheId) => onDeleteTache(projet.id, spId, tacheId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjetsList;