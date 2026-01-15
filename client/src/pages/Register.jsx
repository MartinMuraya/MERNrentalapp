import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, Briefcase, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'tenant', // Default role
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        const result = await register(formData);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600">Join our rental management platform</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative mb-3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative mb-3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative mb-3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative mb-3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                name="phone"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative mb-3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Briefcase className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                name="role"
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="tenant">Tenant</option>
                                <option value="landlord">Landlord</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
