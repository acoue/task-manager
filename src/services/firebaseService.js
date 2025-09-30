/**
 * Service de gestion Firebase pour l'application de gestion de projet
 * Gère toutes les opérations CRUD pour les tâches et les projets
 */

// Import Firebase (décommentez pour utiliser Firebase réel)
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy
} from 'firebase/firestore';

class FirebaseService {
  constructor() {
    this.initialized = false;
    this.db = null;
    this.app = null;
  }

  /**
   * Initialise Firebase avec la configuration fournie
   * @param {Object} config - Configuration Firebase
   */
  async initialize(config) {
    try {
      // ========== VERSION PRODUCTION (Firebase réel) ==========
      // Décommentez ce bloc pour utiliser Firebase

      this.app = initializeApp(config);
      this.db = getFirestore(this.app);
      this.initialized = true;
      console.log('✅ Firebase initialisé avec succès');


      // ========== VERSION DEMO (localStorage) ==========
      // Commentez ce bloc en production
      // console.log('⚠️ Mode DEMO - Utilisation du localStorage');
      // console.log('Configuration reçue:', config);
      // this.initialized = true;

      // // Initialiser les données de démo si nécessaire
      // if (!localStorage.getItem('projectManagerData')) {
      //   const initialData = {
      //     tasks: [],
      //     projects: [
      //       {
      //         id: '1',
      //         name: 'Projet par défaut',
      //         color: '#3b82f6'
      //       }
      //     ]
      //   };
      //   localStorage.setItem('projectManagerData', JSON.stringify(initialData));
      // }

      // this.localData = JSON.parse(localStorage.getItem('projectManagerData'));
      // console.log('✅ Données locales chargées');

    } catch (error) {
      console.error('❌ Erreur initialisation Firebase:', error);
      throw error;
    }
  }

  // ==================== MÉTHODES TÂCHES ====================

  /**
   * Récupère toutes les tâches
   * @returns {Promise<Array>} Liste des tâches
   */
  async getTasks() {
    if (!this.initialized) {
      throw new Error('Firebase non initialisé');
    }

    // ========== VERSION DEMO ==========
    // return this.localData.tasks;

    // ========== VERSION PRODUCTION ==========
    // Décommentez pour Firebase

    try {
      const tasksRef = collection(this.db, 'tasks');
      const q = query(tasksRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw error;
    }

  }

  /**
   * Ajoute une nouvelle tâche
   * @param {Object} task - Données de la tâche
   * @returns {Promise<Object>} Tâche créée avec son ID
   */
  async addTask(task) {
    if (!this.initialized) {
      throw new Error('Firebase non initialisé');
    }

    // ========== VERSION DEMO ==========
    // const newTask = {
    //   ...task,
    //   id: Date.now().toString(),
    //   createdAt: new Date().toISOString()
    // };
    // this.localData.tasks.push(newTask);
    // localStorage.setItem('projectManagerData', JSON.stringify(this.localData));
    // console.log('✅ Tâche ajoutée:', newTask);
    // return newTask;

    // ========== VERSION PRODUCTION ==========

    try {
      const tasksRef = collection(this.db, 'tasks');
      const taskData = {
        ...task,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(tasksRef, taskData);
      console.log('✅ Tâche ajoutée avec ID:', docRef.id);
      return { id: docRef.id, ...taskData };
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
      throw error;
    }

  }

  /**
   * Met à jour une tâche existante
   * @param {string} id - ID de la tâche
   * @param {Object} task - Nouvelles données de la tâche
   */
  async updateTask(id, task) {
    if (!this.initialized) {
      throw new Error('Firebase non initialisé');
    }

    // ========== VERSION DEMO ==========
    // const index = this.localData.tasks.findIndex(t => t.id === id);
    // if (index !== -1) {
    //   this.localData.tasks[index] = {
    //     ...task,
    //     id,
    //     updatedAt: new Date().toISOString()
    //   };
    //   localStorage.setItem('projectManagerData', JSON.stringify(this.localData));
    //   console.log('✅ Tâche mise à jour:', id);
    // }

    // ========== VERSION PRODUCTION ==========

    try {
      const taskRef = doc(this.db, 'tasks', id);
      await updateDoc(taskRef, {
        ...task,
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Tâche mise à jour:', id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      throw error;
    }
  }

  /**
   * Supprime une tâche
   * @param {string} id - ID de la tâche à supprimer
   */
  async deleteTask(id) {
    if (!this.initialized) {
      throw new Error('Firebase non initialisé');
    }

    // ========== VERSION DEMO ==========
    // this.localData.tasks = this.localData.tasks.filter(t => t.id !== id);
    // localStorage.setItem('projectManagerData', JSON.stringify(this.localData));
    // console.log('✅ Tâche supprimée:', id);

    // ========== VERSION PRODUCTION ==========

    try {
      const taskRef = doc(this.db, 'tasks', id);
      await deleteDoc(taskRef);
      console.log('✅ Tâche supprimée:', id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      throw error;
    }
  }

  // ==================== MÉTHODES PROJETS ====================

  /**
   * Récupère tous les projets
   * @returns {Promise<Array>} Liste des projets
   */
  async getProjects() {
    if (!this.initialized) {
      throw new Error('Firebase non initialisé');
    }

    // ========== VERSION DEMO ==========
    // return this.localData.projects;

    // ========== VERSION PRODUCTION ==========

    try {
      const projectsRef = collection(this.db, 'projects');
      const querySnapshot = await getDocs(projectsRef);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw error;
    }
  }

  /**
   * Ajoute un nouveau projet
   * @param {Object} project - Données du projet
   * @returns {Promise<Object>} Projet créé avec son ID
   */
  async addProject(project) {
    if (!this.initialized) {
      throw new Error('Firebase non initialisé');
    }

    // ========== VERSION DEMO ==========
    // const newProject = {
    //   ...project,
    //   id: Date.now().toString(),
    //   createdAt: new Date().toISOString()
    // };
    // this.localData.projects.push(newProject);
    // localStorage.setItem('projectManagerData', JSON.stringify(this.localData));
    // console.log('✅ Projet ajouté:', newProject);
    // return newProject;

    // ========== VERSION PRODUCTION ==========

    try {
      const projectsRef = collection(this.db, 'projects');
      const projectData = {
        ...project,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(projectsRef, projectData);
      console.log('✅ Projet ajouté avec ID:', docRef.id);
      return { id: docRef.id, ...projectData };
    } catch (error) {
      console.error('Erreur lors de l\'ajout du projet:', error);
      throw error;
    }
  }

  /**
   * Met à jour un projet existant
   * @param {string} id - ID du projet
   * @param {Object} project - Nouvelles données du projet
   */
  async updateProject(id, project) {
    if (!this.initialized) {
      throw new Error('Firebase non initialisé');
    }

    // ========== VERSION DEMO ==========
    // const index = this.localData.projects.findIndex(p => p.id === id);
    // if (index !== -1) {
    //   this.localData.projects[index] = {
    //     ...project,
    //     id,
    //     updatedAt: new Date().toISOString()
    //   };
    //   localStorage.setItem('projectManagerData', JSON.stringify(this.localData));
    //   console.log('✅ Projet mis à jour:', id);
    // }

    // ========== VERSION PRODUCTION ==========

    try {
      const projectRef = doc(this.db, 'projects', id);
      await updateDoc(projectRef, {
        ...project,
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Projet mis à jour:', id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      throw error;
    }

  }

  /**
   * Supprime un projet
   * @param {string} id - ID du projet à supprimer
   */
  async deleteProject(id) {
    if (!this.initialized) {
      throw new Error('Firebase non initialisé');
    }

    // ========== VERSION DEMO ==========
    // this.localData.projects = this.localData.projects.filter(p => p.id !== id);
    // localStorage.setItem('projectManagerData', JSON.stringify(this.localData));
    // console.log('✅ Projet supprimé:', id);

    // ========== VERSION PRODUCTION ==========

    try {
      const projectRef = doc(this.db, 'projects', id);
      await deleteDoc(projectRef);
      console.log('✅ Projet supprimé:', id);
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      throw error;
    }

  }

  // ==================== MÉTHODES UTILITAIRES ====================

  /**
   * Vérifie si le service est initialisé
   * @returns {boolean}
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Réinitialise les données (utile pour les tests)
   * ⚠️ À utiliser avec précaution en production
   */
  async resetData() {
    if (!this.initialized) {
      throw new Error('Firebase non initialisé');
    }

    // ========== VERSION DEMO ==========
    // const initialData = {
    //   tasks: [],
    //   projects: [
    //     { id: '1', name: 'Projet par défaut', color: '#3b82f6' }
    //   ]
    // };
    // localStorage.setItem('projectManagerData', JSON.stringify(initialData));
    // this.localData = initialData;
    // console.log('⚠️ Données réinitialisées');

    // ========== VERSION PRODUCTION ==========
    // Attention : cette fonction supprimera toutes les données !

    try {
      // Supprimer toutes les tâches
      const tasksSnapshot = await getDocs(collection(this.db, 'tasks'));
      const deleteTasksPromises = tasksSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteTasksPromises);

      // Supprimer tous les projets
      const projectsSnapshot = await getDocs(collection(this.db, 'projects'));
      const deleteProjectsPromises = projectsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteProjectsPromises);

      // Créer le projet par défaut
      await this.addProject({ name: 'Projet par défaut', color: '#3b82f6' });

      console.log('⚠️ Données réinitialisées');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      throw error;
    }
    
  }
}

// Export d'une instance unique (Singleton)
export const firebaseService = new FirebaseService();
export default FirebaseService;