import React, { useState, useEffect } from 'react';
import HeaderProject from './ui/HeaderProject';
import Modal from './ui/Modal';
import ProjetsList from './Projects/ProjetsList';
import IntervenantsList from './Intervenants/IntervenantsList';
import ErrorDisplay from './ui/ErrorDisplay.jsx';

// ==================== IMPORTS FIREBASE ====================
import { firebaseTaskService } from '../services/firebaseService.js';
import { FIREBASE_TASK_CONFIG } from '../config/firebaseTask.config.js';
const AppProject = ({ onRetour }) => {

  const [activeTab, setActiveTab] = useState('projets');
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedSubProjects, setExpandedSubProjects] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [parentIds, setParentIds] = useState({ projectId: null, subProjectId: null });
  const [error, setError] = useState(null);


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
    }  else if (modalType === 'intervenant') {
      editingItem
        ? await actions.modifierIntervenant(editingItem.id, data)
        : await actions.ajouterIntervenant(data);
    }
    closeModal();
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
    },

    modifierProjet: async (id, updatedProjet) => {
      const projet = projets.find(p => p.id === id);
      await firebaseTaskService.modifierProjetFirebase(id, {
        ...projet,
        ...updatedProjet
      });
    },

    supprimerProjet: async (id) => {
      await firebaseTaskService.supprimerProjetFirebase(id);
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
      }
    },

    ajouterIntervenant: async (nom, email) => {
      await firebaseTaskService.ajouterIntervenantFirebase({
        nom,
        email,
        notifications: []
      });
    },

    modifierIntervenant: async (id, updatedIntervenant) => {
      const intervenant = intervenants.find(i => i.id === id);
      await firebaseTaskService.modifierIntervenantFirebase(id, {
        ...intervenant,
        ...updatedIntervenant
      });
    },
    supprimerIntervenant: async (id) => {
      await firebaseTaskService.supprimerIntervenantFirebase(id);
    }
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


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4l mx-auto p-5">
        <button
          onClick={onRetour}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          ← Retour à l'accueil
        </button>
      </div>
      <div className="max-w-6xl mx-auto ">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <HeaderProject
              view={activeTab}
              onViewChange={setActiveTab}
            />

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