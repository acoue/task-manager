import { saveToStore, getFromStore, getAllFromStore, deleteFromStore, updateSettings, STORES } from './database.js'

export const ProjectService = {
  /**
   * Récupérer tous les projets
   */
  async getProjects() {
    try {
      const projects = await getAllFromStore(STORES.PROJECTS);
      return projects || [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des projets:', error);
      return [];
    }
  },

  /**
   * Récupérer un projet par son ID
   */
  async getProjectById(projectId) {
    try {
      const project = await getFromStore(STORES.PROJECTS, projectId);
      if (!project) {
        throw new Error(`Projet avec l'ID ${projectId} non trouvé`);
      }
      return project;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du projet:', error);
      return null;
    }
  },

  /**
   * Ajouter un nouveau projet
   */
  async addProject(projectData) {
    try {
      // Vérifier que le nom n'existe pas déjà
      const existingProjects = await getAllFromStore(STORES.PROJECTS);
      const existingProject = existingProjects.find(p =>
        p.label.toLowerCase() === projectData.label.toLowerCase()
      );

      if (existingProject) {
        throw new Error(`Un projet avec le nom "${projectData.label}" existe déjà`);
      }

      // Créer le nouveau projet
      const newProject = {
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        label: projectData.label.trim(),
        color: projectData.color || '#3B82F6',
        description: projectData.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      // Sauvegarder le projet
      await saveToStore(STORES.PROJECTS, newProject);

      // Mettre à jour les settings
      await updateSettings({ lastUpdate: new Date().toISOString() });

      console.log(`✅ Projet créé: "${newProject.label}" (${newProject.color})`);
      return newProject;

    } catch (error) {
      console.error('❌ Erreur lors de la création du projet:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un projet existant
   */
  async updateProject(updatedProject) {
    try {
      // Vérifier que le projet existe
      const existingProject = await getFromStore(STORES.PROJECTS, updatedProject.id);
      if (!existingProject) {
        throw new Error(`Projet avec l'ID ${updatedProject.id} non trouvé`);
      }

      // Vérifier l'unicité du nom (sauf pour le projet actuel)
      const allProjects = await getAllFromStore(STORES.PROJECTS);
      const duplicateProject = allProjects.find(p =>
        p.id !== updatedProject.id &&
        p.label.toLowerCase() === updatedProject.label.toLowerCase()
      );

      if (duplicateProject) {
        throw new Error(`Un autre projet avec le nom "${updatedProject.label}" existe déjà`);
      }

      // Mettre à jour le projet
      const projectToUpdate = {
        ...existingProject,
        ...updatedProject,
        label: updatedProject.label.trim(),
        updatedAt: new Date().toISOString()
      };

      await saveToStore(STORES.PROJECTS, projectToUpdate);

      // Mettre à jour les settings
      await updateSettings({ lastUpdate: new Date().toISOString() });

      console.log(`✅ Projet mis à jour: "${updatedProject.label}"`);
      return projectToUpdate;

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du projet:', error);
      throw error;
    }
  },

  /**
   * Supprimer un projet
   */
  async deleteProject(projectId) {
    try {
      // Récupérer le projet à supprimer
      const projectToDelete = await getFromStore(STORES.PROJECTS, projectId);
      if (!projectToDelete) {
        throw new Error(`Projet avec l'ID ${projectId} non trouvé`);
      }

      // Compter combien de tâches utilisent ce projet
      const allTaskEntries = await getAllFromStore(STORES.TASKS);
      let tasksUsingProject = 0;

      // Nettoyer les références dans les tâches
      for (const dateEntry of allTaskEntries) {
        const updatedTasks = dateEntry.tasks.map(task => {
          if (task.projectId === projectId) {
            tasksUsingProject++;
            return {
              ...task,
              projectId: '',
              updatedAt: new Date().toISOString(),
              projectRemovedAt: new Date().toISOString()
            };
          }
          return task;
        });

        // Sauvegarder les tâches mises à jour
        if (updatedTasks !== dateEntry.tasks) {
          await saveToStore(STORES.TASKS, {
            ...dateEntry,
            tasks: updatedTasks
          });
        }
      }

      // Supprimer le projet
      await deleteFromStore(STORES.PROJECTS, projectId);

      // Mettre à jour les settings
      await updateSettings({ lastUpdate: new Date().toISOString() });

      console.log(`🗑️  Projet supprimé: "${projectToDelete.label}" (${tasksUsingProject} tâches mises à jour)`);
      return {
        deletedProject: projectToDelete,
        tasksAffected: tasksUsingProject
      };

    } catch (error) {
      console.error('❌ Erreur lors de la suppression du projet:', error);
      throw error;
    }
  },

  /**
   * Archiver/désarchiver un projet (alternative à la suppression)
   */
  async toggleProjectStatus(projectId) {
    try {
      const project = await getFromStore(STORES.PROJECTS, projectId);
      if (!project) {
        throw new Error(`Projet avec l'ID ${projectId} non trouvé`);
      }

      const newStatus = !project.isActive;
      const updatedProject = {
        ...project,
        isActive: newStatus,
        updatedAt: new Date().toISOString(),
        [newStatus ? 'reactivatedAt' : 'archivedAt']: new Date().toISOString()
      };

      await saveToStore(STORES.PROJECTS, updatedProject);
      await updateSettings({ lastUpdate: new Date().toISOString() });

      console.log(`📦 Projet ${newStatus ? 'réactivé' : 'archivé'}: "${project.label}"`);
      return updatedProject;

    } catch (error) {
      console.error('❌ Erreur lors du changement de statut du projet:', error);
      throw error;
    }
  },

  /**
   * Obtenir les statistiques d'utilisation des projets
   */
  async getProjectsStats() {
    try {
      const projects = await getAllFromStore(STORES.PROJECTS);
      const allTaskEntries = await getAllFromStore(STORES.TASKS);

      const projectStats = {};

      // Initialiser les stats pour chaque projet
      projects.forEach(project => {
        projectStats[project.id] = {
          project,
          totalTasks: 0,
          tasksByUrgency: { 'faible': 0, 'moyenne': 0, 'élevée': 0 },
          tasksByDate: {},
          firstTaskDate: null,
          lastTaskDate: null
        };
      });

      // Statistiques pour les tâches sans projet
      projectStats['no-project'] = {
        project: { id: 'no-project', label: 'Sans projet', color: '#9CA3AF' },
        totalTasks: 0,
        tasksByUrgency: { 'faible': 0, 'moyenne': 0, 'élevée': 0 },
        tasksByDate: {},
        firstTaskDate: null,
        lastTaskDate: null
      };

      // Analyser toutes les tâches
      allTaskEntries.forEach(dateEntry => {
        dateEntry.tasks.forEach(task => {
          const projectId = task.projectId || 'no-project';

          if (projectStats[projectId]) {
            const stats = projectStats[projectId];

            // Compter les tâches
            stats.totalTasks++;
            stats.tasksByUrgency[task.urgency]++;

            // Compter par date
            if (!stats.tasksByDate[dateEntry.date]) {
              stats.tasksByDate[dateEntry.date] = 0;
            }
            stats.tasksByDate[dateEntry.date]++;

            // Trouver les dates extrêmes
            if (!stats.firstTaskDate || dateEntry.date < stats.firstTaskDate) {
              stats.firstTaskDate = dateEntry.date;
            }
            if (!stats.lastTaskDate || dateEntry.date > stats.lastTaskDate) {
              stats.lastTaskDate = dateEntry.date;
            }
          }
        });
      });

      // Calculer les totaux généraux
      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.isActive !== false).length;
      const totalTasks = Object.values(projectStats).reduce((sum, stats) => sum + stats.totalTasks, 0);

      return {
        totalProjects,
        activeProjects,
        archivedProjects: totalProjects - activeProjects,
        totalTasks,
        projectStats,
        mostUsedProject: Object.values(projectStats).reduce((max, stats) =>
          stats.totalTasks > (max?.totalTasks || 0) ? stats : max, null
        ),
        leastUsedProject: Object.values(projectStats)
          .filter(stats => stats.project.id !== 'no-project')
          .reduce((min, stats) =>
            stats.totalTasks < (min?.totalTasks || Infinity) ? stats : min, null
          )
      };

    } catch (error) {
      console.error('❌ Erreur lors du calcul des statistiques des projets:', error);
      return null;
    }
  },

  /**
   * Dupliquer un projet
   */
  async duplicateProject(projectId, newName) {
    try {
      const originalProject = await this.getProjectById(projectId);
      if (!originalProject) {
        throw new Error(`Projet source non trouvé`);
      }

      const duplicatedProject = await this.addProject({
        label: newName || `${originalProject.label} (copie)`,
        color: originalProject.color,
        description: originalProject.description || ''
      });

      console.log(`📋 Projet dupliqué: "${originalProject.label}" → "${duplicatedProject.label}"`);
      return duplicatedProject;

    } catch (error) {
      console.error('❌ Erreur lors de la duplication du projet:', error);
      throw error;
    }
  },

  /**
   * Rechercher des projets
   */
  async searchProjects(query) {
    try {
      const projects = await getAllFromStore(STORES.PROJECTS);
      const lowercaseQuery = query.toLowerCase();

      return projects.filter(project =>
        project.label.toLowerCase().includes(lowercaseQuery) ||
        (project.description && project.description.toLowerCase().includes(lowercaseQuery))
      );

    } catch (error) {
      console.error('❌ Erreur lors de la recherche de projets:', error);
      return [];
    }
  }
}