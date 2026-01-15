import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const MaintenanceList = ({ isLandlord }) => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const endpoint = isLandlord
                    ? '/api/maintenance/landlord'
                    : '/api/maintenance/my';

                const { data } = await axios.get(endpoint, config);
                setRequests(data);
            } catch (error) {
                console.error("Error fetching requests", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [user.token, isLandlord]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/maintenance/${id}`, { status: newStatus }, config);

            // Optimistic update
            setRequests(requests.map(req => req._id === id ? { ...req, status: newStatus } : req));
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>;

    if (requests.length === 0) return <div className="p-4 text-gray-500 text-center">No maintenance requests found.</div>;

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800'
    };

    return (
        <div className="space-y-4">
            {requests.map((req) => (
                <div key={req._id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-900">{req.issue}</h3>
                            <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <span className={`px-2 py-0.5 rounded-full font-medium ${req.priority === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>
                                    {req.priority.toUpperCase()}
                                </span>
                                <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                <span>• {req.propertyId.title}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[req.status] || 'bg-gray-100'}`}>
                                {req.status.replace('_', ' ').toUpperCase()}
                            </span>

                            {isLandlord && (
                                <select
                                    className="text-xs border rounded p-1 bg-white cursor-pointer"
                                    value={req.status}
                                    onChange={(e) => handleStatusUpdate(req._id, e.target.value)}
                                >
                                    <option value="pending">Mark Pending</option>
                                    <option value="in_progress">Mark In Progress</option>
                                    <option value="resolved">Mark Resolved</option>
                                    <option value="rejected">Reject</option>
                                </select>
                            )}
                        </div>
                    </div>
                    {req.photoUrl && (
                        <div className="mt-3">
                            <a href={req.photoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" /> View Photo Evidence
                            </a>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MaintenanceList;
