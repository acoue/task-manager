// Service de base de données utilisant IndexedDB (compatible navigateur)

const DB_NAME = 'TaskManagerDB';
const DB_VERSION = 1;
const STORES = {
  TASKS: 'tasks',
  PROJECTS: 'projects',
  SETTINGS: 'settings'
};

let db = null;

// Structure par défaut des données
const defaultData = {
  projects: [
    {
      id: '1',
      label: 'Personnel',
      color: '#10B981',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: '2',
      label: 'Travail',
      color: '#3B82F6',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: '3',
      label: 'Urgent',
      color: '#EF4444',
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ],
  settings: {
    version: '1.0.0',
    lastUpdate: new Date().toISOString(),
    theme: 'light',
    autoSave: true,
    isFirstRun: true
  }
};

/**
 * Initialiser la base de données IndexedDB
 */
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    console.log('🗄️ Initialisation d\'IndexedDB...');

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('❌ Erreur lors de l\'ouverture d\'IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('✅ IndexedDB initialisée avec succès');

      // Initialiser les données par défaut si c'est la première fois
      initDefaultData().then(() => {
        resolve(db);
      }).catch(reject);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      console.log('🔧 Mise à jour de la structure IndexedDB...');

      // Créer le store pour les tâches (par date)
      if (!db.objectStoreNames.contains(STORES.TASKS)) {
        const taskStore = db.createObjectStore(STORES.TASKS, { keyPath: 'date' });
        console.log('📋 Store "tasks" créé');
      }

      // Créer le store pour les projets
      if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
        const projectStore = db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
        console.log('🎯 Store "projects" créé');
      }

      // Créer le store pour les paramètres
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        const settingsStore = db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        console.log('⚙️ Store "settings" créé');
      }
    };
  });
};

/**
 * Initialiser les données par défaut
 */
const initDefaultData = async () => {
  try {
    // Vérifier si c'est la première fois
    const settings = await getFromStore(STORES.SETTINGS, 'app');

    if (!settings || settings.isFirstRun) {
      console.log('🆕 Première utilisation - Insertion des données par défaut...');

      // Insérer les projets par défaut
      for (const project of defaultData.projects) {
        await saveToStore(STORES.PROJECTS, project);
      }

      // Insérer les tâches d'exemple
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      const defaultTasks = {
        [today]: [
          {
            id: 'task_' + Date.now() + '_1',
            projectId: '1',
            label: 'Faire les courses',
            urgency: 'moyenne',
            comment: 'Acheter du pain et du lait',
            createdAt: new Date().toISOString()
          },
          {
            id: 'task_' + Date.now() + '_2',
            projectId: '2',
            label: 'Réunion équipe',
            urgency: 'élevée',
            comment: 'Présentation du nouveau projet',
            createdAt: new Date().toISOString()
          }
        ],
        [tomorrow]: [
          {
            id: 'task_' + Date.now() + '_3',
            projectId: '1',
            label: 'Médecin',
            urgency: 'moyenne',
            comment: 'Rendez-vous à 14h',
            createdAt: new Date().toISOString()
          }
        ]
      };

      // Sauvegarder les tâches par date
      for (const [date, tasks] of Object.entries(defaultTasks)) {
        await saveToStore(STORES.TASKS, { date, tasks });
      }

      // Marquer comme initialisé
      await saveToStore(STORES.SETTINGS, {
        key: 'app',
        ...defaultData.settings,
        isFirstRun: false,
        lastUpdate: new Date().toISOString()
      });

      console.log('✅ Données par défaut insérées avec succès');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des données:', error);
  }
};

/**
 * Sauvegarder des données dans un store
 */
export const saveToStore = (storeName, data) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Base de données non initialisée'));
      return;
    }

    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Récupérer des données d'un store
 */
export const getFromStore = (storeName, key) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Base de données non initialisée'));
      return;
    }

    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Récupérer toutes les données d'un store
 */
export const getAllFromStore = (storeName) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Base de données non initialisée'));
      return;
    }

    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Supprimer des données d'un store
 */
export const deleteFromStore = (storeName, key) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Base de données non initialisée'));
      return;
    }

    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Mettre à jour les paramètres
 */
export const updateSettings = async (updates) => {
  const currentSettings = await getFromStore(STORES.SETTINGS, 'app') || defaultData.settings;
  const newSettings = {
    ...currentSettings,
    ...updates,
    lastUpdate: new Date().toISOString()
  };

  await saveToStore(STORES.SETTINGS, { key: 'app', ...newSettings });
  return newSettings;
};

/**
 * Obtenir des statistiques sur la base de données
 */
export const getDatabaseStats = async () => {
  try {
    const [allTasks, allProjects, settings] = await Promise.all([
      getAllFromStore(STORES.TASKS),
      getAllFromStore(STORES.PROJECTS),
      getFromStore(STORES.SETTINGS, 'app')
    ]);

    const totalTasks = allTasks.reduce((sum, dateEntry) => sum + (dateEntry.tasks?.length || 0), 0);
    const totalProjects = allProjects.length;
    const datesWithTasks = allTasks.length;

    return {
      totalTasks,
      totalProjects,
      datesWithTasks,
      lastUpdate: settings?.lastUpdate || 'Inconnue',
      version: settings?.version || '1.0.0',
      storageType: 'IndexedDB'
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats:', error);
    return null;
  }
};

/**
 * Vider complètement la base de données (pour les tests)
 */
export const clearDatabase = async () => {
  if (!db) {
    throw new Error('Base de données non initialisée');
  }

  const storeNames = [STORES.TASKS, STORES.PROJECTS, STORES.SETTINGS];

  for (const storeName of storeNames) {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    await new Promise((resolve, reject) => {
      const request = store.clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  console.log('🧹 Base de données vidée');
};

// Exporter les constantes pour les autres services
export { STORES, db };