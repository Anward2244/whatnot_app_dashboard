import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

const Promoters = () => {
  const { filteredPromoters, isLoading } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil((filteredPromoters?.length || 0) / itemsPerPage);
  
  const currentPromoters = useMemo(() => {
    if (!filteredPromoters) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPromoters.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPromoters, currentPage, itemsPerPage]);

  return (
    <div className="font-sans text-slate-300 h-full">
      <div className="mx-auto max-w-7xl h-full flex flex-col">
        <h1 className="text-2xl font-semibold text-slate-100 mb-6">Promoters Data</h1>
        <div className="overflow-hidden rounded-xl bg-slate-800 border border-slate-700 flex flex-col flex-1">
          <div className="overflow-x-auto p-4 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-slate-800 [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-500">
            <table className="min-w-full divide-y divide-slate-700/50 text-sm text-left text-slate-400">
              <thead className="bg-transparent text-slate-300">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider uppercase text-xs">S.No</th>
                  <th className="px-6 py-4 font-semibold tracking-wider uppercase text-xs">Promoter Name</th>
                  <th className="px-6 py-4 font-semibold tracking-wider uppercase text-xs">Store Name</th>
                  <th className="px-6 py-4 font-semibold tracking-wider uppercase text-xs">Registration Date</th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">Loading data...</td>
                  </tr>
                </tbody>
              ) : currentPromoters.length > 0 ? (
                <tbody className="divide-y divide-slate-700/50 bg-transparent text-slate-300">
                {currentPromoters.map((row, index) => {
                  let d = row.logCreatedDate || row.joinDate || row.registeredAt || row.timestamp || row.createdAt;
                  let dateStr = 'N/A';
                  if (d) {
                    const dateObj = new Date(d);
                    if (!isNaN(dateObj.getTime())) {
                      dateStr = dateObj.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    }
                  }
                  
                  return (
                    <tr key={row._id || row.id || index} className="hover:bg-slate-700/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-200">{row.name || row.promoterName || row.username || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.storeName || row.store?.name || row.store || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{dateStr}</td>
                    </tr>
                  );
                })}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">No promoters found for the selected date range.</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          {filteredPromoters?.length > 0 && (
            <div className="flex items-center justify-between bg-transparent px-6 py-5 mt-auto border-t border-slate-700/50">
              <div className="flex flex-1 justify-between sm:hidden">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600 disabled:opacity-50 transition-colors border-none">Previous</button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="relative ml-3 inline-flex items-center rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600 disabled:opacity-50 transition-colors border-none">Next</button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Showing <span className="font-medium text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-200">{Math.min(currentPage * itemsPerPage, filteredPromoters.length)}</span> of{' '}
                    <span className="font-medium text-slate-200">{filteredPromoters.length}</span> results
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="rounded-md border border-slate-600 bg-slate-700 text-slate-300 py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                  <nav className="isolate inline-flex space-x-2" aria-label="Pagination">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center rounded-md px-2 py-2 text-slate-400 bg-slate-700 hover:bg-slate-600 hover:text-slate-200 focus:z-20 disabled:opacity-50 transition-colors border-none">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="relative inline-flex items-center rounded-md px-2 py-2 text-slate-400 bg-slate-700 hover:bg-slate-600 hover:text-slate-200 focus:z-20 disabled:opacity-50 transition-colors border-none">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
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

export default Promoters;