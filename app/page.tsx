import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Better Voice</h1>
      <p className="text-xl mb-8">Customer Feedback Made Simple</p>
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </Link>
        <Link 
          href="/signup" 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
