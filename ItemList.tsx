import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Block, BlockchainService } from '../blockchain';

interface ItemListProps {
  items: Block[];
  user: any;
  setItems: (items: Block[]) => void;
}

export function ItemList({ items, user, setItems }: ItemListProps) {
  const [editingItem, setEditingItem] = useState<Block | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const blockchain = new BlockchainService();
      blockchain.removeBlock(id);
      setItems(blockchain.getChain());
    }
  };

  const handleUpdate = (e: React.FormEvent, item: Block) => {
    e.preventDefault();
    const blockchain = new BlockchainService();
    blockchain.updateBlock(item.data.id, item.data);
    setItems(blockchain.getChain());
    setEditingItem(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.data.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {item.data.imageUrl && (
            <img
              src={item.data.imageUrl}
              alt={item.data.title}
              className="w-full h-48 object-cover"
            />
          )}
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-block px-2 py-1 text-sm rounded ${
                  item.data.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.data.type === 'lost' ? 'Lost' : 'Found'}
                </span>
                <h3 className="mt-2 text-xl font-semibold">{item.data.title}</h3>
              </div>
              
              {item.data.userId === user.id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.data.id)}
                    className="p-2 hover:bg-gray-100 rounded-full text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="mt-2 text-gray-600">{item.data.description}</p>
            
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p>📍 {item.data.location}</p>
              <p>📅 {new Date(item.data.date).toLocaleDateString()}</p>
              <p>👤 {item.data.userContact}</p>
            </div>

            {editingItem?.data.id === item.data.id && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                  <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
                  <form onSubmit={(e) => handleUpdate(e, editingItem)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={editingItem.data.title}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, title: e.target.value }
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={editingItem.data.description}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, description: e.target.value }
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={editingItem.data.location}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, location: e.target.value }
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Image URL</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={editingItem.data.imageUrl}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, imageUrl: e.target.value }
                        })}
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setEditingItem(null)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}