import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, ChevronDown, Edit2, Trash2, Users, Bell } from 'lucide-react';

import { firebaseTaskService } from '../services/firebaseService.js';
import { FIREBASE_TASK_CONFIG } from '../config/firebaseTask.config.js';

const STATUTS = ['En attente', 'En cours', 'Terminé', 'Bloqué'];
const URGENCES = ['Faible', 'Moyenne', 'Haute', 'Critique'];

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const getStatusColor = (statut) => {
  const colors = {
    'En attente': 'bg-gray-200 text-gray-700',
    'En cours': 'bg-blue-200 text-blue-700',
    'Terminé': 'bg-green-200 text-green-700',
    'Bloqué': 'bg-red-200 text-red-700'
  };
  return colors[statut] || 'bg-gray-200';
};

const getUrgencyColor = (urgence) => {
  const colors = {
    'Faible': 'bg-green-100 text-green-700',
    'Moyenne': 'bg-yellow-100 text-yellow-700',
    'Haute': 'bg-orange-100 text-orange-700',
    'Critique': 'bg-red-100 text-red-700'
  };
  return colors[urgence] || 'bg-gray-100';
};

function Navigation({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b">
      <button
        onClick={() => setActiveTab('projets')}
        className={`px-6 py-3 font-medium ${activeTab === 'projets' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
      >
        Projets
      </button>
      <button
        onClick={() => setActiveTab('intervenants')}
        className={`px-6 py-3 font-medium ${activeTab === 'intervenants' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
      >
        <Users className="inline w-4 h-4 mr-2" />
        Intervenants
      </button>
    </div>
  );
}

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

function IntervenantItem({ intervenant, onDelete }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold">{intervenant.nom}</h3>
          <p className="text-sm text-gray-600">{intervenant.email}</p>
          {intervenant.notifications && intervenant.notifications.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications ({intervenant.notifications.length})
              </h4>
              <div className="mt-2 space-y-1">
                {intervenant.notifications.slice(-3).map(notif => (
                  <div key={notif.id} className="text-xs bg-blue-50 p-2 rounded">
                    <strong>{notif.tache}</strong> - {notif.projet} / {notif.sousProjet}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function IntervenantForm({ onAdd }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (nom && email && !loading) {
      setLoading(true);
      try {
        await onAdd(nom, email);
        setNom('');
        setEmail('');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nom de l'intervenant"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="px-3 py-2 border rounded-lg"
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 border rounded-lg"
          disabled={loading}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Ajout en cours...' : 'Ajouter l\'intervenant'}
      </button>
    </div>
  );
}

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

function useFirebaseManager() {
  const [projets, setProjets] = useState([]);
  const [intervenants, setIntervenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {

        setLoading(true);
        // Initialiser Firebase
        await firebaseTaskService.initialize(FIREBASE_TASK_CONFIG);

        // Charger les données
        await loadData();
      } catch (err) {
        setError(err.message);
        console.error('Erreur initialisation:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loadData = async () => {
    try {
      const [loadedProjects, loadedIntervenants] = await Promise.all([
        firebaseTaskService.getProjets(),
        firebaseTaskService.getIntervenants()
        // firebaseTaskService.ecouterProjets(),
        // firebaseTaskService.ecouterIntervenants()
      ]);
      setProjets(loadedProjects);
      setIntervenants(loadedIntervenants);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    }
  };


  const notifierIntervenant = async (intervenantId, tache, projet, sousProjet) => {
    const intervenant = intervenants.find(i => i.id === intervenantId);
    if (intervenant) {
      const nouvellesNotifications = [
        ...(intervenant.notifications || []),
        {
          id: generateId(),
          date: new Date().toISOString(),
          tache: tache.libelle,
          projet: projet.libelle,
          sousProjet: sousProjet.libelle
        }
      ];
      await firebaseTaskService.modifierIntervenantFirebase(intervenantId, {
        ...intervenant,
        notifications: nouvellesNotifications
      });
    }
  };

  const actions = {
    ajouterProjet: async (projet) => {
      await firebaseTaskService.ajouterProjetFirebase({
        ...projet,
        sousProjets: []
      });

      await loadData();
    },

    modifierProjet: async (id, updatedProjet) => {
      const projet = projets.find(p => p.id === id);
      await firebaseTaskService.modifierProjetFirebase(id, {
        ...projet,
        ...updatedProjet
      });

      await loadData();
    },

    supprimerProjet: async (id) => {
      await firebaseTaskService.supprimerProjetFirebase(id);

      await loadData();
    },

    ajouterSousProjet: async (projectId, sousProjet) => {
      const projet = projets.find(p => p.id === projectId);
      if (projet) {
        const nouveauxSousProjets = [
          ...(projet.sousProjets || []),
          { ...sousProjet, id: generateId(), taches: [] }
        ];
        await firebaseTaskService.modifierProjetFirebase(projectId, {
          ...projet,
          sousProjets: nouveauxSousProjets
        });

        await loadData();
      }
    },

    modifierSousProjet: async (projectId, subProjectId, updatedSousProjet) => {
      const projet = projets.find(p => p.id === projectId);
      if (projet) {
        const sousProjets = (projet.sousProjets || []).map(sp =>
          sp.id === subProjectId ? { ...sp, ...updatedSousProjet } : sp
        );
        await firebaseTaskService.modifierProjetFirebase(projectId, {
          ...projet,
          sousProjets
        });

        await loadData();
      }
    },

    supprimerSousProjet: async (projectId, subProjectId) => {
      const projet = projets.find(p => p.id === projectId);
      if (projet) {
        const sousProjets = (projet.sousProjets || []).filter(sp => sp.id !== subProjectId);
        await firebaseTaskService.modifierProjetFirebase(projectId, {
          ...projet,
          sousProjets
        });

        await loadData();
      }
    },

    ajouterTache: async (projectId, subProjectId, tache) => {
      const projet = projets.find(p => p.id === projectId);
      if (projet) {
        const sousProjet = (projet.sousProjets || []).find(sp => sp.id === subProjectId);
        if (sousProjet) {
          const nouvelleTache = { ...tache, id: generateId() };

          const sousProjets = (projet.sousProjets || []).map(sp => {
            if (sp.id === subProjectId) {
              return {
                ...sp,
                taches: [...(sp.taches || []), nouvelleTache]
              };
            }
            return sp;
          });

          await firebaseTaskService.modifierProjetFirebase(projectId, {
            ...projet,
            sousProjets
          });

          if (tache.intervenant) {
            await notifierIntervenant(tache.intervenant, nouvelleTache, projet, sousProjet);
          }

          await loadData();
        }
      }
    },

    modifierTache: async (projectId, subProjectId, tacheId, updatedTache) => {
      const projet = projets.find(p => p.id === projectId);
      if (projet) {
        const sousProjets = (projet.sousProjets || []).map(sp => {
          if (sp.id === subProjectId) {
            return {
              ...sp,
              taches: (sp.taches || []).map(t =>
                t.id === tacheId ? { ...t, ...updatedTache } : t
              )
            };
          }
          return sp;
        });

        await firebaseTaskService.modifierProjetFirebase(projectId, {
          ...projet,
          sousProjets
        });

        await loadData();
      }
    },

    supprimerTache: async (projectId, subProjectId, tacheId) => {
      const projet = projets.find(p => p.id === projectId);
      if (projet) {
        const sousProjets = (projet.sousProjets || []).map(sp => {
          if (sp.id === subProjectId) {
            return {
              ...sp,
              taches: (sp.taches || []).filter(t => t.id !== tacheId)
            };
          }
          return sp;
        });

        await firebaseTaskService.modifierProjetFirebase(projectId, {
          ...projet,
          sousProjets
        });

        await loadData();
      }
    },

    ajouterIntervenant: async (nom, email) => {
      await firebaseTaskService.ajouterIntervenantFirebase({
        nom,
        email,
        notifications: []
      });

      await loadData();
    },

    supprimerIntervenant: async (id) => {
      await firebaseTaskService.supprimerIntervenantFirebase(id);

      await loadData();
    }

  };

  return { projets, intervenants, loading, actions };
}

function AppProject({ onRetour }) {
  const [activeTab, setActiveTab] = useState('projets');
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedSubProjects, setExpandedSubProjects] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [parentIds, setParentIds] = useState({ projectId: null, subProjectId: null });

  const { projets, intervenants, loading, actions } = useFirebaseManager();

  const openModal = (type, parent = {}, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setParentIds(parent);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setModalType('');
    setParentIds({ projectId: null, subProjectId: null });
  };

  const handleSave = async (data) => {
    if (modalType === 'projet') {
      editingItem ? await actions.modifierProjet(editingItem.id, data) : await actions.ajouterProjet(data);
    } else if (modalType === 'sousProjet') {
      editingItem
        ? await actions.modifierSousProjet(parentIds.projectId, editingItem.id, data)
        : await actions.ajouterSousProjet(parentIds.projectId, data);
    } else if (modalType === 'tache') {
      editingItem
        ? await actions.modifierTache(parentIds.projectId, parentIds.subProjectId, editingItem.id, data)
        : await actions.ajouterTache(parentIds.projectId, parentIds.subProjectId, data);
    }
    closeModal();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4l mx-auto p-5">
        <button
          onClick={onRetour}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          ← Retour à l'accueil
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-6">
            {activeTab === 'projets' ? (
              <ProjetsList
                projets={projets}
                intervenants={intervenants}
                expandedProjects={expandedProjects}
                expandedSubProjects={expandedSubProjects}
                onToggleProject={(id) => setExpandedProjects({ ...expandedProjects, [id]: !expandedProjects[id] })}
                onToggleSubProject={(id) => setExpandedSubProjects({ ...expandedSubProjects, [id]: !expandedSubProjects[id] })}
                onAddProjet={() => openModal('projet')}
                onEditProjet={(p) => openModal('projet', {}, p)}
                onDeleteProjet={actions.supprimerProjet}
                onAddSousProjet={(pId) => openModal('sousProjet', { projectId: pId })}
                onEditSousProjet={(pId, sp) => openModal('sousProjet', { projectId: pId }, sp)}
                onDeleteSousProjet={actions.supprimerSousProjet}
                onAddTache={(pId, spId) => openModal('tache', { projectId: pId, subProjectId: spId })}
                onEditTache={(pId, spId, t) => openModal('tache', { projectId: pId, subProjectId: spId }, t)}
                onDeleteTache={actions.supprimerTache}
              />
            ) : (
              <IntervenantsList
                intervenants={intervenants}
                onAdd={actions.ajouterIntervenant}
                onDelete={actions.supprimerIntervenant}
              />
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          type={modalType}
          item={editingItem}
          intervenants={intervenants}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default AppProject;