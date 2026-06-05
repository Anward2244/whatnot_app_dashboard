import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import SearchQuery from './SearchQuery';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import {
  IoGridOutline,
  IoPricetagOutline,
  IoSparklesOutline,
  IoStorefrontOutline,
  IoCubeOutline,
  IoDocumentTextOutline,
  IoPeopleOutline
} from 'react-icons/io5';
import { URLS } from '../URLs/Urls';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [salesData, setSalesData] = useState([]);
  const [promotersData, setPromotersData] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const fetchData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setIsLoading(true);
      const token = sessionStorage.getItem('token');
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
    const fetchProfile = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.post(URLS.getProfile, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = response.data?.profileResult || response.data?.data || response.data || {};
        // console.log(profileData);
        setUserProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

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
    let result = promotersData.filter(promoter => promoter.kycVerified === true || String(promoter.kycVerified).toLowerCase() === 'true');

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter(item => {
        const itemDate = new Date(item.logCreatedDate || item.joinDate || item.registeredAt || item.timestamp || item.createdAt);
        return itemDate >= start && itemDate <= end;
      });
    }

    return [...result].sort((a, b) => {
      const dateA = new Date(a.logCreatedDate || a.joinDate || a.registeredAt || a.timestamp || a.createdAt);
      const dateB = new Date(b.logCreatedDate || b.joinDate || b.registeredAt || b.timestamp || b.createdAt);
      // Sort descending (newest to oldest)
      return dateB - dateA;
    });
  }, [promotersData, startDate, endDate]);

  // console.log(promotersData)

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <IoGridOutline className="w-4 h-4" /> },
    { name: 'Category Sales', path: '/category-sales', icon: <IoPricetagOutline className="w-4 h-4" /> },
    { name: 'Brands', path: '/brand-sales', icon: <IoSparklesOutline className="w-4 h-4" /> },
    { name: 'Store Sales', path: '/store-sales', icon: <IoStorefrontOutline className="w-4 h-4" /> },
    { name: 'Product Sales', path: '/product-sales', icon: <IoCubeOutline className="w-4 h-4" /> },
    { name: 'Sales Report', path: '/sales-report', icon: <IoDocumentTextOutline className="w-4 h-4" /> },
    { name: 'Promoters', path: '/promoters', icon: <IoPeopleOutline className="w-4 h-4" /> }
  ];

  const sidebarCollapsed = isCollapsed && !isSidebarOpen;

  return (
    <>
      <style>{`
        .react-datepicker-wrapper input {
          background-color: transparent;
        }
        .react-datepicker-popper {
          z-index: 40 !important;
          margin-left: 1.8rem !important;
        }
        .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::before,
        .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::after {
          border-bottom-color: #1f2937 !important;
        }
        .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::before {
          border-bottom-color: #141a25 !important;
        }
        .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::before,
        .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::after {
          border-top-color: #1f2937 !important;
        }
        .react-datepicker-popper[data-placement^=top] .react-datepicker__triangle::before {
          border-top-color: #141a25 !important;
        }
        .react-datepicker {
          background-color: #1f2937 !important;
          border: none !important;
          box-shadow: 6px 6px 12px #141a25, -6px -6px 12px #2c3a50 !important;
          color: #d4d4d4 !important;
          border-radius: 1rem !important;
          overflow: hidden;
          font-family: inherit;
        }
        .react-datepicker__header {
          background-color: #1f2937 !important;
          border-bottom: 1px solid #2c3a50 !important;
          padding-top: 1rem !important;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name,
        .react-datepicker-time__header {
          color: #a3a3a3 !important;
          font-weight: 600 !important;
        }
        .react-datepicker__day {
          color: #d4d4d4 !important;
          border-radius: 0.5rem !important;
          margin: 0.166rem !important;
        }
        .react-datepicker__day:hover {
          background-color: transparent !important;
          box-shadow: inset 2px 2px 5px #141a25, inset -2px -2px 5px #2c3a50 !important;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-selecting-range,
        .react-datepicker__day--in-range {
          background-color: #1f2937 !important;
          box-shadow: inset 3px 3px 6px #141a25, inset -3px -3px 6px #2c3a50 !important;
          color: #f97316 !important;
          font-weight: bold !important;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: #1f2937 !important;
          box-shadow: inset 2px 2px 5px #141a25, inset -2px -2px 5px #2c3a50 !important;
          color: #f97316 !important;
        }
        .react-datepicker__day--disabled {
          color: #525252 !important;
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
      <div 
        className={`overflow-x-hidden fixed inset-y-0 left-0 ${sidebarCollapsed ? 'w-20' : 'w-46'} bg-gray-800 md:bg-gray-800 flex flex-col shadow-[6px_0_12px_#141a25] z-30 transform transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <div className="h-16 flex items-end justify-center mb-4 mt-2 transition-all duration-300">
          <img src="src\assets\calogo1.png" alt="Logo" className="w-12 md:w-12" />
          <h1 className={`text-2xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-37.5 opacity-100 ml-2'}`}>Whatnot</h1>
        </div>
        <nav className="flex-1 py-4 space-y-2 overflow-y-auto overflow-x-hidden px-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:shadow-[inset_2px_2px_5px_#141a25,inset_-2px_-2px_5px_#2c3a50] [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              title={sidebarCollapsed ? item.name : undefined}
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-2.5 rounded-xl text-xs font-bold transition-all ${
                location.pathname === item.path
                  ? 'bg-gray-800 shadow-[inset_4px_4px_8px_#141a25,inset_-4px_-4px_8px_#2c3a50] text-orange-500'
                  : 'bg-gray-800 shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50] text-gray-400 hover:text-orange-400 hover:shadow-[inset_2px_2px_4px_#141a25,inset_-2px_-2px_4px_#2c3a50]'
              }`}
            >
              <div className={`transition-all duration-300 ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`}>{item.icon}</div>
              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'max-w-0 opacity-0' : 'max-w-37.5 opacity-100'}`}>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className={`flex flex-col gap-6 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'max-h-0 opacity-0 p-0 m-0' : 'max-h-125 opacity-100 p-4 mb-4'}`}>
          <div className="flex flex-col gap-2">
            <label htmlFor="dateRange" className="text-sm font-bold text-gray-400">Date Range:</label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update || [null, null])}
              isClearable={true}
              placeholderText="Select date range"
              portalId="root"
              className="rounded-xl border-none bg-gray-800 text-gray-200 placeholder-gray-500 shadow-[inset_4px_4px_8px_#141a25,inset_-4px_-4px_8px_#2c3a50] focus:outline-none text-xs px-4 py-2.5 w-full transition-all"
            />
          </div>
          <button
            onClick={handleLogout}
            className="text-sm flex justify-evenly font-bold text-red-400 bg-gray-800 shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50] hover:shadow-[inset_2px_2px_4px_#141a25,inset_-2px_-2px_4px_#2c3a50] px-4 py-2.5 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
        <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'max-h-25 opacity-100 p-4 mb-4' : 'max-h-0 opacity-0 p-0 m-0'}`}>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-red-400 flex items-center justify-center bg-gray-800 shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50] hover:shadow-[inset_2px_2px_4px_#141a25,inset_-2px_-2px_4px_#2c3a50] py-3 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-400 hover:text-gray-100 focus:outline-none bg-gray-800 p-2 rounded-xl shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50]"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <SearchQuery filteredPromoters={filteredPromoters} filteredSales={filteredSales} />
          </div>
          <div className="flex items-center gap-3 bg-gray-800 shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50] px-4 py-2 rounded-xl">
            {/* <div className="w-8 h-8 rounded-full bg-gray-700 shadow-[inset_2px_2px_4px_#171717,inset_-2px_-2px_4px_#404040] flex items-center justify-center text-orange-500 font-bold uppercase">
              {userProfile?.username ? userProfile.username.charAt(0) : (userProfile?.name ? userProfile.name.charAt(0) : 'U')}
            </div> */}
            <span className="text-sm font-bold text-gray-300">
              Welcome, {userProfile?.username || userProfile?.name || 'User'}!
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:shadow-[inset_2px_2px_5px_#141a25,inset_-2px_-2px_5px_#2c3a50] [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
          <Outlet context={{ filteredSales, filteredPromoters, isLoading, refetch: fetchData }} />
        </main>
      </div>
      </div>
    </>
  );
};

export default Layout;