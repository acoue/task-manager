import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import Task from './Task';
import TaskForm from './TaskForm';

const DateAccordion = ({
  date,
  tasks,
  isOpen,
  onToggle,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onChangeTaskDate,
  projects
}) => {
  const [showTaskForm, setShowTaskForm] = useState(false);

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format compact pour la grille
    const dayNumber = dateObj.getDate();
    const dayOfWeek = dateObj.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
    const dayName = dateObj.toLocaleDateString('fr-FR', { weekday: 'short' });

    // Vérifier si c'est un weekend (samedi = 6, dimanche = 0)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (dateStr === today.toISOString().split('T')[0]) {
      return { main: dayNumber, sub: "Aujourd'hui", isToday: true, isWeekend };
    } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
      return { main: dayNumber, sub: "Demain", isTomorrow: true, isWeekend };
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return { main: dayNumber, sub: "Hier", isYesterday: true, isWeekend };
    }

    return { main: dayNumber, sub: dayName, isRegular: true, isWeekend };
  };

  const handleAddTask = (taskData) => {
    onAddTask(date, taskData);
    setShowTaskForm(false);
  };

  const getDateStatus = () => {
    const today = new Date().toISOString().split('T')[0];
    if (date < today) return 'past';
    if (date === today) return 'today';
    return 'future';
  };

  const dateStatus = getDateStatus();
  const dateInfo = formatDate(date);
  const urgentTasksCount = tasks.filter(task => task.urgency === 'élevée').length;

  // Couleurs selon le statut
  const getStatusColors = () => {
    // Couleurs spéciales pour les weekends
    if (dateInfo.isWeekend) {
      return 'bg-orange-50 border-orange-300 text-orange-800';
    }

    if (dateInfo.isToday) return 'bg-blue-50 border-blue-300 text-blue-800';
    if (dateInfo.isTomorrow) return 'bg-green-50 border-green-300 text-green-800';
    if (dateInfo.isYesterday) return 'bg-gray-100 border-gray-300 text-gray-600';
    if (dateStatus === 'past') return 'bg-gray-50 border-gray-200 text-gray-500';
    return 'bg-white border-gray-200 text-gray-800';
  };

  return (
    <div className={`border rounded-md overflow-hidden ${getStatusColors()}`}>
      <button
        onClick={onToggle}
        className="w-full p-3 hover:bg-gray-50 hover:bg-opacity-50 text-left transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="text-lg font-bold">{dateInfo.main}</div>
              <div className="text-xs font-medium">
                {dateInfo.sub}
                {dateInfo.isWeekend && (
                  <span className="block text-xs text-orange-600 font-normal">Weekend</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{tasks.length}</span>
                <span className="text-xs text-gray-500">
                  {tasks.length === 0 ? '' : tasks.length === 1 ? 'tâche' : 'tâches'}
                </span>
              </div>
              {urgentTasksCount > 0 && (
                <span className="text-xs text-red-600 font-medium">
                  {urgentTasksCount} urgent{urgentTasksCount > 1 ? 'es' : 'e'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {urgentTasksCount > 0 && (
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            )}
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="border-t bg-white">
          <div className="p-3">
            <div className="mb-3">
              <button
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center gap-1 transition-colors text-sm"
                title="Nouvelle tâche"
              >
                <Plus size={14} /> Tâche
              </button>
            </div>

            {showTaskForm && (
              <div className="mb-3">
                <TaskForm
                  onAdd={handleAddTask}
                  projects={projects}
                  selectedDate={date}
                  onCancel={() => setShowTaskForm(false)}
                />
              </div>
            )}

            <div className="space-y-2">
              {tasks
                .sort((a, b) => {
                  const urgencyOrder = { 'élevée': 0, 'moyenne': 1, 'faible': 2 };
                  const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
                  if (urgencyDiff !== 0) return urgencyDiff;
                  return a.label.localeCompare(b.label);
                })
                .map(task => (
                  <Task
                    key={task.id}
                    task={task}
                    currentDate={date}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                    onChangeDate={onChangeTaskDate}
                    projects={projects}
                  />
                ))
              }
              {tasks.length === 0 && !showTaskForm && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-2">Aucune tâche</p>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="text-blue-500 hover:text-blue-700 text-xs underline"
                  >
                    Ajouter une tâche
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateAccordion;