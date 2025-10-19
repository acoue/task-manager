import React, { useState, useEffect } from 'react';
import {  AlertCircle } from 'lucide-react';

const ConfigWarning = ({ onClose }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <h3 className="font-semibold text-yellow-800 mb-1">Configuration Firebase requise</h3>
      <p className="text-sm text-yellow-700 mb-2">
        L'application fonctionne en mode démo (stockage local). Pour utiliser Firebase, remplacez FIREBASE_CONFIG avec vos identifiants.
      </p>
      <button
        onClick={onClose}
        className="text-sm text-yellow-800 underline hover:no-underline"
      >
        Masquer ce message
      </button>
    </div>
  </div>
);
export default ConfigWarning;
