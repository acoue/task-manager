import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Calendar, BarChart3, Settings, Trash2, Edit2, AlertCircle } from 'lucide-react';
import StatCard from './StatCard';
import StatItem from './StatItem';
const Statistics = ({ tasks, projects }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

    const getTasksByDay = () => {
        const filtered = tasks.filter(task => task.date.startsWith(selectedMonth));
        const grouped = {};

        filtered.forEach(task => {
            if (!grouped[task.date]) grouped[task.date] = 0;
            grouped[task.date]++;
        });

        return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
    };

    const getTasksByProject = () => {
        const filtered = tasks.filter(task => task.date.startsWith(selectedMonth));
        const grouped = {};

        filtered.forEach(task => {
            if (!grouped[task.projectId]) grouped[task.projectId] = 0;
            grouped[task.projectId]++;
        });

        return Object.entries(grouped).map(([projectId, count]) => {
            const project = projects.find(p => p.id === projectId);
            return {
                name: project ? project.name : 'Sans projet',
                color: project ? project.color : '#cccccc',
                count
            };
        });
    };

    const tasksByDay = getTasksByDay();
    const tasksByProject = getTasksByProject();
    const totalTasks = tasks.filter(task => task.date.startsWith(selectedMonth)).length;

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2">Sélectionner un mois</label>
                <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <StatCard title="Total" value={`${totalTasks} tâches`} />

            <div>
                <h3 className="font-semibold text-lg mb-3">Tâches par jour</h3>
                {tasksByDay.length === 0 ? (
                    <p className="text-gray-500">Aucune tâche ce mois-ci</p>
                ) : (
                    <div className="space-y-2">
                        {tasksByDay.map(([date, count]) => (
                            <StatItem
                                key={date}
                                label={new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                count={count}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h3 className="font-semibold text-lg mb-3">Tâches par projet</h3>
                {tasksByProject.length === 0 ? (
                    <p className="text-gray-500">Aucune tâche ce mois-ci</p>
                ) : (
                    <div className="space-y-2">
                        {tasksByProject.map(project => (
                            <StatItem
                                key={project.name}
                                label={project.name}
                                count={project.count}
                                color={project.color}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Statistics;