import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

const PromotersData = () => {
  const { filteredSales, isLoading } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const currentSales = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSales.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSales, currentPage, itemsPerPage]);

  // console.log(currentSales)
  
  return (
    <div className="font-sans text-gray-300 h-full">
      <div className="mx-auto max-w-7xl h-full flex flex-col">
        <div className="overflow-hidden rounded-2xl bg-gray-800 shadow-[8px_8px_16px_#111827,-8px_-8px_16px_#374151] border-none flex flex-col flex-1">
          <div className="overflow-x-auto p-4 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:shadow-[inset_2px_2px_5px_#111827,inset_-2px_-2px_5px_#374151] [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
            <table className="min-w-full divide-y divide-gray-700/50 text-sm text-left">
              <thead className="bg-transparent text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider uppercase">S.No</th>
                  <th className="px-6 py-4 font-bold tracking-wider uppercase">Brand Name</th>
                  <th className="px-6 py-4 font-bold tracking-wider uppercase">Store Name</th>
                  <th className="px-6 py-4 font-bold tracking-wider uppercase">Product Name</th>
                  <th className="px-6 py-4 font-bold tracking-wider uppercase">Incentives</th>
                  <th className="px-6 py-4 font-bold tracking-wider uppercase">Total Sold</th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Loading data...</td>
                  </tr>
                </tbody>
              ) : currentSales.length > 0 ? (
                <tbody className="divide-y divide-gray-700/50 bg-transparent text-gray-300">
                {currentSales.map((row, index) => (
                  <tr key={row._id || row.id || index} className="hover:bg-gray-700/30 transition-colors duration-200">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.brandName || row.brand?.name || row.brand || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.promoter?.storeName || row.storeName || row.store?.name || row.store || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.productName || row.product?.name || row.product || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{row.incentive ?? row.incentives ?? 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-100">{row.quantity ?? row.totalSold ?? row.sold ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No data available for the selected date range.</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          {filteredSales.length > 0 && (
            <div className="flex items-center justify-between bg-transparent px-6 py-5 mt-auto">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-xl bg-gray-800 px-4 py-2 text-sm font-bold text-gray-300 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_2px_2px_4px_#111827,inset_-2px_-2px_4px_#374151] disabled:opacity-50 border-none transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="relative ml-3 inline-flex items-center rounded-xl bg-gray-800 px-4 py-2 text-sm font-bold text-gray-300 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_2px_2px_4px_#111827,inset_-2px_-2px_4px_#374151] disabled:opacity-50 border-none transition-all"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Showing <span className="font-bold text-gray-100">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-100">{Math.min(currentPage * itemsPerPage, filteredSales.length)}</span> of{' '}
                    <span className="font-bold text-gray-100">{filteredSales.length}</span> results
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-xl border-none bg-gray-800 text-gray-300 py-2 pl-4 pr-8 text-sm shadow-[inset_4px_4px_8px_#111827,inset_-4px_-4px_8px_#374151] focus:outline-none cursor-pointer"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                  <nav className="isolate inline-flex space-x-2" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-xl px-3 py-2 text-gray-400 bg-gray-800 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_2px_2px_4px_#111827,inset_-2px_-2px_4px_#374151] hover:text-orange-400 focus:z-20 disabled:opacity-50 transition-all border-none"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="relative inline-flex items-center rounded-xl px-3 py-2 text-gray-400 bg-gray-800 shadow-[4px_4px_8px_#111827,-4px_-4px_8px_#374151] hover:shadow-[inset_2px_2px_4px_#111827,inset_-2px_-2px_4px_#374151] hover:text-orange-400 focus:z-20 disabled:opacity-50 transition-all border-none"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PromotersData;