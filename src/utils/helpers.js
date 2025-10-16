export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const getStatusColor = (statut) => {
  const colors = {
    'En attente': 'bg-gray-200 text-gray-700',
    'En cours': 'bg-blue-200 text-blue-700',
    'Terminé': 'bg-green-200 text-green-700',
    'Bloqué': 'bg-red-200 text-red-700'
  };
  return colors[statut] || 'bg-gray-200';
};

export const getUrgencyColor = (urgence) => {
  const colors = {
    'Faible': 'bg-green-100 text-green-700',
    'Moyenne': 'bg-yellow-100 text-yellow-700',
    'Haute': 'bg-orange-100 text-orange-700',
    'Critique': 'bg-red-100 text-red-700'
  };
  return colors[urgence] || 'bg-gray-100';
};