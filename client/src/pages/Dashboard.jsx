import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'landlord') {
                navigate('/landlord');
            } else if (user.role === 'tenant') {
                navigate('/tenant');
            }
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <p className="text-gray-500 mb-2">Redirecting to your dashboard...</p>
                <p className="text-xs text-gray-400">
                    Role identified: {user?.role || 'None'} <br />
                    (If you are stuck here, please tell the assistant what you see)
                </p>
                {/* Fallback button just in case */}
                {user?.role === 'tenant' && (
                    <button onClick={() => navigate('/tenant')} className="mt-4 text-blue-500 underline text-sm">
                        Click here if not redirected
                    </button>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
