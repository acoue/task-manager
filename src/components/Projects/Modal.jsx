import React, { useState } from 'react';
import { STATUTS, URGENCES } from '../../utils/constants';

function Modal({ type, item, intervenants, onClose, onSave }) {
  const [formData, setFormData] = useState(
    item || {
      libelle: '',
      statut: 'En attente',
      commentaire: '',
      dateDebut: '',
      dateFin: '',
      urgence: 'Moyenne',
      intervenant: ''
    }
  );
  const [loading, setLoading] = useState(false);

  const titles = {
    projet: item ? 'Modifier le Projet' : 'Nouveau Projet',
    sousProjet: item ? 'Modifier le Sous-Projet' : 'Nouveau Sous-Projet',
    tache: item ? 'Modifier la Tâche' : 'Nouvelle Tâche'
  };

  const handleSubmit = async () => {
    if (formData.libelle && !loading) {
      setLoading(true);
      try {
        await onSave(formData);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{titles[type]}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Libellé</label>
            <input
              type="text"
              value={formData.libelle}
              onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {type === 'tache' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Urgence</label>
                <select
                  value={formData.urgence}
                  onChange={(e) => setFormData({ ...formData, urgence: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {URGENCES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Intervenant</label>
                <select
                  value={formData.intervenant}
                  onChange={(e) => setFormData({ ...formData, intervenant: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Aucun</option>
                  {intervenants.map(i => (
                    <option key={i.id} value={i.id}>{i.nom}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {type !== 'tache' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Date de début</label>
                <input
                  type="date"
                  value={formData.dateDebut}
                  onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date de fin</label>
                <input
                  type="date"
                  value={formData.dateFin}
                  onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Commentaire</label>
            <textarea
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : (item ? 'Modifier' : 'Créer')}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;