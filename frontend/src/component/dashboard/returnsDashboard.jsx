import React from 'react';
import { useSelector } from 'react-redux';
import { selectShowSidebar } from '../../features/sidebarSlice';
import "../../css/dashboard.css"
const ReturnsDashboard = () => {
  const showSidebar = useSelector(selectShowSidebar);
 
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
    {showSidebar &&
      <div className='extra-div'>
      </div>
    }
    <div style={{ flex: 1 }}>
    <iframe title="Compliance Culture"
     width="100%" 
     height="100%"
     src="https://app.powerbi.com/reportEmbed?reportId=44a5a9d6-e5e3-4ab3-a3b3-70ee42d18c90&autoAuth=true&ctid=05b5fe2e-db2c-48e5-bfd8-778b75cb0f8e" 
     frameborder="0" 
    allowFullScreen="true">
    </iframe>
    </div>
    </div>
  );
};

export default ReturnsDashboard;
