import React, { useState, useEffect } from 'react';
import { UserCircle2, Search, PlusCircle, LogOut } from 'lucide-react';
import { Block, BlockchainService } from './blockchain';
import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [items, setItems] = useState<Block[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      setIsAuthenticated(true);
    }
    
    const blockchain = new BlockchainService();
    setItems(blockchain.getChain());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsAuthenticated(false);
    setShowProfile(false);
  };

  const filteredItems = items
    .filter(item => {
      if (filter === 'all') return true;
      return item.data.type === filter;
    })
    .filter(item =>
      item.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.data.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (!isAuthenticated) {
    return <Auth setIsAuthenticated={setIsAuthenticated} setUser={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Lost & Found Registry</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <UserCircle2 className="w-6 h-6" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showProfile ? (
          <Profile user={user} setShowProfile={setShowProfile} />
        ) : (
          <>
            {/* Search and Filter */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="pl-10 pr-4 py-2 w-full border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border rounded-lg bg-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Items</option>
                <option value="lost">Lost Items</option>
                <option value="found">Found Items</option>
              </select>
            </div>

            {/* Add New Item Button */}
            <ItemForm user={user} setItems={setItems} />

            {/* Items List */}
            <ItemList items={filteredItems} user={user} setItems={setItems} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;