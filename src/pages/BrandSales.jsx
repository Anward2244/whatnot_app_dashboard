import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

const BrandSales = () => {
  const { filteredSales, isLoading } = useOutletContext();

  const salesByBrand = useMemo(() => filteredSales.reduce((acc, item) => {
    const brand = item.brandName || item.brand?.name || item.brand || 'Unknown';
    const sold = Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
    acc[brand] = (acc[brand] || 0) + sold;
    return acc;
  }, {}), [filteredSales]);
  
  const chartData = useMemo(() => {
    const labels = Object.keys(salesByBrand);
    const data = Object.values(salesByBrand);

    const colors = labels.map(label => {
      const lowerLabel = label.toLowerCase();
      if (lowerLabel.includes('boat')) return 'rgba(239, 68, 68, 0.8)';
      if (lowerLabel.includes('realme')) return 'rgba(234, 179, 8, 0.8)';
      return 'rgba(156, 163, 175, 0.8)';
    });

    return {
      series: [{
        name: 'Total Products Sold',
        data
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
            distributed: true,
            borderRadius: 6,
            columnWidth: '60%'
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
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } }
        },
        tooltip: { theme: 'dark' }
      }
    };
  }, [salesByBrand]);

  if (isLoading) return <div className="text-gray-400 text-center py-12 font-bold">Loading chart data...</div>;

  return (
    <div className="rounded-2xl bg-gray-800 shadow-[8px_8px_16px_#111827,-8px_-8px_16px_#374151] border-none p-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Brands and no of Products sold</h2>
      <div className="relative flex-1 w-full min-h-100">
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height="100%" />
      </div>
    </div>
  );
};

export default BrandSales;