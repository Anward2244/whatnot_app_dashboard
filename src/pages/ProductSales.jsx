import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

const ProductSales = () => {
  const { filteredSales, isLoading } = useOutletContext();

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
    const colors = labels.map(label => {
      const brand = (productBrands[label] || '').toLowerCase();
      const productLower = label.toLowerCase();
      if (brand.includes('boat') || productLower.includes('boat')) return 'rgba(239, 68, 68, 0.8)';
      if (brand.includes('realme') || productLower.includes('realme')) return 'rgba(234, 179, 8, 0.8)';
      return 'rgba(156, 163, 175, 0.8)';
    });

    return {
      series: [{
        name: 'Total Units Sold',
        data: Object.values(salesByProduct)
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
  }, [salesByProduct, productBrands]);

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
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height="100%" />
      </div>
    </div>
  );
};

export default ProductSales;