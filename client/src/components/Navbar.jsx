import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };



    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center mr-6">
                            <span className="text-2xl font-bold text-blue-600">RentalMS</span>
                        </Link>
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <Link to="/" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location.pathname === '/' ? 'border-b-2 border-blue-600 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'}`}>
                                Home
                            </Link>
                            <Link to="/listings" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location.pathname === '/listings' ? 'border-b-2 border-blue-600 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'}`}>
                                Listings
                            </Link>
                            <Link to="/contact" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location.pathname === '/contact' ? 'border-b-2 border-blue-600 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'}`}>
                                Contact
                            </Link>
                            {user && (
                                <Link to="/dashboard" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location.pathname === '/dashboard' ? 'border-b-2 border-blue-600 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'}`}>
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700 hidden sm:block">Welcome, {user.name}</span>

                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-medium transition-all duration-200 shadow-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Login</Link>
                                <Link to="/register" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
