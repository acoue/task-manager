import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Calendar, BarChart3, Settings, Trash2, Edit2, AlertCircle } from 'lucide-react';


const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement...</p>
    </div>
  </div>
);
export default LoadingSpinner;