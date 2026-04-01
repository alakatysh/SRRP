import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            DSS System
          </Link>
          <nav>
            <Link to="/" className="hover:underline">
              Projects
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 mt-4">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        <p>&copy; {new Date().getFullYear()} Decision Support System</p>
      </footer>
    </div>
  );
}
