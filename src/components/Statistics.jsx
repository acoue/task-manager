import React from 'react';
import {  X, BarChart3, Calendar, FolderOpen } from 'lucide-react';

// Composant Statistics
const Statistics = ({ tasks, projects, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Calculer les statistiques par jour
  const getTasksByDay = () => {
    const tasksByDay = {};
    Object.entries(tasks).forEach(([date, dateTasks]) => {
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
      tasksByDay[dayName] = dateTasks.length;
    });
    return tasksByDay;
  };

  // Calculer les statistiques par projet
  const getTasksByProject = () => {
    const tasksByProject = {};

    // Initialiser avec tous les projets
    projects.forEach(project => {
      tasksByProject[project.label] = 0;
    });
    tasksByProject['Sans projet'] = 0;

    Object.values(tasks).forEach(dateTasks => {
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

  // Calculer les statistiques par mois
  const getTasksByMonth = () => {
    const tasksByMonth = {};

    Object.entries(tasks).forEach(([date, dateTasks]) => {
      const dateObj = new Date(date);
      const monthKey = dateObj.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });

      if (!tasksByMonth[monthKey]) {
        tasksByMonth[monthKey] = 0;
      }
      tasksByMonth[monthKey] += dateTasks.length;
    });

    return tasksByMonth;
  };

  // Calculer les statistiques par niveau d'urgence
  const getTasksByUrgency = () => {
    const tasksByUrgency = { 'faible': 0, 'moyenne': 0, 'élevée': 0 };

    Object.values(tasks).forEach(dateTasks => {
      dateTasks.forEach(task => {
        tasksByUrgency[task.urgency]++;
      });
    });

    return tasksByUrgency;
  };

  const tasksByDay = getTasksByDay();
  const tasksByProject = getTasksByProject();
  const tasksByMonth = getTasksByMonth();
  const tasksByUrgency = getTasksByUrgency();

  const totalTasks = Object.values(tasks).reduce((sum, dateTasks) => sum + dateTasks.length, 0);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Statistiques</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total des tâches"
            value={totalTasks}
            icon={Calendar}
            color="blue"
          />
          <StatCard
            title="Projets actifs"
            value={projects.length}
            icon={FolderOpen}
            color="green"
          />
          <StatCard
            title="Tâches urgentes"
            value={tasksByUrgency['élevée']}
            icon={BarChart3}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Statistiques par jour */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Tâches par jour
            </h3>
            <div className="space-y-2">
              {Object.entries(tasksByDay).map(([day, count]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{day}</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-200 rounded-full h-2 w-16 relative">
                      <div
                        className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${Math.max((count / Math.max(...Object.values(tasksByDay))) * 100, 5)}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-gray-900 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistiques par projet */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FolderOpen size={20} />
              Tâches par projet
            </h3>
            <div className="space-y-2">
              {Object.entries(tasksByProject).map(([projectName, count]) => {
                const project = projects.find(p => p.label === projectName);
                return (
                  <div key={projectName} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {project && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        ></div>
                      )}
                      <span className="text-gray-700">{projectName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-200 rounded-full h-2 w-16 relative">
                        <div
                          className="bg-green-500 rounded-full h-2 transition-all duration-300"
                          style={{ width: `${Math.max((count / Math.max(...Object.values(tasksByProject))) * 100, 5)}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900 w-6 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistiques par mois */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Tâches par mois
            </h3>
            <div className="space-y-2">
              {Object.entries(tasksByMonth).map(([month, count]) => (
                <div key={month} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{month}</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-200 rounded-full h-2 w-16 relative">
                      <div
                        className="bg-purple-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${Math.max((count / Math.max(...Object.values(tasksByMonth))) * 100, 5)}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-gray-900 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistiques par urgence */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Tâches par urgence
            </h3>
            <div className="space-y-2">
              {Object.entries(tasksByUrgency).map(([urgency, count]) => {
                const urgencyColors = {
                  'faible': { bg: 'bg-green-200', bar: 'bg-green-500' },
                  'moyenne': { bg: 'bg-yellow-200', bar: 'bg-yellow-500' },
                  'élevée': { bg: 'bg-red-200', bar: 'bg-red-500' }
                };
                return (
                  <div key={urgency} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{urgency}</span>
                    <div className="flex items-center gap-2">
                      <div className={`${urgencyColors[urgency].bg} rounded-full h-2 w-16 relative`}>
                        <div
                          className={`${urgencyColors[urgency].bar} rounded-full h-2 transition-all duration-300`}
                          style={{ width: `${Math.max((count / Math.max(...Object.values(tasksByUrgency))) * 100, 5)}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900 w-6 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;