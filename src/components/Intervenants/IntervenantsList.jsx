import React from 'react';
import IntervenantForm from './IntervenantForm';
import IntervenantItem from './IntervenantItem';

function IntervenantsList({ intervenants, onAdd, onDelete }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Intervenants</h2>
      <IntervenantForm onAdd={onAdd} />
      <div className="space-y-3">
        {intervenants.map(intervenant => (
          <IntervenantItem
            key={intervenant.id}
            intervenant={intervenant}
            onDelete={() => onDelete(intervenant.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default IntervenantsList;