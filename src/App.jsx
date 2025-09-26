import React, { useState, useEffect } from 'react';
import { BarChart3, Settings, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

// Import des services IndexedDB
import { initDatabase, getDatabaseStats } from './services/database';
import { TaskService } from './services/taskService';
import { ProjectService } from './services/projectService';

// Import des composants
import DateAccordion from './components/DateAccordion';
import Statistics from './components/Statistics';
import ProjectManager from './components/ProjectManager';

const App = () => {
  // États de l'application
  const [tasks, setTasks] = useState({});
  const [projects, setProjects] = useState([]);
  const [openDates, setOpenDates] = useState({});
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour la navigation mensuelle
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoadingMonth, setIsLoadingMonth] = useState(false);

  // Initialisation et chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 Initialisation de l\'application...');

        await initDatabase();
        const projectsData = await ProjectService.getProjects();
        setProjects(projectsData);

        await loadMonthTasks(currentMonth);

        console.log('📊 Données chargées:', {
          projets: projectsData.length,
          mois: currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        });

        const today = new Date().toISOString().split('T')[0];
        setOpenDates({ [today]: true });

        const stats = await getDatabaseStats();
        console.log('📈 Statistiques DB:', stats);

      } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        setError('Impossible de charger les données.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Charger les tâches d'un mois spécifique
  const loadMonthTasks = async (monthDate) => {
    try {
      setIsLoadingMonth(true);

      const allTasks = await TaskService.getTasks();
      const monthTasks = {};
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();

      Object.entries(allTasks).forEach(([date, dateTasks]) => {
        const taskDate = new Date(date);
        if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
          monthTasks[date] = dateTasks;
        }
      });

      setTasks(monthTasks);

      const today = new Date().toISOString().split('T')[0];
      const isCurrentMonth = year === new Date().getFullYear() && month === new Date().getMonth();

      if (isCurrentMonth) {
        setOpenDates({ [today]: true });
      } else {
        setOpenDates({});
      }

    } catch (error) {
      console.error('❌ Erreur lors du chargement du mois:', error);
    } finally {
      setIsLoadingMonth(false);
    }
  };

  // Navigation mensuelle
  const goToPreviousMonth = async () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
    await loadMonthTasks(prevMonth);
  };

  const goToNextMonth = async () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
    await loadMonthTasks(nextMonth);
  };

  const goToCurrentMonth = async () => {
    const now = new Date();
    setCurrentMonth(now);
    await loadMonthTasks(now);
  };

  // Utilitaires d'affichage
  const formatCurrentMonth = () => {
    return currentMonth.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const isCurrentMonthDisplayed = () => {
    const now = new Date();
    return currentMonth.getFullYear() === now.getFullYear() &&
           currentMonth.getMonth() === now.getMonth();
  };

  const toggleDate = (date) => {
    setOpenDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // Gestion des tâches
  const addTask = async (date, taskData) => {
    try {
      const newTask = await TaskService.addTask(date, taskData);
      setTasks(prev => ({
        ...prev,
        [date]: [...(prev[date] || []), newTask]
      }));
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout de la tâche');
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      await TaskService.updateTask(updatedTask);
      setTasks(prev => {
        const newTasks = { ...prev };
        Object.keys(newTasks).forEach(date => {
          newTasks[date] = newTasks[date].map(task =>
            task.id === updatedTask.id ? updatedTask : task
          );
        });
        return newTasks;
      });
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la tâche');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await TaskService.deleteTask(taskId);
      setTasks(prev => {
        const newTasks = { ...prev };
        Object.keys(newTasks).forEach(date => {
          newTasks[date] = newTasks[date].filter(task => task.id !== taskId);
          if (newTasks[date].length === 0) {
            delete newTasks[date];
          }
        });
        return newTasks;
      });
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la tâche');
    }
  };

  const changeTaskDate = async (taskId, oldDate, newDate, updatedTask) => {
    try {
      await TaskService.changeTaskDate(taskId, oldDate, newDate, updatedTask);

      const newTaskDate = new Date(newDate);
      const isInCurrentMonth = newTaskDate.getFullYear() === currentMonth.getFullYear() &&
                               newTaskDate.getMonth() === currentMonth.getMonth();

      setTasks(prev => {
        const newTasks = { ...prev };

        if (newTasks[oldDate]) {
          newTasks[oldDate] = newTasks[oldDate].filter(task => task.id !== taskId);
          if (newTasks[oldDate].length === 0) {
            delete newTasks[oldDate];
          }
        }

        if (isInCurrentMonth) {
          if (!newTasks[newDate]) {
            newTasks[newDate] = [];
          }
          newTasks[newDate].push(updatedTask);
        }

        return newTasks;
      });

      if (isInCurrentMonth && oldDate !== newDate) {
        setOpenDates(prev => ({ ...prev, [newDate]: true }));
      }

      if (!isInCurrentMonth) {
        const monthName = newTaskDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        alert(`Tâche déplacée vers ${monthName}. Naviguez vers ce mois pour la voir.`);
      }

    } catch (error) {
      console.error('❌ Erreur lors du changement de date:', error);
      alert('Erreur lors du changement de date');
    }
  };

  // Gestion des projets
  const addProject = async (projectData) => {
    try {
      const newProject = await ProjectService.addProject(projectData);
      setProjects(prev => [...prev, newProject]);
    } catch (error) {
      console.error('❌ Erreur lors de la création du projet:', error);
      alert(error.message || 'Erreur lors de la création du projet');
    }
  };

  const updateProject = async (updatedProject) => {
    try {
      await ProjectService.updateProject(updatedProject);
      setProjects(prev =>
        prev.map(project =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du projet:', error);
      alert(error.message || 'Erreur lors de la mise à jour du projet');
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const result = await ProjectService.deleteProject(projectId);
      setProjects(prev => prev.filter(project => project.id !== projectId));
      await loadMonthTasks(currentMonth);
      console.log(`🎯 ${result.tasksAffected} tâches mises à jour après suppression du projet`);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du projet:', error);
      alert(error.message || 'Erreur lors de la suppression du projet');
    }
  };

  // Obtenir les dates du mois (seulement lundi à vendredi)
  const getMonthDates = () => {
    const dates = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    console.log('🔍 DEBUG - Analyse du mois:', currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
    console.log('📅 Année:', year, 'Mois:', month, 'Jours dans le mois:', daysInMonth);

    // Générer SEULEMENT les jours ouvrables du mois (lundi à vendredi)
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });

      const mm = String(month + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      // const dateStr = date.toISOString().split('T')[0];
      const dateStr = `${year}-${mm}-${dd}`

      console.log(`Jour ${day}: ${dateStr} = ${dayName} (getDay=${dayOfWeek})`);

      // STRICT : Seulement lundi (1), mardi (2), mercredi (3), jeudi (4), vendredi (5)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        console.log(`✅ AJOUTÉ: ${dateStr} (${dayName})`);
        dates.push(dateStr);
      } else {
        console.log(`❌ EXCLU: ${dateStr} (${dayName}) - Weekend`);
      }
    }

    console.log('📋 Dates de base (lun-ven):', dates.length);

    // Vérifier s'il y a des tâches de weekend à ajouter
    const existingWeekendDates = [];
    Object.keys(tasks).forEach(dateStr => {
      const taskDate = new Date(dateStr);
      const taskDayOfWeek = taskDate.getDay();
      const taskDayName = taskDate.toLocaleDateString('fr-FR', { weekday: 'long' });

      // Si c'est du mois courant ET c'est un weekend ET il n'est pas déjà dans la liste
      if (taskDate.getFullYear() === year &&
          taskDate.getMonth() === month &&
          (taskDayOfWeek === 0 || taskDayOfWeek === 6) &&
          !dates.includes(dateStr)) {
        console.log(`➕ Weekend avec tâches: ${dateStr} (${taskDayName})`);
        existingWeekendDates.push(dateStr);
      }
    });

    const allDates = [...dates, ...existingWeekendDates].sort();

    console.log('📊 RÉSULTAT FINAL:');
    console.log('- Jours ouvrables:', dates.length);
    console.log('- Weekends avec tâches:', existingWeekendDates.length);
    console.log('- Total affiché:', allDates.length);

    allDates.forEach(dateStr => {
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      const dayOfWeek = date.getDay();
      console.log(`🗓️ ${dateStr} = ${dayName} (getDay=${dayOfWeek})`);
    });

    console.log('-----------------------------------');
    console.log('DATES FINALES:', allDates);
    return allDates;
  };

  // Interface de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement des données...</p>
          <p className="text-sm text-gray-500">Initialisation d'IndexedDB</p>
        </div>
      </div>
    );
  }

  // Interface d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur de Chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <div className="max-w-7xl mx-auto">
        {/* En-tête compact */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📋 Tâches</h1>
            <p className="text-xs text-gray-500">IndexedDB</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setShowStatistics(true)}
              className="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition-colors"
              title="Statistiques"
            >
              <BarChart3 size={16} />
            </button>
            <button
              onClick={() => setShowProjectManager(true)}
              className="bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition-colors"
              title="Projets"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Navigation mensuelle compacte */}
        <div className="bg-white rounded-md shadow-sm p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={goToPreviousMonth}
                disabled={isLoadingMonth}
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                title="Mois précédent"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-800 capitalize">
                  {formatCurrentMonth()}
                </h2>
                <p className="text-xs text-gray-500">
                  {Object.keys(tasks).length} jour(s) • Lun-Ven seulement
                </p>
              </div>

              <button
                onClick={goToNextMonth}
                disabled={isLoadingMonth}
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                title="Mois suivant"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {!isCurrentMonthDisplayed() && (
                <button
                  onClick={goToCurrentMonth}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                  title="Mois actuel"
                >
                  <CalendarIcon size={14} />
                </button>
              )}

              {isLoadingMonth && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              )}
            </div>
          </div>
        </div>

        {/* Grille de dates compacte */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {getMonthDates().map(date => (
            <DateAccordion
              key={date}
              date={date}
              tasks={tasks[date] || []}
              isOpen={openDates[date] || false}
              onToggle={() => toggleDate(date)}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onChangeTaskDate={changeTaskDate}
              projects={projects}
            />
          ))}

          {getMonthDates().length === 0 && (
            <div className="col-span-full text-center py-8 bg-white rounded-md shadow-sm">
              <div className="text-4xl mb-2">📝</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                Aucune tâche - {formatCurrentMonth()}
              </h3>
              <p className="text-sm text-gray-500">
                Créez votre première tâche !
              </p>
            </div>
          )}
        </div>

        {/* Modaux inchangés */}
        <Statistics
          tasks={tasks}
          projects={projects}
          isOpen={showStatistics}
          onClose={() => setShowStatistics(false)}
        />

        <ProjectManager
          projects={projects}
          onAddProject={addProject}
          onUpdateProject={updateProject}
          onDeleteProject={deleteProject}
          isOpen={showProjectManager}
          onClose={() => setShowProjectManager(false)}
        />
      </div>
    </div>
  );
};

export default App;