import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { URLS } from '../URLs/Urls';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [salesData, setSalesData] = useState([]);
  const [promotersData, setPromotersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const [salesResponse, promotersResponse] = await Promise.all([
        axios.post(URLS.GetAllSales, {}, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.post(URLS.GetAllPromoters, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const sData = salesResponse.data?.data || salesResponse.data;
      const newSalesData = Array.isArray(sData) ? sData : [];
      setSalesData(prev => 
        JSON.stringify(prev) === JSON.stringify(newSalesData) ? prev : newSalesData
      );

      const pData = promotersResponse.data?.promoters || promotersResponse.data?.data || promotersResponse.data || [];
      const newPromotersData = Array.isArray(pData) ? pData : [];
      setPromotersData(prev => 
        JSON.stringify(prev) === JSON.stringify(newPromotersData) ? prev : newPromotersData
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const filteredSales = useMemo(() => {
    let result = salesData;

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      result = salesData.filter(item => {
        const itemDate = new Date(item.saleDate || item.date || item.createdAt || item.dateSold);
        return itemDate >= start && itemDate <= end;
      });
    }

    return [...result].sort((a, b) => {
      const dateA = new Date(a.saleDate || a.date || a.createdAt || a.dateSold);
      const dateB = new Date(b.saleDate || b.date || b.createdAt || b.dateSold);
      return dateB - dateA;
    });
  }, [salesData, startDate, endDate]);

  const filteredPromoters = useMemo(() => {
    let result = promotersData;

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      result = promotersData.filter(item => {
        const itemDate = new Date(item.logCreatedDate || item.joinDate || item.registeredAt || item.timestamp || item.createdAt);
        return itemDate >= start && itemDate <= end;
      });
    }

    return result;
  }, [promotersData, startDate, endDate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Category Sales', path: '/promoters-sales' },
    { name: 'Brands', path: '/brand-sales' },
    { name: 'Store Sales', path: '/store-sales' },
    { name: 'Product Sales', path: '/product-sales' },
    { name: 'Sales Report', path: '/promoters' },
  ];

  return (
    <>
      <style>{`
        .react-datepicker-wrapper input {
          background-color: transparent;
        }
        .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::before,
        .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::after {
          border-bottom-color: #1f2937 !important;
        }
        .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::before {
          border-bottom-color: #111827 !important;
        }
        .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::before,
        .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::after {
          border-top-color: #1f2937 !important;
        }
        .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::before {
          border-top-color: #111827 !important;
        }
        .react-datepicker {
          background-color: #1f2937 !important;
          border: none !important;
          box-shadow: 6px 6px 12px #111827, -6px -6px 12px #374151 !important;
          color: #d1d5db !important;
          border-radius: 1rem !important;
          overflow: hidden;
          font-family: inherit;
        }
        .react-datepicker__header {
          background-color: #1f2937 !important;
          border-bottom: 1px solid #374151 !important;
          padding-top: 1rem !important;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name,
        .react-datepicker-time__header {
          color: #9ca3af !important;
          font-weight: 600 !important;
        }
        .react-datepicker__day {
          color: #d1d5db !important;
          border-radius: 0.5rem !important;
          margin: 0.166rem !important;
        }
        .react-datepicker__day:hover {
          background-color: transparent !important;
          box-shadow: inset 2px 2px 5px #111827, inset -2px -2px 5px #374151 !important;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-selecting-range,
        .react-datepicker__day--in-range {
          background-color: #1f2937 !important;
          box-shadow: inset 3px 3px 6px #111827, inset -3px -3px 6px #374151 !important;
          color: #f97316 !important;
          font-weight: bold !important;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: #1f2937 !important;
          box-shadow: inset 2px 2px 5px #111827, inset -2px -2px 5px #374151 !important;
          color: #f97316 !important;
        }
        .react-datepicker__day--disabled {
          color: #4b5563 !important;
        }
        .react-datepicker__close-icon::after {
          background-color: #1f2937 !important;
        }
      `}</style>
      <div className="flex h-screen bg-gray-800 font-sans text-gray-300 overflow-hidden">
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)}
      />
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 md:bg-gray-800 flex flex-col shadow-[6px_0_12px_#111827] z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="h-16 flex items-center px-6 mb-4 mt-2">
          <h1 className="text-xl font-bold text-gray-100">Whatnot Dashboard</h1>
        </div>
        <nav className="flex-1 py-4 space-y-2 overflow-y-auto px-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:shadow-[inset_2px_2px_5px_#111827,inset_-2px_-2px_5px_#374151] [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname === item.path
                  ? 'bg-gray-800 shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] text-orange-500'
                  : 'bg-gray-800 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] text-gray-400 hover:text-orange-400 hover:shadow-[inset_2px_2px_4px_#111827,inset_-2px_-2px_4px_#374151]'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 flex flex-col gap-6 mb-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="dateRange" className="text-sm font-bold text-gray-400">Date Range:</label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update || [null, null])}
              isClearable={true}
              placeholderText="Select date range"
              className="rounded-xl border-none bg-gray-800 text-gray-200 placeholder-gray-500 shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] focus:outline-none text-xs px-4 py-2.5 w-full transition-all"
            />
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-bold text-red-400 bg-gray-800 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_2px_2px_4px_#111827,inset_-2px_-2px_4px_#374151] px-4 py-2.5 rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-100 focus:outline-none bg-gray-800 p-2 rounded-xl shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151]"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:shadow-[inset_2px_2px_5px_#111827,inset_-2px_-2px_5px_#374151] [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
          <Outlet context={{ filteredSales, filteredPromoters, isLoading, refetch: fetchData }} />
        </main>
      </div>
      </div>
    </>
  );
};

export default Layout;