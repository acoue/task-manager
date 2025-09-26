import React, { useState } from 'react';
import { X, BarChart3, Calendar, FolderOpen, ChevronDown } from 'lucide-react';

const Statistics = ({ tasks, projects, isOpen, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState('all');

  if (!isOpen) return null;

  // Obtenir la liste des mois disponibles
  const getAvailableMonths = () => {
    const months = new Set();
    Object.keys(tasks).forEach(date => {
      const dateObj = new Date(date);
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = dateObj.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
      months.add({ key: monthKey, label: monthLabel, date: dateObj });
    });

    return Array.from(months).sort((a, b) => b.date - a.date);
  };

  // Filtrer les tâches par mois sélectionné
  const getFilteredTasks = () => {
    if (selectedMonth === 'all') {
      return tasks;
    }

    const [year, month] = selectedMonth.split('-');
    const filteredTasks = {};

    Object.entries(tasks).forEach(([date, dateTasks]) => {
      const dateObj = new Date(date);
      const taskYear = dateObj.getFullYear().toString();
      const taskMonth = String(dateObj.getMonth() + 1).padStart(2, '0');

      if (taskYear === year && taskMonth === month) {
        filteredTasks[date] = dateTasks;
      }
    });

    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();
  const availableMonths = getAvailableMonths();

  // Calculer les statistiques par jour (avec données filtrées)
  const getTasksByDay = () => {
    const tasksByDay = {};
    Object.entries(filteredTasks).forEach(([date, dateTasks]) => {
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
      tasksByDay[dayName] = (tasksByDay[dayName] || 0) + dateTasks.length;
    });
    return tasksByDay;
  };

  // Calculer les statistiques par projet (avec données filtrées)
  const getTasksByProject = () => {
    const tasksByProject = {};

    // Initialiser avec tous les projets
    projects.forEach(project => {
      tasksByProject[project.label] = 0;
    });
    tasksByProject['Sans projet'] = 0;

    Object.values(filteredTasks).forEach(dateTasks => {
      dateTasks.forEach(task => {
        if (task.projectId) {
          const project = projects.find(p => p.id === task.projectId);
          if (project) {
            tasksByProject[project.label]++;
          }
        } else {
          tasksByProject['Sans projet']++;
        }
      });
    });

    return tasksByProject;
  };

  // Calculer les statistiques par semaine pour le mois sélectionné
  const getTasksByWeek = () => {
    if (selectedMonth === 'all') {
      return {};
    }

    const tasksByWeek = {};
    const [year, month] = selectedMonth.split('-');

    Object.entries(filteredTasks).forEach(([date, dateTasks]) => {
      const dateObj = new Date(date);
      const weekNumber = getWeekNumber(dateObj);
      const weekLabel = `Semaine ${weekNumber}`;

      if (!tasksByWeek[weekLabel]) {
        tasksByWeek[weekLabel] = 0;
      }
      tasksByWeek[weekLabel] += dateTasks.length;
    });

    return tasksByWeek;
  };

  // Fonction pour obtenir le numéro de semaine
  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  };

  // Calculer les statistiques par niveau d'urgence (avec données filtrées)
  const getTasksByUrgency = () => {
    const tasksByUrgency = { 'faible': 0, 'moyenne': 0, 'élevée': 0 };

    Object.values(filteredTasks).forEach(dateTasks => {
      dateTasks.forEach(task => {
        tasksByUrgency[task.urgency]++;
      });
    });

    return tasksByUrgency;
  };

  const tasksByDay = getTasksByDay();
  const tasksByProject = getTasksByProject();
  const tasksByWeek = getTasksByWeek();
  const tasksByUrgency = getTasksByUrgency();

  const totalTasks = Object.values(filteredTasks).reduce((sum, dateTasks) => sum + dateTasks.length, 0);
  const totalAllTasks = Object.values(tasks).reduce((sum, dateTasks) => sum + dateTasks.length, 0);

  const getSelectedMonthLabel = () => {
    if (selectedMonth === 'all') {
      return 'Toutes les périodes';
    }
    const monthObj = availableMonths.find(m => m.key === selectedMonth);
    return monthObj ? monthObj.label : 'Mois sélectionné';
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
    <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <Icon className={`h-8 w-8 text-${color}-500`} />
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, maxValue, color, project }) => (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2 flex-1">
        {project && (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: project.color }}
          />
        )}
        <span className="text-gray-700 capitalize text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`${color.bg} rounded-full h-2 w-16 relative`}>
          <div
            className={`${color.bar} rounded-full h-2 transition-all duration-500 ease-out`}
            style={{ width: `${Math.max((value / maxValue) * 100, value > 0 ? 8 : 0)}%` }}
          />
        </div>
        <span className="font-medium text-gray-900 w-6 text-right text-sm">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📊 Statistiques des Tâches</h2>
            <p className="text-sm text-gray-600 mt-1">
              Période : <span className="font-semibold">{getSelectedMonthLabel()}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Sélecteur de mois */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">📅 Toutes les périodes</option>
                {availableMonths.map(month => (
                  <option key={month.key} value={month.key}>
                    📅 {month.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total des tâches"
            value={totalTasks}
            subtitle={selectedMonth !== 'all' ? `Sur ${totalAllTasks} au total` : undefined}
            icon={Calendar}
            color="blue"
          />
          <StatCard
            title="Projets utilisés"
            value={Object.values(tasksByProject).filter(count => count > 0).length - (tasksByProject['Sans projet'] > 0 ? 0 : 1)}
            subtitle={`${projects.length} projets créés`}
            icon={FolderOpen}
            color="green"
          />
          <StatCard
            title="Tâches urgentes"
            value={tasksByUrgency['élevée']}
            subtitle={totalTasks > 0 ? `${Math.round((tasksByUrgency['élevée'] / totalTasks) * 100)}% du total` : '0%'}
            icon={BarChart3}
            color="red"
          />
          <StatCard
            title="Moyenne par jour"
            value={totalTasks > 0 ? Math.round((totalTasks / Math.max(Object.keys(filteredTasks).length, 1)) * 10) / 10 : 0}
            subtitle="tâches par jour actif"
            icon={BarChart3}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Statistiques par jour */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
              <Calendar size={20} />
              Répartition par jour de la semaine
            </h3>
            <div className="space-y-3">
              {Object.entries(tasksByDay)
                .sort(([a], [b]) => {
                  const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
                  return days.indexOf(a.toLowerCase()) - days.indexOf(b.toLowerCase());
                })
                .map(([day, count]) => (
                  <ProgressBar
                    key={day}
                    label={day}
                    value={count}
                    maxValue={Math.max(...Object.values(tasksByDay))}
                    color={{ bg: 'bg-blue-200', bar: 'bg-blue-500' }}
                  />
                ))}
            </div>
          </div>

          {/* Statistiques par projet */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-800">
              <FolderOpen size={20} />
              Répartition par projet
            </h3>
            <div className="space-y-3">
              {Object.entries(tasksByProject)
                .sort(([, a], [, b]) => b - a)
                .map(([projectName, count]) => {
                  const project = projects.find(p => p.label === projectName);
                  return (
                    <ProgressBar
                      key={projectName}
                      label={projectName}
                      value={count}
                      maxValue={Math.max(...Object.values(tasksByProject))}
                      color={{ bg: 'bg-green-200', bar: 'bg-green-500' }}
                      project={project}
                    />
                  );
                })}
            </div>
          </div>

          {/* Statistiques par mois */}
          {selectedMonth === 'all' ? (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-800">
                <BarChart3 size={20} />
                Évolution par mois
              </h3>
              <div className="space-y-3">
                {availableMonths.map(month => {
                  const monthTasks = Object.values(tasks).reduce((sum, dateTasks) => {
                    return sum + dateTasks.filter(task => {
                      // Compter les tâches de ce mois
                      const taskDate = Object.keys(tasks).find(date => tasks[date].includes(task));
                      if (!taskDate) return false;
                      const taskDateObj = new Date(taskDate);
                      const taskMonthKey = `${taskDateObj.getFullYear()}-${String(taskDateObj.getMonth() + 1).padStart(2, '0')}`;
                      return taskMonthKey === month.key;
                    }).length;
                  }, 0);

                  return (
                    <ProgressBar
                      key={month.key}
                      label={month.label}
                      value={monthTasks}
                      maxValue={Math.max(...availableMonths.map(m => {
                        return Object.values(tasks).reduce((sum, dateTasks) => {
                          return sum + dateTasks.filter(task => {
                            const taskDate = Object.keys(tasks).find(date => tasks[date].includes(task));
                            if (!taskDate) return false;
                            const taskDateObj = new Date(taskDate);
                            const taskMonthKey = `${taskDateObj.getFullYear()}-${String(taskDateObj.getMonth() + 1).padStart(2, '0')}`;
                            return taskMonthKey === m.key;
                          }).length;
                        }, 0);
                      }))}
                      color={{ bg: 'bg-purple-200', bar: 'bg-purple-500' }}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            /* Statistiques par semaine pour le mois sélectionné */
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-800">
                <Calendar size={20} />
                Répartition par semaine
              </h3>
              <div className="space-y-3">
                {Object.entries(tasksByWeek)
                  .sort(([a], [b]) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]))
                  .map(([week, count]) => (
                    <ProgressBar
                      key={week}
                      label={week}
                      value={count}
                      maxValue={Math.max(...Object.values(tasksByWeek))}
                      color={{ bg: 'bg-purple-200', bar: 'bg-purple-500' }}
                    />
                  ))}
                {Object.keys(tasksByWeek).length === 0 && (
                  <p className="text-gray-500 text-center py-4">Aucune donnée pour ce mois</p>
                )}
              </div>
            </div>
          )}

          {/* Statistiques par urgence */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-800">
              <BarChart3 size={20} />
              Répartition par urgence
            </h3>
            <div className="space-y-3">
              {Object.entries(tasksByUrgency)
                .sort(([, a], [, b]) => b - a)
                .map(([urgency, count]) => {
                  const urgencyColors = {
                    'faible': { bg: 'bg-green-200', bar: 'bg-green-500' },
                    'moyenne': { bg: 'bg-yellow-200', bar: 'bg-yellow-500' },
                    'élevée': { bg: 'bg-red-200', bar: 'bg-red-500' }
                  };
                  return (
                    <ProgressBar
                      key={urgency}
                      label={`Urgence ${urgency}`}
                      value={count}
                      maxValue={Math.max(...Object.values(tasksByUrgency))}
                      color={urgencyColors[urgency]}
                    />
                  );
                })}
            </div>
          </div>
        </div>

        {/* Message si aucune donnée */}
        {totalTasks === 0 && selectedMonth !== 'all' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">📅 Aucune tâche trouvée pour {getSelectedMonthLabel()}</p>
            <p className="text-yellow-600 text-sm mt-2">Sélectionnez "Toutes les périodes" ou un autre mois pour voir les données.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;