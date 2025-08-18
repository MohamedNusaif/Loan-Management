'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = sessionStorage.getItem('currentUser');
    
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    if (parsedUser.userType !== 'agent') {
      router.push('/login');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
          <button 
            onClick={() => {
              sessionStorage.removeItem('currentUser');
              router.push('/login');
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Agent Portal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Customer Management</h3>
              <ul className="space-y-2">
                <li><button className="text-blue-600 hover:underline">View All Customers</button></li>
                <li><button className="text-blue-600 hover:underline">Add New Customer</button></li>
                <li><button className="text-blue-600 hover:underline">Pending Approvals</button></li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Loan Processing</h3>
              <ul className="space-y-2">
                <li><button className="text-blue-600 hover:underline">New Applications</button></li>
                <li><button className="text-blue-600 hover:underline">Approved Loans</button></li>
                <li><button className="text-blue-600 hover:underline">Rejected Loans</button></li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Reports</h3>
              <ul className="space-y-2">
                <li><button className="text-blue-600 hover:underline">Daily Summary</button></li>
                <li><button className="text-blue-600 hover:underline">Monthly Performance</button></li>
                <li><button className="text-blue-600 hover:underline">Customer Statistics</button></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}