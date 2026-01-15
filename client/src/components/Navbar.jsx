import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };



    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-blue-600">RentalMS</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700 hidden sm:block">Welcome, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
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
