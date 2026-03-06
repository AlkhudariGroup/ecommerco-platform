
'use client';
import Link from 'next/link';
import { redirect } from 'next/navigation';

  
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-white rounded-lg shadow border">
          <div className="text-gray-500">Total Clients</div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-2xl font-bold">0</p>
        </div>
          <div className="text-gray-500">Active Agents</div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-2xl font-bold">0</p>
        </div>
          <div className="text-gray-500">Monthly Revenue</div>
          <div className="text-2xl font-bold">$0.00</div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow border">
          <div className="text-gray-500">Conversations Today</div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-2xl font-bold">$0.00</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Clients</h2>
              <Link href="#" className="px-3 py-2 bg-slate-900 text-white rounded">Add Client</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="p-2">Client</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Plan</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2">—</td>
                    <td className="p-2">—</td>
                    <td className="p-2">free</td>
                    <td className="p-2">inactive</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">AI Agents</h2>
              <Link href="#" className="px-3 py-2 bg-slate-900 text-white rounded">Create Agent</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="p-2">Agent</th>
                    <th className="p-2">Client</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2">—</td>
                    <td className="p-2">—</td>
                    <td className="p-2">inactive</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Billing</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>MRR</span>
                <span className="font-semibold">$0</span>
              </div>
              <div className="flex justify-between">
                <span>Active Subscriptions</span>
                <span className="font-semibold">0</span>
              </div>
              <Link href="#" className="inline-block mt-2 px-3 py-2 bg-slate-900 text-white rounded">Open Billing</Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <div className="h-32 bg-gray-100 rounded grid place-items-center text-gray-500 text-sm">Chart</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
