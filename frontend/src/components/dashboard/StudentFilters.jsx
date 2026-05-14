import React from 'react';

const StudentFilters = ({ activeFilter, setActiveFilter }) => {
  const filters = ['All', 'Active', 'In Workshop', 'Completed', 'Inactive'];

  return (
    <div className="ws-panel-header">
      <h2 className="ws-panel-title">All Students</h2>
      <div className="ws-filter-pills">
        {filters.map(filter => (
          <button 
            key={filter} 
            className={`ws-filter-pill ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentFilters;
