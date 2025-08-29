import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Mar', "Novas Matrículas": 20 },
  { name: 'Abr', "Novas Matrículas": 35 },
  { name: 'Mai', "Novas Matrículas": 45 },
  { name: 'Jun', "Novas Matrículas": 30 },
  { name: 'Jul', "Novas Matrículas": 55 },
  { name: 'Ago', "Novas Matrículas": 62 },
];

const EnrollmentOverviewChart = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
          />
          <Legend />
          <Line type="monotone" dataKey="Novas Matrículas" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnrollmentOverviewChart;