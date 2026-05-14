import React, { useEffect, useRef, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import Chart from 'chart.js/auto';

const CategorySales = () => {
  const { filteredSales, isLoading } = useOutletContext();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const categoryProductSales = useMemo(() => {
    const grouped = {};
    filteredSales.forEach(item => {
      const category = item.categoryName || item.category?.name || item.category || 'Unknown Category';
      const product = item.productName || item.product?.name || item.product || 'Unknown Product';
      const brand = item.brandName || item.brand?.name || item.brand || 'Unknown';
      const sold = Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);

      if (!grouped[category]) grouped[category] = {};
      if (!grouped[category][product]) grouped[category][product] = { sold: 0, brand };
      grouped[category][product].sold += sold;
    });

    const highestPerCategory = {};
    Object.keys(grouped).forEach(category => {
      const products = grouped[category];
      let maxProduct = '';
      let maxSold = -1;
      let maxBrand = '';
      Object.keys(products).forEach(product => {
        if (products[product].sold > maxSold) {
          maxSold = products[product].sold;
          maxProduct = product;
          maxBrand = products[product].brand;
        }
      });
      highestPerCategory[category] = { product: maxProduct, sold: maxSold, brand: maxBrand };
    });
    return highestPerCategory;
  }, [filteredSales]);

  const chartData = useMemo(() => {
    const labels = Object.keys(categoryProductSales).map(cat => [cat, categoryProductSales[cat].product]);
    const data = Object.values(categoryProductSales).map(val => val.sold);

    const backgroundColors = labels.map(labelArray => {
      const category = labelArray[0];
      const brand = (categoryProductSales[category]?.brand || '').toLowerCase();
      const lowerLabel = (labelArray[0] + ' ' + labelArray[1]).toLowerCase();
      if (brand.includes('boat') || lowerLabel.includes('boat')) return 'rgba(239, 68, 68, 0.6)';
      if (brand.includes('realme') || lowerLabel.includes('realme')) return 'rgba(234, 179, 8, 0.6)';
      return 'rgba(156, 163, 175, 0.6)';
    });

    const borderColors = labels.map(labelArray => {
      const category = labelArray[0];
      const brand = (categoryProductSales[category]?.brand || '').toLowerCase();
      const lowerLabel = (labelArray[0] + ' ' + labelArray[1]).toLowerCase();
      if (brand.includes('boat') || lowerLabel.includes('boat')) return 'rgba(239, 68, 68, 0.8)';
      if (brand.includes('realme') || lowerLabel.includes('realme')) return 'rgba(234, 179, 8, 0.8)';
      return 'rgba(156, 163, 175, 0.8)';
    });

    const hoverBackgroundColors = labels.map(labelArray => {
      const category = labelArray[0];
      const brand = (categoryProductSales[category]?.brand || '').toLowerCase();
      const lowerLabel = (labelArray[0] + ' ' + labelArray[1]).toLowerCase();
      if (brand.includes('boat') || lowerLabel.includes('boat')) return 'rgba(239, 68, 68, 1)';
      if (brand.includes('realme') || lowerLabel.includes('realme')) return 'rgba(234, 179, 8, 1)';
      return 'rgba(156, 163, 175, 1)';
    });

    return {
      labels,
      datasets: [{ 
        label: 'Units Sold (Top Product)', 
        data, 
        backgroundColor: backgroundColors, 
        borderColor: borderColors, 
        hoverBackgroundColor: hoverBackgroundColors,
        borderWidth: 1, 
        borderRadius: 6, 
        barPercentage: 0.6 
      }]
    };
  }, [categoryProductSales]);

  console.log(filteredSales)
  
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
            x: { 
              grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
              ticks: { padding: 8, color: '#9ca3af' },
              border: { display: false } 
            }, 
            y: { 
              grid: { display: false, drawBorder: false }, 
              ticks: { padding: 8, color: '#9ca3af' },
              border: { display: false } 
            } 
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
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Top selling Product in each category</h2>
      <div className="relative flex-1 w-full min-h-100">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default CategorySales;