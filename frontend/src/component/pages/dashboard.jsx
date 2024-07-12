 
import React from 'react';
import { useSelector } from 'react-redux';
import { selectShowSidebar } from '../../features/sidebarSlice';
import "../../css/dashboard.css"
const Dashboard = () => {
  const showSidebar = useSelector(selectShowSidebar);
 
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {showSidebar &&
        <div className='extra-div'>
        </div>
      }
      <div style={{ flex: 1 }}>
        <iframe
          title="Governance and Compliance dashboard"
          width="100%"
          height="100%"
          src="https://app.powerbi.com/reportEmbed?reportId=f43657f1-e0a8-48ff-bd22-600616659a73&autoAuth=true&ctid=05b5fe2e-db2c-48e5-bfd8-778b75cb0f8e"
          allowFullScreen
          style={{ border: 'none' }}
        ></iframe>
      </div>
    </div>
  );
}
 
export default Dashboard;