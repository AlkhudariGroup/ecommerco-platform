export default function AgentOpsDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Agent Operations Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Live Conversations</h2>
              <button className="px-3 py-2 bg-slate-900 text-white rounded">Refresh</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="p-2">Customer</th>
                    <th className="p-2">Channel</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2">—</td>
                    <td className="p-2">Chat</td>
                    <td className="p-2">Waiting</td>
                    <td className="p-2">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Escalations</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-semibold">—</div>
                  <div className="text-gray-600">Reason: —</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded">View</button>
                  <button className="px-3 py-1 bg-slate-900 text-white rounded">Assign</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 border rounded">Pause Agent</button>
              <button className="w-full px-3 py-2 border rounded">Resume Agent</button>
              <button className="w-full px-3 py-2 border rounded">Sync Products</button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Notes</h2>
            <textarea className="w-full p-2 border rounded h-28" placeholder="Add internal notes..." />
            <button className="mt-3 px-3 py-2 bg-slate-900 text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
