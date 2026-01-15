import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const PropertyApprovals = () => {
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProperties = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/admin/properties/pending', config);
            setProperties(data);
        } catch (error) {
            console.error("Error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [user.token]);

    const handleAction = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/admin/properties/${id}/status`, { status }, config);
            fetchProperties();
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Property Approvals</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Review pending property listings</p>
            </div>
            <div className="border-t border-gray-200">
                {properties.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No pending properties.</div>
                ) : (
                    <ul role="list" className="divide-y divide-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        {properties.map((p) => (
                            <li key={p._id} className="border rounded-lg p-4 shadow-sm">
                                <h4 className="font-bold text-lg text-gray-900">{p.title}</h4>
                                <p className="text-sm text-gray-500">{p.location}</p>
                                <p className="text-sm text-gray-600 mt-2">{p.description}</p>
                                <div className="text-xs text-gray-400 mt-2">Landlord: {p.landlordId?.name} ({p.landlordId?.email})</div>

                                <div className="mt-4 flex justify-end space-x-3">
                                    <button
                                        onClick={() => handleAction(p._id, 'approved')}
                                        className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(p._id, 'rejected')}
                                        className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
                                    >
                                        <XCircle className="w-4 h-4 mr-1" /> Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default PropertyApprovals;
