import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Calendar, BarChart3, Settings, Trash2, Edit2, AlertCircle } from 'lucide-react';

const StatItem = ({ label, count, color }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
    <div className="flex items-center gap-2">
      {color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />}
      <span>{label}</span>
    </div>
    <span className="font-semibold">{count} tâche{count > 1 ? 's' : ''}</span>
  </div>
);
export default StatItem;
