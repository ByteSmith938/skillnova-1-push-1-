import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentEngagementChart = ({ data }) => {
  const COLORS = ['#10b981', '#00D2FF', '#7000FF', '#FF00AA'];

  return (
    <div className="analytics-chart-panel">
      <div className="analytics-chart-header">
        <div>
          <h3>Student Engagement</h3>
          <p>Active vs Inactive vs Completed</p>
        </div>
      </div>
      <div className="analytics-chart-container" style={{ height: 300, width: '100%', marginTop: '20px' }}>
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10, 10, 15, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="analytics-empty-chart">No engagement data available</div>
        )}
      </div>
    </div>
  );
};

export default StudentEngagementChart;
