import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WorkshopPerformanceChart = ({ data }) => {
  return (
    <div className="analytics-chart-panel">
      <div className="analytics-chart-header">
        <div>
          <h3>Workshop Performance</h3>
          <p>Registrations vs Attendance vs Completions</p>
        </div>
      </div>
      <div className="analytics-chart-container" style={{ height: 300, width: '100%', marginTop: '20px' }}>
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10, 10, 15, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="registrations" name="Registrations" fill="#7000FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attendance" name="Attendance" fill="#00D2FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completions" name="Completions" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="analytics-empty-chart">No performance data available</div>
        )}
      </div>
    </div>
  );
};

export default WorkshopPerformanceChart;
