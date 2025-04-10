'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackBoxes, setFeedbackBoxes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      setIsSupabaseConfigured(false);
      setError('Supabase is not configured. Please check your environment variables.');
      setLoading(false);
      return;
    }

    const getUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        setUser(user);

        if (user) {
          const { data, error: boxesError } = await supabase
            .from('feedback_boxes')
            .select('*')
            .eq('user_id', user.id);

          if (boxesError) throw boxesError;
          
          if (data) {
            setFeedbackBoxes(data);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600">Supabase Not Configured</h1>
          <p className="text-gray-600 mb-4">
            The Supabase integration is not properly configured. Please set up the Supabase integration in your Vercel project.
          </p>
          <Link 
            href="/" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-gray-600 mb-4">
            You need to be logged in to access the dashboard.
          </p>
          <Link 
            href="/login" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Better Voice Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
          <p className="text-gray-600">
            This is your feedback management dashboard. Create feedback boxes, generate QR codes, and view submissions.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Feedback Boxes</h2>
            <Link
              href="/dashboard/create-box"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create New Box
            </Link>
          </div>

          {feedbackBoxes.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">You don't have any feedback boxes yet.</p>
              <Link
                href="/dashboard/create-box"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create Your First Box
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbackBoxes.map((box) => (
                <div key={box.id} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">{box.name}</h3>
                  <p className="text-gray-600 mb-4">{box.description || 'No description'}</p>
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/box/${box.id}`}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/dashboard/box/${box.id}/qr`}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      QR Code
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
