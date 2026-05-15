import React, { useMemo, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

const Dashboard = () => {
  // Adding `filteredPromoters` (or `promoters` as fallback) from your context
  const { filteredSales = [], promoters = [], filteredPromoters = promoters, isLoading } = useOutletContext();
  const [selectedMonth, setSelectedMonth]=useState('All');
  const navigate = useNavigate();

  const categoryData = useMemo(() => {
    const grouped = {};
    filteredSales.forEach(item => {
      const category = item.categoryName || item.category?.name || item.category || 'Unknown';
      const product = item.productName || item.product?.name || item.product || 'Unknown Product';
      const sold = Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);

      if (!grouped[category]) grouped[category] = {};
      if (!grouped[category][product]) grouped[category][product] = 0;
      grouped[category][product] += sold;
    });

    const highestPerCategory = Object.keys(grouped).map(category => {
      const products = grouped[category];
      let maxProduct = '';
      let maxSold = -1;
      Object.keys(products).forEach(product => {
        if (products[product] > maxSold) {
          maxSold = products[product];
          maxProduct = product;
        }
      });
      return { category, product: maxProduct, sold: maxSold };
    });

    const sorted = highestPerCategory.sort((a, b) => b.sold - a.sold);
    const top5 = sorted.slice(0, 5);
    
    return {
      labels: top5.map(s => [s.category, s.product]),
      series: [{ name: 'Units Sold (Top Product)', data: top5.map(s => s.sold) }]
    };
  }, [filteredSales]);

  const brandData = useMemo(() => {
    const counts = {};
    filteredSales.forEach(item => {
      const brand = item.brandName || item.brand?.name || item.brand || 'Unknown';
      counts[brand] = (counts[brand] || 0) + Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top5 = sorted.slice(0, 5);
    return {
      labels: top5.map(s => s[0]),
      series: top5.map(s => s[1])
    };
  }, [filteredSales]);

  const storeData = useMemo(() => {
    const counts = {};
    filteredSales.forEach(item => {
      const store = item.promoter?.storeName || item.storeName || item.store?.name || item.store || 'Unknown';
      counts[store] = (counts[store] || 0) + Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top5 = sorted.slice(0, 5);
    return {
      labels: top5.map(s => s[0]),
      series: top5.map(s => s[1])
    };
  }, [filteredSales]);

  const productData = useMemo(() => {
    const counts = {};
    filteredSales.forEach(item => {
      const product = item.productName || item.product?.name || item.product || 'Unknown';
      counts[product] = (counts[product] || 0) + Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top5 = sorted.slice(0, 5);
    return {
      labels: top5.map(s => s[0]),
      series: [{ name: 'Units Sold', data: top5.map(s => s[1]) }]
    };
  }, [filteredSales]);

  const getBarOptions = useMemo(() => {
    return (categories) => ({
      chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          borderRadius: 4,
          barHeight: '60%'
        }
      },
      dataLabels: { enabled: false },
      legend: { show: false },
      xaxis: {
        categories,
        labels: { style: { colors: '#9ca3af' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#9ca3af' },
          maxWidth: 120,
        }
      },
      grid: {
        borderColor: 'rgba(255, 255, 255, 0.05)',
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } }
      },
      tooltip: { theme: 'dark' }
    });
  }, []);

  const getDonutOptions = useMemo(() => {
    return (labels) => ({
      chart: { type: 'donut', toolbar: { show: false }, background: 'transparent' },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      labels,
      dataLabels: { enabled: true, dropShadow: { enabled: false } },
      legend: { show: true, position: 'bottom', labels: { colors: '#9ca3af' } },
      stroke: { show: true, colors: ['#1f2937'] },
      tooltip: { theme: 'dark' }
    });
  }, []);

  const getPieOptions = useMemo(() => {
    return (labels) => ({
      chart: { type: 'pie', toolbar: { show: false }, background: 'transparent' },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      labels,
      dataLabels: { enabled: true, dropShadow: { enabled: false } },
      legend: { show: true, position: 'bottom', labels: { colors: '#9ca3af' } },
      stroke: { show: true, colors: ['#1f2937'] },
      tooltip: { theme: 'dark' }
    });
  }, []);

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
    <div className="flex flex-col gap-6 pb-6">
      <h1 className="text-3xl font-bold text-gray-100">Overview Dashboard</h1>
      
      <div className="rounded-2xl bg-gray-800 shadow-[8px_8px_16px_#111827,-8px_-8px_16px_#374151] border-none p-8 flex flex-col min-h-100">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Promoters Registered vs Sales</h2>
        <div className="relative flex-1 w-full h-full min-h-75">
          <ReactApexChart options={chartData.options} series={chartData.series} type="line" height="100%" />
        </div>
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => navigate('/promoters-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] transition-all flex flex-col min-h-75"
        >
          <h3 className="text-lg font-bold text-gray-100 mb-4">Top Product in each Category</h3>
          <div className="flex-1 w-full relative min-h-50">
             <ReactApexChart options={getBarOptions(categoryData.labels)} series={categoryData.series} type="bar" height="100%" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/brand-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] transition-all flex flex-col min-h-75"
        >
          <h3 className="text-lg font-bold text-gray-100 mb-4">Top 5 Brands</h3>
          <div className="flex-1 w-full relative min-h-50">
             <ReactApexChart options={getDonutOptions(brandData.labels)} series={brandData.series} type="donut" height="100%" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/store-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] transition-all flex flex-col min-h-75"
        >
          <h3 className="text-lg font-bold text-gray-100 mb-4">Top 5 Stores</h3>
          <div className="flex-1 w-full relative min-h-50">
             <ReactApexChart options={getPieOptions(storeData.labels)} series={storeData.series} type="pie" height="100%" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/product-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] transition-all flex flex-col min-h-75"
        >
          <h3 className="text-lg font-bold text-gray-100 mb-4">Top 5 Products</h3>
          <div className="flex-1 w-full relative min-h-50">
             <ReactApexChart options={getBarOptions(productData.labels)} series={productData.series} type="bar" height="100%" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;