import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const searchablePages = [
  { name: 'Dashboard', path: '/' },
  { name: 'Category Sales', path: '/category-sales' },
  { name: 'Brand Sales', path: '/brand-sales' },
  { name: 'Store Sales', path: '/store-sales' },
  { name: 'Product Sales', path: '/product-sales' },
  { name: 'Sales Report', path: '/sales-report' },
  { name: 'Promoters', path: '/promoters' }
];

const SearchQuery = ({ filteredPromoters, filteredSales }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState({ pages: [], data: [] });
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    if (query.trim() === '') {
      setSearchResults({ pages: [], data: [] });
      return;
    }
    const lowerCaseQuery = query.toLowerCase();

    // Page results
    const pageResults = searchablePages.filter(page =>
      page.name.toLowerCase().includes(lowerCaseQuery)
    ).map(p => ({ ...p, type: 'page' }));

    const dataResults = [];

    // Promoter results
    const promoterNames = new Set();
    (filteredPromoters || []).forEach(promoter => {
        const name = promoter.name || promoter.promoterName || promoter.username || '';
        if (name && name.toLowerCase().includes(lowerCaseQuery) && !promoterNames.has(name)) {
          promoterNames.add(name);
          dataResults.push({ name, path: '/promoters', type: 'promoter', category: 'Promoters', pageName: 'Promoters' });
          dataResults.push({ name, path: '/sales-report', type: 'promoter', category: 'Promoters', pageName: 'Sales Report' });
        }
      });

    // Product results
    const productNames = new Set();
    (filteredSales || []).forEach(sale => {
        const name = sale.productName || sale.product?.name || sale.product || '';
        if (name && name.toLowerCase().includes(lowerCaseQuery) && !productNames.has(name)) {
          productNames.add(name);
          dataResults.push({ name, path: '/product-sales', type: 'product', category: 'Products', pageName: 'Product Sales' });
          dataResults.push({ name, path: '/sales-report', type: 'product', category: 'Products', pageName: 'Sales Report' });
        }
      });

    // Store results
    const storeNames = new Set();
    (filteredSales || []).forEach(sale => {
      const name = sale.promoter?.storeName || sale.storeName || sale.store?.name || sale.store || '';
      if (name && name.toLowerCase().includes(lowerCaseQuery) && !storeNames.has(name)) {
        storeNames.add(name);
        dataResults.push({ name, path: '/store-sales', type: 'store', category: 'Stores', pageName: 'Store Sales' });
        dataResults.push({ name, path: '/sales-report', type: 'store', category: 'Stores', pageName: 'Sales Report' });
      }
    });

    // Brand results
    const brandNames = new Set();
    (filteredSales || []).forEach(sale => {
      const name = sale.brandName || sale.brand?.name || sale.brand || '';
      if (name && name.toLowerCase().includes(lowerCaseQuery) && !brandNames.has(name)) {
        brandNames.add(name);
        dataResults.push({ name, path: '/brand-sales', type: 'brand', category: 'Brands', pageName: 'Brand Sales' });
      }
    });

    setSearchResults({ pages: pageResults, data: dataResults.slice(0, 10) });
  }, [query, filteredPromoters, filteredSales]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const { pages, data } = searchResults;
    const firstResult = [...pages, ...data][0];
    if (firstResult) {
      handleSelect(firstResult);
    }
  };

  const handleSelect = (item) => {
    const navigationState = {};
    if (item.type === 'product') navigationState.selectedProduct = item.name;
    if (item.type === 'promoter') navigationState.selectedPromoter = item.name;
    if (item.type === 'store') navigationState.selectedStore = item.name;
    if (item.type === 'brand') navigationState.selectedBrand = item.name;

    navigate(item.path, { state: navigationState });
    setQuery('');
    setShowSuggestions(false);
  };

  const hasResults = searchResults.pages.length > 0 || searchResults.data.length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-xs hidden md:block z-50">
      <form onSubmit={handleSearch} className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search brands, pages, etc..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border-none bg-gray-800 text-gray-200 placeholder-gray-500 shadow-[inset_4px_4px_8px_#141a25,inset_-4px_-4px_8px_#2c3a50] focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IoSearchOutline className="w-5 h-5 text-gray-400" />
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && query.trim() !== '' && hasResults && (
        <div className="absolute mt-2 w-full bg-gray-800 rounded-xl shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50] overflow-hidden flex flex-col py-2 border border-gray-700/50 max-h-96 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:shadow-[inset_2px_2px_5px_#141a25,inset_-2px_-2px_5px_#2c3a50] [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
          {searchResults.pages.length > 0 && (
            <div className="border-b border-gray-700/50 last:border-b-0">
              <h3 className="px-4 pt-2 pb-1 text-xs font-bold text-gray-500 uppercase tracking-wider">Pages</h3>
              {searchResults.pages.map((page) => (
                <button key={`page-${page.path}`} type="button" onClick={() => handleSelect(page)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-300 hover:bg-gray-700/50 hover:text-orange-400 transition-colors cursor-pointer focus:outline-none focus:bg-gray-700/50">
                  {page.name}
                </button>
              ))}
            </div>
          )}
          {Object.entries(searchResults.data.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
          }, {})).map(([category, items]) => (
            <div key={category} className="border-b border-gray-700/50 last:border-b-0">
              <h3 className="px-4 pt-2 pb-1 text-xs font-bold text-gray-500 uppercase tracking-wider">{category}</h3>
              {items.map((item, index) => (
                <button key={`${item.type}-${item.path}-${index}`} type="button" onClick={() => handleSelect(item)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-300 hover:bg-gray-700/50 hover:text-orange-400 transition-colors cursor-pointer focus:outline-none focus:bg-gray-700/50">
                  <div>
                    {item.name}
                    <span className="block text-xs text-gray-500 font-normal -mt-0.5">in {item.pageName}</span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {showSuggestions && query.trim() !== '' && !hasResults && (
        <div className="absolute mt-2 w-full bg-gray-800 rounded-xl shadow-[4px_4px_8px_#141a25,-4px_-4px_8px_#2c3a50] overflow-hidden flex flex-col py-2 border border-gray-700/50">
            <div className="px-4 py-2 text-sm text-gray-500 font-medium italic text-center">
              No results found
            </div>
        </div>
      )}
    </div>
  );
};

export default SearchQuery;