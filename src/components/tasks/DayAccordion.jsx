import React, { useState,  } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import TaskCard from './TaskCard';

const DayAccordion = ({ date, tasks, projects, onUpdateTask, onDeleteTask }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-2 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-colors"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="font-semibold">
            {new Date(date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className="text-sm text-gray-500">({tasks.length} tâche{tasks.length > 1 ? 's' : ''})</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="p-4 bg-white">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune tâche pour cette date</p>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projects={projects}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default DayAccordion;
