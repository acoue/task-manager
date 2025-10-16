import React, { useState } from 'react';

function IntervenantForm({ onAdd }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (nom && email && !loading) {
      setLoading(true);
      try {
        await onAdd(nom, email);
        setNom('');
        setEmail('');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nom de l'intervenant"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="px-3 py-2 border rounded-lg"
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 border rounded-lg"
          disabled={loading}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Ajout en cours...' : 'Ajouter l\'intervenant'}
      </button>
    </div>
  );
}

export default IntervenantForm;