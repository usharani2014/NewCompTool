import React from 'react';
import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    RadialLinearScale
} from 'chart.js';

import { Radar } from 'react-chartjs-2';

ChartJS.register(
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    RadialLinearScale
)
const RadarGraph = ({ graphData }) => {
    const [currentScores, setCurrentScores] = useState([]);
    const [targetScores, setTargetScores] = useState([]);
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        const updatedLabels = [];
        const updatedCurrentScores = [];
        const updatedTargetScores = [];

        graphData.forEach((item) => {
            updatedLabels.push(item.type);
            updatedCurrentScores.push(item.totalWeightedScore);
            updatedTargetScores.push(item.totalTargetScore);
        });

        setLabels(updatedLabels);
        setCurrentScores(updatedCurrentScores);
        setTargetScores(updatedTargetScores);

    }, [graphData]);

  const data = {
    labels: labels,
    datasets: [
        {
            label: 'Current Scores',
            data: currentScores,
            borderColor: "blue"
        },
        {
            label: 'Target Scores',
            data: targetScores,
            borderColor: "green"
        }
    ]

};

const options = {
    // animation: false,
    plugins: {
        legend: {
            display: true,
            position: 'top',
        },
    },
    scales: {
        r: {
            angleLines: {
                display: true,
            },
            suggestedMin: 0,
            suggestedMax: 100,
        },
    },
};

  return <Radar
  options={options}
  data={data}
/>;
};

export default RadarGraph;
