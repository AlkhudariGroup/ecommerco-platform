
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  // TODO: Add role check for master admin
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Master Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="font-semibold text-gray-500">Total Clients</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="font-semibold text-gray-500">Active Agents</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="font-semibold text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">$0.00</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Client Management</h2>
        <div className="bg-white rounded-lg shadow border p-4">
          <p className="text-gray-500">No clients found.</p>
        </div>
      </div>
    </div>
  );
}
