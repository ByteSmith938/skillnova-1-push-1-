import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', attendance: 40 },
  { name: 'Tue', attendance: 85 },
  { name: 'Wed', attendance: 55 },
  { name: 'Thu', attendance: 110 },
  { name: 'Fri', attendance: 90 },
  { name: 'Sat', attendance: 140 },
  { name: 'Sun', attendance: 180 },
];

const AttendanceChart = () => {
  return (
    <div className="analytics-card">
      <h3 className="analytics-title">Attendance Trend</h3>
      <div className="chart-container" style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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
      </div>
    </div>
  );
};

export default AttendanceChart;
