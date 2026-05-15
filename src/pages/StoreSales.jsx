import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

const StoreSales = () => {
  const { filteredSales, isLoading } = useOutletContext();

  const salesByStore = useMemo(() => filteredSales.reduce((acc, item) => {
    const store = item.promoter?.storeName || item.storeName || item.store?.name || item.store || 'Unknown';
    const sold = Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
    acc[store] = (acc[store] || 0) + sold;
    return acc;
  }, {}), [filteredSales]);

  const chartData = useMemo(() => {
    const labels = Object.keys(salesByStore);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

    return {
      series: [{
        name: 'Total Units Sold',
        data: Object.values(salesByStore)
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
          categories: labels,
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
        tooltip: { theme: 'dark' }
      }
    };
  }, [salesByStore]);

  if (isLoading) return <div className="text-gray-400 text-center py-12 font-bold">Loading chart data...</div>;

  return (
    <div className="rounded-2xl bg-gray-800 shadow-[8px_8px_16px_#111827,-8px_-8px_16px_#374151] border-none p-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Products sold by each store</h2>
      <div className="relative flex-1 w-full min-h-100">
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height="100%" />
      </div>
    </div>
  );
};

export default StoreSales;