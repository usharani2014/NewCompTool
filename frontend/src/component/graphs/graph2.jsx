import React from 'react';
import { Chart } from 'react-google-charts';

const BarGraph = ({ graphData }) => {
  const data = [['Category', 'Current Score', 'Target Score']];
  graphData.forEach((item) => {
    data.push([item.type, item.totalWeightedScore, item.totalTargetScore]);
  });

  return (
    <Chart
      width={'500px'}
      height={'300px'}
      chartType="BarChart"
      data={data}
      options={{
        title: 'Current Score vs Target Score',
        chartArea: { width: '50%' },
        hAxis: {
          title: 'Score',
          minValue: 0,
        },
        vAxis: {
          title: 'Category',
        },
        colors: ['#378CE7', '#E8751A'], // Custom colors for bars

      }}
    />
  );
};

export default BarGraph;
