import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Calendar, BarChart3, Settings, Trash2, Edit2, AlertCircle } from 'lucide-react';
import DayAccordion from './DayAccordion';

const TasksView = ({
  currentMonth,
  tasks,
  projects,
  onChangeMonth,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const getTasksByDate = () => {
    const filtered = tasks.filter(task => task.date.startsWith(currentMonth));
    const grouped = {};

    filtered.forEach(task => {
      if (!grouped[task.date]) grouped[task.date] = [];
      grouped[task.date].push(task);
    });

    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const tasksByDate = getTasksByDate();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <button
            onClick={() => onChangeMonth(-1)}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Mois précédent
          </button>
          <h2 className="text-xl font-semibold">
            {new Date(currentMonth + '-01').toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric'
            })}
          </h2>
          <button
            onClick={() => onChangeMonth(1)}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Mois suivant →
          </button>
        </div>

        <button
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter une tâche
        </button>
      </div>

      <div>
        {tasksByDate.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            Aucune tâche pour ce mois
          </div>
        ) : (
          tasksByDate.map(([date, dateTasks]) => (
            <DayAccordion
              key={date}
              date={date}
              tasks={dateTasks}
              projects={projects}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default TasksView;