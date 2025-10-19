import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Calendar, BarChart3, Settings, Trash2, Edit2, AlertCircle } from 'lucide-react';

const ErrorDisplay = ({ error }) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
      <h2 className="text-red-800 font-bold text-xl mb-2">Erreur</h2>
      <p className="text-red-600">{error}</p>
    </div>
  </div>
);

export default ErrorDisplay;