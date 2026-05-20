import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

const CategorySales = () => {
  const { filteredSales, isLoading } = useOutletContext();

  const categoryProductSales = useMemo(() => {
    const grouped = {};
    console.log(filteredSales)
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

  console.log(categoryProductSales)

  const chartData = useMemo(() => {
    const labels = Object.keys(categoryProductSales).map(cat => [cat, categoryProductSales[cat].product]);
    const data = Object.values(categoryProductSales).map(val => val.sold);

    const colors = labels.map(labelArray => {
      const category = labelArray[0];
      const brand = (categoryProductSales[category]?.brand || '').toLowerCase();
      const lowerLabel = (labelArray[0] + ' ' + labelArray[1]).toLowerCase();
      if (brand.includes('boat') || lowerLabel.includes('boat')) return 'rgba(239, 68, 68, 0.8)';
      if (brand.includes('realme') || lowerLabel.includes('realme')) return 'rgba(234, 179, 8, 0.8)';
      return 'rgba(156, 163, 175, 0.8)';
    });

    return {
      series: [{
        name: 'Units Sold (Top Product)',
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
            horizontal: true,
            distributed: true,
            borderRadius: 6,
            barHeight: '60%'
          }
        },
        dataLabels: { enabled: true },
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
        tooltip: { 
          theme: 'dark',
          x: {
            formatter: function(val) {
              return Array.isArray(val) ? val.join(' - ') : val;
            }
          }
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              yaxis: {
                labels: { maxWidth: 120, style: { fontSize: '10px' } }
              },
              xaxis: {
                labels: { style: { fontSize: '10px' } }
              }
            }
          }
        ]
      }
    };
  }, [categoryProductSales]);

  // console.log(filteredSales)
  
  if (isLoading) return <div className="text-gray-400 text-center py-12 font-bold">Loading chart data...</div>;

  return (
    <div className="rounded-2xl bg-gray-800 shadow-[8px_8px_16px_#141a25,-8px_-8px_16px_#2c3a50] border-none p-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Top selling Product in each category</h2>
      <div className="relative flex-1 w-full min-h-100">
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height="100%" />
      </div>
    </div>
  );
};

export default CategorySales;