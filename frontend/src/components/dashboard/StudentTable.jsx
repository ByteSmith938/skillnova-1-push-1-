import React from 'react';
import StudentRow from './StudentRow';

const StudentTable = ({ students, workshops, onDelete }) => {
  const getWorkshopTitle = (workshopId) => {
    const ws = workshops.find(w => w._id === workshopId);
    return ws ? ws.title : 'Unknown Workshop';
  };

  return (
    <div className="st-table-wrapper">
      <table className="st-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Name</th>
            <th>Email</th>
            <th>Enrolled Workshop</th>
            <th>Attendance %</th>
            <th>Progress</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <StudentRow 
              key={student._id} 
              student={student} 
              workshopTitle={getWorkshopTitle(student.workshopId)} 
              onDelete={onDelete} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
