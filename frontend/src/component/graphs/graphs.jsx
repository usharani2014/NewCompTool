import React from 'react';
import { Chart } from 'react-google-charts';
import LoadingOverlay from "../loading/loader";

const BarGraph = ({ graph1Data }) => {
  const data = [
    ['Category', 'Current Score', 'Target Score'],
    ['Compliance Organization Structure', graph1Data.total_Score, graph1Data.total_Target_Score]
  ];

  return (
    <div>
      <Chart
        width={'100%'}
        height={'300px'}
        chartType="BarChart"
        loader={<LoadingOverlay/>}
        data={data}
        options={{
          title: 'Current Score vs Target Score',
          chartArea: { width: '40%', height: '40%' },
          hAxis: {
            title: 'Score',
            minValue: 0,
          },
          vAxis: {
            title: 'Category',
          },
          colors: ['#378CE7', '#E8751A'], // Custom colors for bars
        }}
        legendToggle
      />
    </div>

  );
};

export default BarGraph;
