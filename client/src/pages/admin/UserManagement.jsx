import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Check, X } from 'lucide-react';

const UserManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/admin/users', config);
            setUsers(data);
        } catch (error) {
            console.error("Error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user.token]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/admin/users/${id}`, { status: newStatus }, config);
            fetchUsers(); // Refresh
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage Landlords and Tenants</p>
            </div>
            <div className="border-t border-gray-200">
                <ul role="list" className="divide-y divide-gray-200">
                    {users.map((u) => (
                        <li key={u._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-blue-600 truncate">{u.name}</div>
                                    <div className="text-sm text-gray-500">{u.email} | {u.role}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {u.status}
                                    </span>
                                    {u.role !== 'admin' && (
                                        <>
                                            {u.status !== 'active' && (
                                                <button onClick={() => handleStatusChange(u._id, 'active')} className="text-green-600 hover:text-green-900 mx-1">
                                                    <Check size={18} />
                                                </button>
                                            )}
                                            {u.status === 'active' && (
                                                <button onClick={() => handleStatusChange(u._id, 'inactive')} className="text-red-600 hover:text-red-900 mx-1">
                                                    <X size={18} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserManagement;
