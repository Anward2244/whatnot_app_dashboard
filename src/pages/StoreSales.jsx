import React, { useEffect, useRef, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import Chart from 'chart.js/auto';

const StoreSales = () => {
  const { filteredSales, isLoading } = useOutletContext();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const salesByStore = useMemo(() => filteredSales.reduce((acc, item) => {
    const store = item.promoter?.storeName || item.storeName || item.store?.name || item.store || 'Unknown';
    const sold = Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
    acc[store] = (acc[store] || 0) + sold;
    return acc;
  }, {}), [filteredSales]);

  const chartData = useMemo(() => {
    const labels = Object.keys(salesByStore);
    const backgroundColors = labels.map(label => {
      const lowerLabel = label.toLowerCase();
      if (lowerLabel.includes('boat')) return 'rgba(239, 68, 68, 0.6)';
      if (lowerLabel.includes('realme')) return 'rgba(234, 179, 8, 0.6)';
      return 'rgba(156, 163, 175, 0.6)';
    });

    const borderColors = labels.map(label => {
      const lowerLabel = label.toLowerCase();
      if (lowerLabel.includes('boat')) return 'rgba(239, 68, 68, 0.8)';
      if (lowerLabel.includes('realme')) return 'rgba(234, 179, 8, 0.8)';
      return 'rgba(156, 163, 175, 0.8)';
    });

    const hoverBackgroundColors = labels.map(label => {
      const lowerLabel = label.toLowerCase();
      if (lowerLabel.includes('boat')) return 'rgba(239, 68, 68, 1)';
      if (lowerLabel.includes('realme')) return 'rgba(234, 179, 8, 1)';
      return 'rgba(156, 163, 175, 1)';
    });

    return {
      labels,
      datasets: [{
        label: 'Total Units Sold',
        data: Object.values(salesByStore),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        hoverBackgroundColor: hoverBackgroundColors,
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
      }],
    };
  }, [salesByStore]);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    if (chartRef.current && !isLoading) {
      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: chartData,
        options: { 
          indexAxis: 'y', 
          responsive: true, 
          maintainAspectRatio: false, 
          plugins: { 
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1f2937',
              titleColor: '#f3f4f6',
              bodyColor: '#d1d5db',
              borderColor: '#374151',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              displayColors: false,
            }
          },
          scales: {
            x: { ticks: { color: '#9ca3af', padding: 8 }, grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, border: { display: false } },
            y: { ticks: { color: '#9ca3af', padding: 8 }, grid: { display: false, drawBorder: false }, border: { display: false } }
          },
          animation: {
            duration: 800,
            easing: 'easeOutQuart'
          }
        },
      });
    }
    return () => chartInstance.current?.destroy();
  }, [chartData, isLoading]);

  if (isLoading) return <div className="text-gray-400 text-center py-12 font-bold">Loading chart data...</div>;

  return (
    <div className="rounded-2xl bg-gray-800 shadow-[8px_8px_16px_#111827,-8px_-8px_16px_#374151] border-none p-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Products sold by each store</h2>
      <div className="relative flex-1 w-full min-h-100">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default StoreSales;