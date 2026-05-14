import React from 'react';

const WorkshopFilters = ({ activeFilter, setActiveFilter }) => {
  const filters = ['All', 'Live', 'Upcoming', 'Completed'];

  return (
    <div className="ws-panel-header">
      <h2 className="ws-panel-title">All Workshops</h2>
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

export default WorkshopFilters;
