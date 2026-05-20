import React, { useMemo, useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

const StoreSales = () => {
  const { filteredSales, isLoading } = useOutletContext();
  const location = useLocation();
  const [highlightedStore, setHighlightedStore] = useState(null);

  useEffect(() => {
    const storeFromState = location.state?.selectedStore;
    if (storeFromState) {
      setHighlightedStore(storeFromState);
      // Clear state after using it to avoid re-triggering on other navigations
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);

  const salesByStore = useMemo(() => filteredSales.reduce((acc, item) => {
    const store = item.promoter?.storeName || item.storeName || item.store?.name || item.store || 'Unknown';
    const sold = Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
    acc[store] = (acc[store] || 0) + sold;
    return acc;
  }, {}), [filteredSales]);

  const chartData = useMemo(() => {
    const labels = Object.keys(salesByStore);
    const sortedSales = Object.entries(salesByStore).sort((a, b) => b[1] - a[1]);
    const sortedLabels = sortedSales.map(item => item[0]);
    const sortedData = sortedSales.map(item => item[1]);

    const colors = sortedLabels.map(label => {
      if (highlightedStore && label.toLowerCase().includes(highlightedStore.toLowerCase())) {
        return 'rgba(249, 115, 22, 1)'; // Highlight color
      }
      return 'rgba(59, 130, 246, 0.8)'; // Default color
    });

    return {
      series: [{
        name: 'Total Units Sold',
        data: sortedData
      }],
      options: {
        chart: {
          type: 'bar',
          toolbar: { show: false },
          background: 'transparent'
        },
        colors,
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true,
            borderRadius: 6,
            barHeight: '60%'
          }
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
          categories: sortedLabels,
          labels: { style: { colors: '#9ca3af' } },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          labels: { style: { colors: '#9ca3af' } },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        grid: {
          borderColor: 'rgba(255, 255, 255, 0.05)',
          xaxis: { lines: { show: true } },
          yaxis: { lines: { show: false } }
        },
        tooltip: { 
          theme: 'dark'
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              yaxis: {
                labels: { maxWidth: 100, style: { fontSize: '10px' } }
              },
              xaxis: {
                labels: { style: { fontSize: '10px' } }
              }
            }
          }
        ]
      }
    };
  }, [salesByStore, highlightedStore]);

  if (isLoading) return <div className="text-gray-400 text-center py-12 font-bold">Loading chart data...</div>;

  return (
    <div className="rounded-2xl bg-gray-800 shadow-[8px_8px_16px_#141a25,-8px_-8px_16px_#2c3a50] border-none p-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Products sold by each store</h2>
      <div className="relative flex-1 w-full min-h-100">
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height="100%" />
      </div>
    </div>
  );
};

export default StoreSales;