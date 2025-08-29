import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useDarkMode from '../../hooks/useDarkMode';

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EnrollmentOverviewChart = () => {
    const [isDark] = useDarkMode();
    
    // Data extracted from the HTML prototype script
    const chartData = {
        labels: ["Teoria Musical", "Bateria", "Canto Coral", "Contrabaixo", "Escaleta", "Flauta", "Saxofone", "Teclado", "Violão I", "Violão II", "Violino"],
        datasets: [{
            label: 'Total de Inscrições',
            data: [45, 30, 25, 22, 35, 28, 18, 55, 80, 40, 20],
            backgroundColor: 'rgba(183, 28, 28, 0.8)',
            borderColor: 'rgba(183, 28, 28, 1)',
            borderWidth: 1,
            borderRadius: 6,
            hoverBackgroundColor: 'rgba(183, 28, 28, 1)',
        }]
    };

    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        // This effect updates chart colors when the theme changes
        const textColor = isDark ? '#B0B3B8' : '#6C757D';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        
        setChartOptions({
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: gridColor },
                },
                y: {
                    ticks: { color: textColor },
                    grid: { display: false },
                },
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    displayColors: false,
                    backgroundColor: isDark ? '#242526' : '#FFFFFF',
                    titleColor: isDark ? '#E4E6EB' : '#212529',
                    bodyColor: isDark ? '#E4E6EB' : '#212529',
                    borderColor: isDark ? '#3a3b3d' : '#E9ECEF',
                    borderWidth: 1,
                },
            },
        });
    }, [isDark]);


    return <Bar data={chartData} options={chartOptions} />;
};

export default EnrollmentOverviewChart;