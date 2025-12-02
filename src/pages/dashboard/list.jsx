import React, { useState } from 'react';
import { Search, Filter, Copy, ExternalLink, Trash2, LayoutDashboard, Link2, Settings, LogOut } from 'lucide-react';

const ListLink = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);

  const initialLinks = [
    { id: 1, shortUrl: 'koda.link/v9hxvr', destination: 'https://example.com/page-1', visits: 981, created: '11/12/2024', status: 'active' },
    { id: 2, shortUrl: 'koda.link/lvne1z', destination: 'https://example.com/page-2', visits: 412, created: '11/27/2024', status: 'active' },
    { id: 3, shortUrl: 'koda.link/4fl6tt', destination: 'https://example.com/page-3', visits: 815, created: '11/16/2024', status: 'active' },
    { id: 4, shortUrl: 'koda.link/khnzfw', destination: 'https://example.com/page-4', visits: 804, created: '11/1/2024', status: 'active' },
    { id: 5, shortUrl: 'koda.link/cv2x7', destination: 'https://example.com/page-5', visits: 185, created: '11/17/2024', status: 'active' },
    { id: 6, shortUrl: 'koda.link/uailii', destination: 'https://example.com/page-6', visits: 703, created: '11/12/2024', status: 'active' },
    { id: 7, shortUrl: 'koda.link/5xjja5', destination: 'https://example.com/page-7', visits: 98, created: '11/22/2024', status: 'inactive' },
    { id: 8, shortUrl: 'koda.link/ilk1sy', destination: 'https://example.com/page-8', visits: 15, created: '11/16/2024', status: 'inactive' },
    { id: 9, shortUrl: 'koda.link/5sjlro', destination: 'https://example.com/page-9', visits: 256, created: '11/20/2024', status: 'active' },
    { id: 10, shortUrl: 'koda.link/why16n', destination: 'https://example.com/page-10', visits: 371, created: '11/6/2024', status: 'active' },
  ];

  const [links, setLinks] = useState(initialLinks);

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || link.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = 3;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Link2 className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900">Koda Shortlink</span>
              </div>
              <div className="hidden md:flex space-x-1">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 flex items-center space-x-2">
                  <Link2 className="w-4 h-4" />
                  <span>Links</span>
                </button>
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Management</h1>
          <p className="text-gray-600">Browse, search, and manage all your shortened links.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                          {link.shortUrl}
                        </a>
                        <button
                          onClick={() => copyToClipboard(link.shortUrl)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 max-w-xs">
                        <span className="text-gray-600 truncate">{link.destination}</span>
                        <a href={link.destination} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {link.visits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {link.created}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        link.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {link.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing 1 to 10 of 25 links
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListLink;