import React, { useState, useEffect } from 'react';
import { Search, Filter, Copy, ExternalLink, Trash2, LayoutDashboard, Link2, Settings, LogOut, Edit2, X, Save, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListLink = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [editCustomSlug, setEditCustomSlug] = useState('');
  const navigate = useNavigate()

  const API_BASE_URL = 'http://localhost:8082/api/v1'; 

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch(`${API_BASE_URL}/links`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch links');

      const data = await response.json();
      if (data.success) {
        console.log(data.data)
        setLinks(data.data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
      alert('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const itemsPerPage = 10;

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginatedLinks = filteredLinks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalFilteredPages = Math.ceil(filteredLinks.length / itemsPerPage);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const deleteLink = async (slug) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/links/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Link deleted successfully');
        fetchLinks(); 
      } else {
        alert(data.message || 'Failed to delete link');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link');
    }
  };

  const startEdit = (link) => {
    setEditingLink(link);
    setEditUrl(link.original_url || '');
    setEditCustomSlug('');
  };

  const cancelEdit = () => {
    setEditingLink(null);
    setEditUrl('');
    setEditCustomSlug('');
  };

  const saveEdit = async () => {
    if (!editUrl.trim()) {
      alert('Original URL cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const slug = editingLink.shortUrl.split('/').pop();

      const body = {
        originalUrl: editUrl.trim(),
        ...(editCustomSlug.trim() && { customSlug: editCustomSlug.trim() })
      };

      const response = await fetch(`${API_BASE_URL}/links/${slug}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.success) {
        alert('Link updated successfully');
        cancelEdit();
        fetchLinks(); 
      } else {
        alert(data.message || 'Failed to update link');
      }
    } catch (error) {
      console.error('Error updating link:', error);
      alert('Failed to update link');
    }
  };

  async function handleLogout() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch("http://localhost:8082/api/v1/auth/logount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Logout error:", data.message);
      }

    } catch (error) {
      console.error("Logout failed:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <img src="iconnew.png" alt="" />
                <span className="text-xl font-semibold text-gray-900">Koda Shortlink</span>
              </div>

              <nav className="hidden md:flex space-x-1">
                <button
                  onClick={() => {
                    navigate("/dashboard")
                    setActiveTab('dashboard')
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard/list")
                    setActiveTab('dashboard/list')
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard/list'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Links
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard/profile")
                    setActiveTab('dashboard/profile')
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard/profile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Settings
                </button>
                <button
              onClick={()=> {
                handleLogout()
              }}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

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

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
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
                      Clicks
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
                  {paginatedLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                            {link.shortUrl}
                          </a>
                          <button
                            onClick={() => copyToClipboard("http://localhost:8082/" + link.shortUrl)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 max-w-xs">
                          <span className="text-gray-600 truncate">{link.originalUrl}</span>
                          <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {link.totalClicks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {link.updatedAt ? new Date(link.updatedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${link.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          {link.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEdit(link)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteLink(link.shortUrl.split('/').pop())}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {paginatedLinks.length} of {filteredLinks.length} links
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
                  Page {currentPage} of {totalFilteredPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalFilteredPages, currentPage + 1))}
                  disabled={currentPage === totalFilteredPages || totalFilteredPages === 0}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Link</h2>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short URL
                </label>
                <input
                  type="text"
                  value={editingLink.shortUrl}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original URL *
                </label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListLink;