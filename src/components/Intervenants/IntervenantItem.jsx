import React from 'react';
import { Bell, Trash2, Edit2 } from 'lucide-react';

function IntervenantItem({ intervenant, onDelete }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold">{intervenant.nom}</h3>
          <p className="text-sm text-gray-600">{intervenant.email}</p>
          {intervenant.notifications && intervenant.notifications.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications ({intervenant.notifications.length})
              </h4>
              <div className="mt-2 space-y-1">
                {intervenant.notifications.slice(-3).map(notif => (
                  <div key={notif.id} className="text-xs bg-blue-50 p-2 rounded">
                    <strong>{notif.tache}</strong> - {notif.projet} / {notif.sousProjet}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default IntervenantItem;