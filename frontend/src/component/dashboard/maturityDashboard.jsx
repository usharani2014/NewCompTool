import React from 'react';
import { useSelector } from 'react-redux';
import { selectShowSidebar } from '../../features/sidebarSlice';
import "../../css/dashboard.css"
const PowerBIEmbed = () => {
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
     src="
     https://app.powerbi.com/reportEmbed?reportId=cfbd5f06-a287-46b6-8852-259db7ebb344&autoAuth=true&ctid=05b5fe2e-db2c-48e5-bfd8-778b75cb0f8e"
     frameborder="0" 
    allowFullScreen="true">
    </iframe>
    </div>
    </div>
  );
};

export default PowerBIEmbed;
