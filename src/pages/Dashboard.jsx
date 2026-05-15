import React, { useMemo, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

const Dashboard = () => {
  // Adding `filteredPromoters` (or `promoters` as fallback) from your context
  const { filteredSales = [], promoters = [], filteredPromoters = promoters, isLoading } = useOutletContext();
  const [selectedMonth, setSelectedMonth]=useState('All');
  const navigate = useNavigate();

  const topCategory = useMemo(() => {
    const counts = {};
    filteredSales.forEach(item => {
      const cat = item.categoryName || item.category?.name || item.category || 'Unknown';
      counts[cat] = (counts[cat] || 0) + Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? `${sorted[0][0]} (${sorted[0][1]} sold)` : 'N/A';
  }, [filteredSales]);

  const topBrand = useMemo(() => {
    const counts = {};
    filteredSales.forEach(item => {
      const brand = item.brandName || item.brand?.name || item.brand || 'Unknown';
      counts[brand] = (counts[brand] || 0) + Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? `${sorted[0][0]} (${sorted[0][1]} sold)` : 'N/A';
  }, [filteredSales]);

  const topStore = useMemo(() => {
    const counts = {};
    filteredSales.forEach(item => {
      const store = item.promoter?.storeName || item.storeName || item.store?.name || item.store || 'Unknown';
      counts[store] = (counts[store] || 0) + Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? `${sorted[0][0]} (${sorted[0][1]} sold)` : 'N/A';
  }, [filteredSales]);

  const topProduct = useMemo(() => {
    const counts = {};
    filteredSales.forEach(item => {
      const product = item.productName || item.product?.name || item.product || 'Unknown';
      counts[product] = (counts[product] || 0) + Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? `${sorted[0][0]} (${sorted[0][1]} sold)` : 'N/A';
  }, [filteredSales]);

  const totalSales = useMemo(() => {
    return filteredSales.reduce((acc, item) => acc + Number(item.quantity ?? item.totalSold ?? item.sold ?? 0), 0);
  }, [filteredSales]);

  const { labels, salesData, promotersData } = useMemo(() => {
    // Helper to get consistent YYYY-MM keys for sorting
    const getMonthKey = (dateStr) => {
      let d = dateStr ? new Date(dateStr) : new Date();
      if (isNaN(d.getTime())) d = new Date(); // fallback for invalid dates
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    };

    // Helper to format keys back to 'Jan 2026' style
    const formatMonthKey = (key) => {
      const [year, month] = key.split('-');
      const d = new Date(year, month - 1);
      return d.toLocaleString('default', { month: 'short', year: 'numeric' });
    };

    const salesByMonth = {};
    filteredSales.forEach(item => {
      const key = getMonthKey(item.date || item.createdAt || item.saleDate || item.timestamp);
      const sold = Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
      salesByMonth[key] = (salesByMonth[key] || 0) + sold;
    });

    const promotersByMonth = {};
    filteredPromoters.forEach(item => {
      const key = getMonthKey(item.logCreatedDate || item.joinDate || item.registeredAt || item.timestamp);
      promotersByMonth[key] = (promotersByMonth[key] || 0) + 1;
    });

    // Extract all unique month-year keys, sort them chronologically
    const sortedKeys = Array.from(new Set([...Object.keys(salesByMonth), ...Object.keys(promotersByMonth)])).sort();
    
    return {
      labels: sortedKeys.map(formatMonthKey),
      salesData: sortedKeys.map(k => salesByMonth[k] || 0),
      promotersData: sortedKeys.map(k => promotersByMonth[k] || 0)
    };
  }, [filteredSales, filteredPromoters]);

  const chartData = useMemo(() => {
    return {
      series: [
        {
          name: 'Total Sales',
          type: 'column',
          data: salesData
        },
        {
          name: 'Promoters Registered',
          type: 'line',
          data: promotersData
        }
      ],
      options: {
        chart: {
          type: 'line', // Mixed charts require base type to be "line"
          toolbar: { show: false },
          background: 'transparent'
        },
        colors: ['rgba(249, 115, 22, 0.8)', '#3b82f6'], // Orange for sales, Blue for promoters
        stroke: {
          width: [0, 4], // 0 width for column, 4 for the line
          curve: 'smooth'
        },
        plotOptions: {
          bar: {
            borderRadius: 6,
            columnWidth: '40%'
          }
        },
        dataLabels: { enabled: false },
        legend: { 
          show: true,
          labels: { colors: '#9ca3af' }
        },
        xaxis: {
          categories: labels,
          labels: { style: { colors: '#9ca3af' } },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: [
          {
            title: { text: 'Total Sales', style: { color: '#f97316' } },
            labels: { style: { colors: '#9ca3af' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
          },
          {
            opposite: true, // Second scale on the right
            title: { text: 'Promoters Registered', style: { color: '#3b82f6' } },
            labels: { style: { colors: '#9ca3af' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
          }
        ],
        grid: {
          borderColor: 'rgba(255, 255, 255, 0.05)',
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } }
        },
        tooltip: { 
          theme: 'dark',
          shared: true,
          intersect: false
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              xaxis: {
                range: selectedMonth === 'All' ? 6 : 10
              }
            }
          }
        ]
      }
    };
  }, [labels, salesData, promotersData, selectedMonth]);

  if (isLoading) return <div className="text-gray-400 text-center py-12 font-bold">Loading dashboard...</div>;

  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-3xl font-bold text-gray-100">Overview Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div 
          onClick={() => navigate('/promoters-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] transition-all"
        >
          <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Category Sales</h3>
          <p className="text-lg font-semibold text-gray-100 truncate" title={`Top: ${topCategory}`}>Top: {topCategory}</p>
        </div>
        <div 
          onClick={() => navigate('/brand-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] transition-all"
        >
          <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Brand Sales</h3>
          <p className="text-lg font-semibold text-gray-100 truncate" title={`Top: ${topBrand}`}>Top: {topBrand}</p>
        </div>
        <div 
          onClick={() => navigate('/store-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] transition-all"
        >
          <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Store Sales</h3>
          <p className="text-lg font-semibold text-gray-100 truncate" title={`Top: ${topStore}`}>Top: {topStore}</p>
        </div>
        <div 
          onClick={() => navigate('/product-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] transition-all"
        >
          <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Product Sales</h3>
          <p className="text-lg font-semibold text-gray-100 truncate" title={`Top: ${topProduct}`}>Top: {topProduct}</p>
        </div>
        <div 
          onClick={() => navigate('/promoters')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] transition-all"
        >
          <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Sales Report</h3>
          <p className="text-lg font-semibold text-gray-100 truncate" title={`Total Units Sold: ${totalSales}`}>Total Units: {totalSales}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-gray-800 shadow-[8px_8px_16px_#111827,-8px_-8px_16px_#374151] border-none p-8 h-full flex flex-col min-h-125">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Promoters Registered vs Sales (Monthly)</h2>
        <div className="relative flex-1 w-full h-full">
          <ReactApexChart options={chartData.options} series={chartData.series} type="line" height="100%" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;