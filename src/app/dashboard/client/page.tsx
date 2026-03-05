
import { auth } from '@clerk/nextjs';

export default function ClientDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* AI Agent Configuration */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">AI Agent Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Agent Name</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="My Store Agent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Personality</label>
                <select className="w-full p-2 border rounded">
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Humorous</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chat Logs */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Recent Conversations</h2>
            <p className="text-gray-500">No conversations yet.</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* WooCommerce Connection */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">WooCommerce Integration</h2>
            <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
              Connect Store
            </button>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Performance</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Messages</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span>Orders Checked</span>
                <span className="font-bold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
