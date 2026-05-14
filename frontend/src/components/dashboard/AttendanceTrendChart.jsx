import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AttendanceTrendChart = ({ data }) => {
  return (
    <div className="analytics-chart-panel">
      <div className="analytics-chart-header">
        <div>
          <h3>Attendance Trend</h3>
          <p>Student attendance across workshops</p>
        </div>
      </div>
      <div className="analytics-chart-container" style={{ height: 300, width: '100%', marginTop: '20px' }}>
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00D2FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10, 10, 15, 0.9)', borderColor: 'rgba(0, 210, 255, 0.3)', color: '#fff', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                itemStyle={{ color: '#00D2FF' }}
              />
              <Area type="monotone" dataKey="attendance" stroke="#00D2FF" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="analytics-empty-chart">No attendance data available</div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTrendChart;
