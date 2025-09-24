import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus} from 'lucide-react';
import { TaskForm } from './task/TaskForm.jsx';
import { Task } from './task/Task.jsx';

// Composant DateAccordion
const DateAccordion = ({ date, tasks, isOpen, onToggle, onAddTask, onUpdateTask, onDeleteTask, onChangeTaskDate, projects }) => {
  const [showTaskForm, setShowTaskForm] = useState(false);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddTask = (taskData) => {
    onAddTask(date, taskData);
    setShowTaskForm(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center text-left"
      >
        <div>
          <h3 className="font-semibold text-gray-800">{formatDate(date)}</h3>
          <span className="text-sm text-gray-600">{tasks.length} tâche(s)</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="p-4 bg-white">
          <div className="mb-4">
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={16} /> Nouvelle tâche
            </button>
          </div>

          {showTaskForm && (
            <div className="mb-4">
              <TaskForm
                onAdd={handleAddTask}
                projects={projects}
                selectedDate={date}
                onCancel={() => setShowTaskForm(false)}
              />
            </div>
          )}

          <div className="space-y-3">
            {tasks.map(task => (
              <Task
                key={task.id}
                task={task}
                currentDate={date}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                onChangeDate={onChangeTaskDate}
                projects={projects}
              />
            ))}
            {tasks.length === 0 && !showTaskForm && (
              <p className="text-gray-500 italic">Aucune tâche pour cette date</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateAccordion;