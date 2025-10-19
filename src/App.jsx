import { useState } from 'react';
import AppProjet from './components/AppProject'; // Ajustez le chemin selon votre structure
import AppTache from './components/AppTask'; // Si vous avez ce composant aussi
import AppDaily from './components/AppDaily'; // Si vous avez ce composant aussi
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'projets') {
    return <AppProjet onRetour={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'taches') {
    return <AppTache onRetour={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'daily') {
    return <AppDaily onRetour={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Bienvenue sur votre espace de gestion
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch">
          <button
            onClick={() => setCurrentPage('projets')}
            className="w-full sm:w-64 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-xl mb-2">📁</div>
            <div>Gestion des Projets</div>
          </button>

          <button
            onClick={() => setCurrentPage('taches')}
            className="w-full sm:w-64 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-xl mb-2">✓</div>
            <div>Gestion des Tâches</div>
          </button>

          <button
            onClick={() => setCurrentPage('daily')}
            className="w-full sm:w-64 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-xl mb-2">📋</div>
            <div>Gestion de mon daily</div>
          </button>
        </div>
      </div>
    </div>
  );
}