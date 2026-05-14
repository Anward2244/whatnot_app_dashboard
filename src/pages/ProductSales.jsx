import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import Chart from 'chart.js/auto';

const ProductSales = () => {
  const { filteredSales, isLoading } = useOutletContext();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const brands = useMemo(() => {
    const brandSet = new Set();
    filteredSales.forEach(item => {
      const brand = item.brandName || item.brand?.name || item.brand || 'Unknown';
      brandSet.add(brand);
    });
    return Array.from(brandSet).sort();
  }, [filteredSales]);

  const [selectedBrand, setSelectedBrand] = useState('All');

  const salesByProduct = useMemo(() => {
    const filteredByBrand = selectedBrand === 'All'
      ? filteredSales
      : filteredSales.filter(item => {
          const brand = item.brandName || item.brand?.name || item.brand || 'Unknown';
          return brand === selectedBrand;
        });

    return filteredByBrand.reduce((acc, item) => {
      const product = item.productName || item.product?.name || item.product || 'Unknown Product';
      const sold = Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
      acc[product] = (acc[product] || 0) + sold;
      return acc;
    }, {});
  }, [filteredSales, selectedBrand]);

  const productBrands = useMemo(() => {
    const mapping = {};
    filteredSales.forEach(item => {
      const product = item.productName || item.product?.name || item.product || 'Unknown Product';
      const brand = item.brandName || item.brand?.name || item.brand || 'Unknown';
      mapping[product] = brand;
    });
    return mapping;
  }, [filteredSales]);

  const chartData = useMemo(() => {
    const labels = Object.keys(salesByProduct);
    const backgroundColors = labels.map(label => {
      const brand = (productBrands[label] || '').toLowerCase();
      const productLower = label.toLowerCase();
      if (brand.includes('boat') || productLower.includes('boat')) return 'rgba(239, 68, 68, 0.6)';
      if (brand.includes('realme') || productLower.includes('realme')) return 'rgba(234, 179, 8, 0.6)';
      return 'rgba(156, 163, 175, 0.6)';
    });

    const borderColors = labels.map(label => {
      const brand = (productBrands[label] || '').toLowerCase();
      const productLower = label.toLowerCase();
      if (brand.includes('boat') || productLower.includes('boat')) return 'rgba(239, 68, 68, 0.8)';
      if (brand.includes('realme') || productLower.includes('realme')) return 'rgba(234, 179, 8, 0.8)';
      return 'rgba(156, 163, 175, 0.8)';
    });

    const hoverBackgroundColors = labels.map(label => {
      const brand = (productBrands[label] || '').toLowerCase();
      const productLower = label.toLowerCase();
      if (brand.includes('boat') || productLower.includes('boat')) return 'rgba(239, 68, 68, 1)';
      if (brand.includes('realme') || productLower.includes('realme')) return 'rgba(234, 179, 8, 1)';
      return 'rgba(156, 163, 175, 1)';
    });

    return {
      labels,
      datasets: [{
        label: 'Total Units Sold',
        data: Object.values(salesByProduct),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        hoverBackgroundColor: hoverBackgroundColors,
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
      }],
    };
  }, [salesByProduct, productBrands]);

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

  if (isLoading) return <div className="text-gray-400 font-bold text-center py-12">Loading chart data...</div>;

  return (
    <div className="rounded-2xl bg-gray-800 shadow-[8px_8px_16px_#111827,-8px_-8px_16px_#374151] border-none p-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Products sold in each Brand</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setSelectedBrand('All')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            selectedBrand === 'All'
              ? 'bg-gray-800 shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] text-orange-500 border-none'
              : 'bg-gray-800 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_2px_2px_4px_#111827,inset_-2px_-2px_4px_#374151] text-gray-400 border-none hover:text-orange-400'
          }`}
        >
          All Brands
        </button>
        {brands.map(brand => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedBrand === brand
                ? 'bg-gray-800 shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] text-orange-500 border-none'
                : 'bg-gray-800 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_2px_2px_4px_#111827,inset_-2px_-2px_4px_#374151] text-gray-400 border-none hover:text-orange-400'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>
      <div className="relative flex-1 w-full min-h-100">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ProductSales;