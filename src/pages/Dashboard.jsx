import React, { useMemo, useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

const Dashboard = () => {
  // Adding `filteredPromoters` (or `promoters` as fallback) from your context
  const { filteredSales = [], promoters = [], filteredPromoters = promoters, isLoading, refetch } = useOutletContext();
  const [selectedMonth, setSelectedMonth]=useState('All');
  const [chartConfig, setChartConfig] = useState({
    granularity: 'daily',
    range: null,
  });
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Poll for new data every 5 seconds if a `refetch` function is provided in the context
  useEffect(() => {
    if (typeof refetch === 'function') {
      const intervalId = setInterval(() => {
        refetch(true); // Automatically trigger a background data refresh without loading indicator
      }, 5000); // 5000ms = 5 seconds
      
      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }
  }, [refetch]);

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
              labels: { maxWidth: 100, style: { fontSize: '10px' } }
            },
            xaxis: {
              labels: { style: { fontSize: '10px' } }
            }
          }
        }
      ]
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
      tooltip: { 
        theme: 'dark'
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: { fontSize: '12px' }
          }
        }
      ]
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
      tooltip: { 
        theme: 'dark'
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: { fontSize: '12px' }
          }
        }
      ]
    });
  }, []);

  const { salesData, promotersData } = useMemo(() => {
    const getLocalKey = (dateStr, isDaily) => {
      let d = dateStr ? new Date(dateStr) : new Date();
      if (isNaN(d.getTime())) d = new Date(); // fallback for invalid dates
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      if (isDaily) {
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      return `${year}-${month}-01`;
    };

    const isDaily = chartConfig.granularity === 'daily';

    const salesMap = {};
    filteredSales.forEach(item => {
      const key = getLocalKey(item.date || item.createdAt || item.saleDate || item.timestamp, isDaily);
      const sold = Number(item.quantity ?? item.totalSold ?? item.sold ?? 0);
      salesMap[key] = (salesMap[key] || 0) + sold;
    });

    const promotersMap = {};
    filteredPromoters.forEach(item => {
      const key = getLocalKey(item.logCreatedDate || item.joinDate || item.registeredAt || item.timestamp, isDaily);
      promotersMap[key] = (promotersMap[key] || 0) + 1;
    });

    const sortedKeys = Array.from(new Set([...Object.keys(salesMap), ...Object.keys(promotersMap)])).sort();
    
    return {
      salesData: sortedKeys.map(k => {
        const [year, month, day] = k.split('-');
        return [new Date(year, month - 1, day).getTime(), salesMap[k] || 0];
      }),
      promotersData: sortedKeys.map(k => {
        const [year, month, day] = k.split('-');
        return [new Date(year, month - 1, day).getTime(), promotersMap[k] || 0];
      })
    };
  }, [filteredSales, filteredPromoters, chartConfig.granularity]);

  const chartData = useMemo(() => {
    const isDaily = chartConfig.granularity === 'daily';

    let minX = chartConfig.range ? chartConfig.range.min : undefined;
    let maxX = chartConfig.range ? chartConfig.range.max : undefined;

    // By default, display 30 days of daily data on desktop, and 7 days on mobile
    if (isDaily && !chartConfig.range && salesData.length > 0) {
      const maxTs = salesData[salesData.length - 1][0];
      maxX = maxTs;
      const daysToDisplay = isMobile ? 7 : 30;
      minX = maxTs - (daysToDisplay * 24 * 60 * 60 * 1000);
    }

    const options = {
        chart: {
          type: 'line',
          toolbar: { 
            show: true, 
            tools: { 
              download: false,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true
            } 
          },
          zoom: {
            enabled: true,
            allowMouseWheelZoom: false
          },
          background: 'transparent',
          events: {
            zoomed: (chartContext, { xaxis }) => {
              if (!xaxis || xaxis.min === undefined || xaxis.max === undefined) return;
              const rangeInMs = xaxis.max - xaxis.min;
              const threeMonthsInMs = 90 * 24 * 60 * 60 * 1000;
              
              if (rangeInMs > 0 && rangeInMs < threeMonthsInMs && !isDaily) {
                setChartConfig({
                  granularity: 'daily',
                  range: { min: xaxis.min, max: xaxis.max },
                });
              } else if (rangeInMs > 0 && rangeInMs >= threeMonthsInMs && isDaily) {
                setChartConfig({
                  granularity: 'monthly',
                  range: { min: xaxis.min, max: xaxis.max },
                });
              } else {
                 setChartConfig(prev => ({
                   ...prev,
                   range: { min: xaxis.min, max: xaxis.max }
                 }));
              }
            },
            scrolled: (chartContext, { xaxis }) => {
              if (!xaxis || xaxis.min === undefined || xaxis.max === undefined) return;
              setChartConfig(prev => ({
                ...prev,
                range: { min: xaxis.min, max: xaxis.max }
              }));
            },
            beforeResetZoom: () => {
              setChartConfig({ granularity: 'daily', range: null });
              
              let maxTs = Date.now();
              if (filteredSales.length > 0 || filteredPromoters.length > 0) {
                const getTs = (item) => new Date(item.date || item.createdAt || item.saleDate || item.timestamp || item.logCreatedDate || item.joinDate || item.registeredAt).getTime();
                const maxSalesTs = filteredSales.length > 0 ? getTs(filteredSales[0]) : 0;
                const maxPromoterTs = filteredPromoters.length > 0 ? getTs(filteredPromoters[0]) : 0;
                maxTs = Math.max(maxSalesTs, maxPromoterTs) || Date.now();
              }
              
              const daysToDisplay = isMobile ? 7 : 30;
              return {
                xaxis: {
                  min: maxTs - (daysToDisplay * 24 * 60 * 60 * 1000),
                  max: maxTs
                }
              };
            },
          },
        },
        colors: ['rgba(249, 115, 22, 0.8)', '#3b82f6'],
        stroke: {
          width: [0, 4],
          curve: 'smooth'
        },
        fill: {
          type: ['solid', 'gradient'],
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: ['#3b82f6'],
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0.05,
            stops: [0, 100]
          }
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
          type: 'datetime',
          min: minX,
          max: maxX,
          labels: { 
             style: { colors: '#9ca3af' },
             datetimeUTC: false,
             format: isDaily ? 'dd MMM yyyy' : 'MMM yyyy'
          },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: [
          {
            opposite: true,
            title: { text: 'Total Sales', style: { color: '#f97316' } },
            labels: { style: { colors: '#9ca3af' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
          },
          {
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
          intersect: false,
          x: {
            format: isDaily ? 'dd MMM yyyy' : 'MMM yyyy'
          }
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              xaxis: {
                labels: { style: { fontSize: '10px' } }
              },
              yaxis: [
                { opposite: true, labels: { style: { fontSize: '10px' } }, title: { style: { fontSize: '11px' } } },
                { labels: { style: { fontSize: '10px' } }, title: { style: { fontSize: '11px' } } }
              ],
              legend: {
                position: 'bottom',
                fontSize: '12px'
              }
            }
          }
        ]
    };

    return {
      series: [
        {
          name: 'Total Sales',
          type: 'column',
          data: salesData
        },
        {
          name: 'Promoters Registered',
          type: 'area',
          data: promotersData
        }
      ],
      options
    };
  }, [salesData, promotersData, chartConfig, isMobile]);

  const todaysSales = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return filteredSales.filter(item => {
      let d = item.date || item.createdAt || item.saleDate || item.timestamp ? new Date(item.date || item.createdAt || item.saleDate || item.timestamp) : new Date();
      if (isNaN(d.getTime())) d = new Date();
      const itemDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return itemDateStr === todayStr;
    }).sort((a, b) => {
      let da = a.date || a.createdAt || a.saleDate || a.timestamp ? new Date(a.date || a.createdAt || a.saleDate || a.timestamp) : new Date(0);
      let db = b.date || b.createdAt || b.saleDate || b.timestamp ? new Date(b.date || b.createdAt || b.saleDate || b.timestamp) : new Date(0);
      return db - da; // sort descending by time
    });
  }, [filteredSales]);

  if (isLoading) return <div className="text-gray-400 text-center py-12 font-bold">Loading dashboard...</div>;

  return (
    <div className="flex flex-col gap-6 pb-6">
      <h1 className="text-3xl font-bold text-gray-100">Overview Dashboard</h1>
      
      <div className="rounded-2xl bg-gray-800 shadow-[8px_8px_16px_#141a25,-8px_-8px_16px_#2c3a50] border-none p-8 flex flex-col min-h-125">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Promoters Registered vs Sales</h2>
        <div className="relative flex-1 w-full h-full min-h-75">
          <ReactApexChart options={chartData.options} series={chartData.series} type="line" height="100%" />
        </div>
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => navigate('/category-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50] hover:shadow-[inset_4px_4px_8px_#141a25,inset_-4px_-4px_8px_#2c3a50] transition-all flex flex-col min-h-75"
        >
          <h3 className="text-lg font-bold text-gray-100 mb-4">Top Product in each Category</h3>
          <div className="flex-1 w-full relative min-h-50">
             <ReactApexChart options={getBarOptions(categoryData.labels)} series={categoryData.series} type="bar" height="100%" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/brand-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50] hover:shadow-[inset_4px_4px_8px_#141a25,inset_-4px_-4px_8px_#2c3a50] transition-all flex flex-col min-h-75"
        >
          <h3 className="text-lg font-bold text-gray-100 mb-4">Top 5 Brands</h3>
          <div className="flex-1 w-full relative min-h-50">
             <ReactApexChart options={getDonutOptions(brandData.labels)} series={brandData.series} type="donut" height="100%" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/store-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50] hover:shadow-[inset_4px_4px_8px_#141a25,inset_-4px_-4px_8px_#2c3a50] transition-all flex flex-col min-h-75"
        >
          <h3 className="text-lg font-bold text-gray-100 mb-4">Top 5 Stores</h3>
          <div className="flex-1 w-full relative min-h-50">
             <ReactApexChart options={getPieOptions(storeData.labels)} series={storeData.series} type="pie" height="100%" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/product-sales')}
          className="cursor-pointer bg-gray-800 rounded-2xl p-6 shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50] hover:shadow-[inset_4px_4px_8px_#141a25,inset_-4px_-4px_8px_#2c3a50] transition-all flex flex-col min-h-75"
        >
          <h3 className="text-lg font-bold text-gray-100 mb-4">Top 5 Products</h3>
          <div className="flex-1 w-full relative min-h-50 overflow-hidden">
             <ReactApexChart options={getBarOptions(productData.labels)} series={productData.series} type="bar" height="100%" />
          </div>
        </div>
      </div>

      {/* Daily Sales Table */}
      <div className="rounded-2xl bg-gray-800 shadow-[8px_8px_16px_#141a25,-8px_-8px_16px_#2c3a50] border-none p-8 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Today's Sales</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="py-3 px-4 font-semibold">Time</th>
                <th className="py-3 px-4 font-semibold">Store</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {todaysSales.length > 0 ? (
                todaysSales.map((sale, index) => {
                  // console.log(sale)
                  const category = sale.categoryName;
                  const store = sale.promoter?.storeName || sale.storeName || sale.store?.name || sale.store || 'Unknown';
                  const product = sale.productName || sale.product?.name || sale.product || 'Unknown Product';
                  const sold = Number(sale.quantity ?? sale.totalSold ?? sale.sold ?? 0);
                  let d = sale.date || sale.createdAt || sale.saleDate || sale.timestamp ? new Date(sale.date || sale.createdAt || sale.saleDate || sale.timestamp) : new Date();
                  if (isNaN(d.getTime())) d = new Date();
                  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={sale.id || index} className="border-b border-gray-700/50 text-gray-200 hover:bg-gray-700/20 transition-colors">
                      <td className="py-3 px-4">{time}</td>
                      <td className="py-3 px-4">{store}</td>
                      <td className='py-3 px-4'>{category}</td>
                      <td className="py-3 px-4">{product}</td>
                      <td className="py-3 px-4">{sold}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-400">No sales recorded today yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;