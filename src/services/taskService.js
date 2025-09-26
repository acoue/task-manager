import { saveToStore, getFromStore, getAllFromStore, deleteFromStore, updateSettings, STORES } from './database.js'

export const TaskService = {
  /**
   * Récupérer toutes les tâches (organisées par date)
   */
  async getTasks() {
    try {
      const allDateEntries = await getAllFromStore(STORES.TASKS);
      const tasks = {};

      // Reconstruire l'objet tasks par date
      allDateEntries.forEach(entry => {
        tasks[entry.date] = entry.tasks || [];
      });

      return tasks;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des tâches:', error);
      return {};
    }
  },

  /**
   * Récupérer les tâches d'une date spécifique
   */
  async getTasksByDate(date) {
    try {
      const dateEntry = await getFromStore(STORES.TASKS, date);
      return dateEntry?.tasks || [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des tâches pour la date:', date, error);
      return [];
    }
  },

  /**
   * Ajouter une nouvelle tâche
   */
  async addTask(date, taskData) {
    try {
      // Générer un ID unique
      const newTask = {
        ...taskData,
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Récupérer les tâches existantes pour cette date
      const existingEntry = await getFromStore(STORES.TASKS, date);
      const existingTasks = existingEntry?.tasks || [];

      // Ajouter la nouvelle tâche
      const updatedTasks = [...existingTasks, newTask];

      // Sauvegarder
      await saveToStore(STORES.TASKS, {
        date: date,
        tasks: updatedTasks
      });

      // Mettre à jour les settings
      await updateSettings({ lastUpdate: new Date().toISOString() });

      console.log(`✅ Tâche ajoutée: "${newTask.label}" pour le ${date}`);
      return newTask;

    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout de la tâche:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une tâche existante
   */
  async updateTask(updatedTask) {
    try {
      let taskFound = false;
      const allDateEntries = await getAllFromStore(STORES.TASKS);

      // Chercher et mettre à jour la tâche dans toutes les dates
      for (const dateEntry of allDateEntries) {
        const taskIndex = dateEntry.tasks.findIndex(task => task.id === updatedTask.id);

        if (taskIndex !== -1) {
          taskFound = true;
          dateEntry.tasks[taskIndex] = {
            ...dateEntry.tasks[taskIndex],
            ...updatedTask,
            updatedAt: new Date().toISOString()
          };

          // Sauvegarder la date modifiée
          await saveToStore(STORES.TASKS, dateEntry);
          break;
        }
      }

      if (!taskFound) {
        throw new Error(`Tâche avec l'ID ${updatedTask.id} non trouvée`);
      }

      // Mettre à jour les settings
      await updateSettings({ lastUpdate: new Date().toISOString() });

      console.log(`✅ Tâche mise à jour: "${updatedTask.label}"`);
      return updatedTask;

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la tâche:', error);
      throw error;
    }
  },

  /**
   * Supprimer une tâche
   */
  async deleteTask(taskId) {
    try {
      let taskFound = false;
      let deletedTaskLabel = '';
      const allDateEntries = await getAllFromStore(STORES.TASKS);

      // Chercher et supprimer la tâche dans toutes les dates
      for (const dateEntry of allDateEntries) {
        const taskIndex = dateEntry.tasks.findIndex(task => task.id === taskId);

        if (taskIndex !== -1) {
          taskFound = true;
          deletedTaskLabel = dateEntry.tasks[taskIndex].label;
          dateEntry.tasks.splice(taskIndex, 1);

          // Si plus de tâches pour cette date, supprimer complètement l'entrée
          if (dateEntry.tasks.length === 0) {
            await deleteFromStore(STORES.TASKS, dateEntry.date);
          } else {
            await saveToStore(STORES.TASKS, dateEntry);
          }
          break;
        }
      }

      if (!taskFound) {
        throw new Error(`Tâche avec l'ID ${taskId} non trouvée`);
      }

      // Mettre à jour les settings
      await updateSettings({ lastUpdate: new Date().toISOString() });

      console.log(`🗑️  Tâche supprimée: "${deletedTaskLabel}"`);
      return true;

    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la tâche:', error);
      throw error;
    }
  },

  /**
   * Changer la date d'une tâche (déplacer entre les dates)
   */
  async changeTaskDate(taskId, oldDate, newDate, updatedTask) {
    try {
      // Récupérer l'ancienne entrée
      const oldDateEntry = await getFromStore(STORES.TASKS, oldDate);
      if (!oldDateEntry || !oldDateEntry.tasks) {
        throw new Error(`Aucune tâche trouvée pour la date ${oldDate}`);
      }

      const taskIndex = oldDateEntry.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        throw new Error(`Tâche avec l'ID ${taskId} non trouvée dans la date ${oldDate}`);
      }

      // Supprimer de l'ancienne date
      oldDateEntry.tasks.splice(taskIndex, 1);

      // Si plus de tâches pour l'ancienne date, supprimer l'entrée
      if (oldDateEntry.tasks.length === 0) {
        await deleteFromStore(STORES.TASKS, oldDate);
      } else {
        await saveToStore(STORES.TASKS, oldDateEntry);
      }

      // Récupérer ou créer la nouvelle entrée de date
      const newDateEntry = await getFromStore(STORES.TASKS, newDate);
      const existingTasks = newDateEntry?.tasks || [];

      // Ajouter à la nouvelle date avec les modifications
      const taskToMove = {
        ...updatedTask,
        updatedAt: new Date().toISOString(),
        movedAt: new Date().toISOString(),
        previousDate: oldDate
      };

      const updatedNewTasks = [...existingTasks, taskToMove];

      await saveToStore(STORES.TASKS, {
        date: newDate,
        tasks: updatedNewTasks
      });

      // Mettre à jour les settings
      await updateSettings({ lastUpdate: new Date().toISOString() });

      console.log(`📅 Tâche déplacée: "${updatedTask.label}" de ${oldDate} vers ${newDate}`);
      return taskToMove;

    } catch (error) {
      console.error('❌ Erreur lors du changement de date:', error);
      throw error;
    }
  },

  /**
   * Rechercher des tâches par critères
   */
  async searchTasks(criteria) {
    try {
      const allDateEntries = await getAllFromStore(STORES.TASKS);
      const allTasks = [];

      // Collecter toutes les tâches avec leur date
      allDateEntries.forEach(dateEntry => {
        dateEntry.tasks.forEach(task => {
          allTasks.push({ ...task, date: dateEntry.date });
        });
      });

      // Filtrer selon les critères
      let filteredTasks = allTasks;

      if (criteria.label) {
        filteredTasks = filteredTasks.filter(task =>
          task.label.toLowerCase().includes(criteria.label.toLowerCase())
        );
      }

      if (criteria.projectId) {
        filteredTasks = filteredTasks.filter(task => task.projectId === criteria.projectId);
      }

      if (criteria.urgency) {
        filteredTasks = filteredTasks.filter(task => task.urgency === criteria.urgency);
      }

      if (criteria.dateFrom) {
        filteredTasks = filteredTasks.filter(task => task.date >= criteria.dateFrom);
      }

      if (criteria.dateTo) {
        filteredTasks = filteredTasks.filter(task => task.date <= criteria.dateTo);
      }

      return filteredTasks;

    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      return [];
    }
  },

  /**
   * Obtenir des statistiques sur les tâches
   */
  async getTasksStats() {
    try {
      const allDateEntries = await getAllFromStore(STORES.TASKS);
      const allTasks = [];

      // Collecter toutes les tâches
      allDateEntries.forEach(dateEntry => {
        allTasks.push(...dateEntry.tasks);
      });

      const stats = {
        total: allTasks.length,
        byUrgency: {
          'faible': allTasks.filter(t => t.urgency === 'faible').length,
          'moyenne': allTasks.filter(t => t.urgency === 'moyenne').length,
          'élevée': allTasks.filter(t => t.urgency === 'élevée').length
        },
        byProject: {},
        datesWithTasks: allDateEntries.length,
        oldestTask: null,
        newestTask: null
      };

      // Statistiques par projet
      allTasks.forEach(task => {
        const projectId = task.projectId || 'sans-projet';
        stats.byProject[projectId] = (stats.byProject[projectId] || 0) + 1;
      });

      // Tâches les plus anciennes et récentes
      if (allTasks.length > 0) {
        stats.oldestTask = allTasks.reduce((oldest, task) =>
          new Date(task.createdAt) < new Date(oldest.createdAt) ? task : oldest
        );
        stats.newestTask = allTasks.reduce((newest, task) =>
          new Date(task.createdAt) > new Date(newest.createdAt) ? task : newest
        );
      }

      return stats;

    } catch (error) {
      console.error('❌ Erreur lors du calcul des statistiques:', error);
      return null;
    }
  }
}
    