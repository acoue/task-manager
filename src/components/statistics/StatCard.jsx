import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Calendar, BarChart3, Settings, Trash2, Edit2, AlertCircle } from 'lucide-react';


const StatCard = ({ title, value, className = "bg-blue-50" }) => (
  <div className={`${className} p-4 rounded-lg`}>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-3xl font-bold text-blue-600">{value}</p>
  </div>
);
export default StatCard;