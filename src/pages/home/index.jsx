import { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shortLink, setShortLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate()

  const validateUrl = (urlString) => {
    if (!urlString.trim()) {
      return 'Please enter a URL';
    }

    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      return 'URL must start with http:// or https://';
    }

    try {
      const urlObj = new URL(urlString);
      if (!urlObj.hostname) {
        return 'Invalid URL format';
      }
    } catch {
      return 'Invalid URL format';
    }

    return null;
  };

  const handleShorten = async () => {
    const validationError = validateUrl(url);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setShortLink(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please sign in to shorten links');
        setLoading(false);
        return;
      }

      const requestBody = {
        originalUrl: url.trim()
      };


      const response = await fetch('http://localhost:8082/api/v1/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to shorten URL');
      }

      setShortLink(data.Data);
      setUrl('');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortLink?.short_url) {
      try {
        const fullUrl = `http://localhost:8082/${shortLink.short_url}`;
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleShorten();
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
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src="iconnew.png" alt="" />
              <span className="text-xl font-semibold text-gray-900">Koda Shortlink</span>
            </div>
            <div className="flex items-center gap-4">
              {localStorage.getItem('token') ? (
                <button
                  className="text-gray-700 hover:text-gray-900 font-medium"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
              )}

              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium" onClick={() => {
                navigate("/dashboard")
              }}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Shorten Your Links,
          </h1>
          <h1 className="text-5xl font-bold text-blue-600 mb-6">
            Amplify Your Reach
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Create short, memorable links in seconds. Track clicks, manage campaigns,
            and optimize your digital presence.
          </p>

          <div className="max-w-2xl mx-auto mb-5">
            <div className="flex gap-3 mb-4">
              <input
                type="url"
                placeholder="https://example.com/your-long-url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="flex-1 px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleShorten}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Shortening...' : 'Shorten'}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>

          {shortLink && (
            <div className="max-w-2xl mx-auto mb-20 bg-white border border-gray-200 rounded-lg shadow-md p-8">
              <button className='flex justify-center text-red-500' onClick={()=> {
                setShortLink(false)
              }}>X</button>
              <p className="text-sm text-gray-500 mb-2">Your shortened URL::</p>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={`http://localhost:8082/${shortLink.short_url}`}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap flex items-center gap-2 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-left">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Generate short links instantly and share them across all your platforms in seconds.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-left">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Advanced Analytics
              </h3>
              <p className="text-gray-600">
                Track every click with detailed analytics and insights to optimize your campaigns.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-left">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Your links are protected with enterprise-grade security and 99.9% uptime.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}