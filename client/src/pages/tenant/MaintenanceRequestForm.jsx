import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Wrench, Camera } from 'lucide-react';

const MaintenanceRequestForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [lease, setLease] = useState(null);
    const [loadingLease, setLoadingLease] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        issue: '',
        description: '',
        priority: 'medium',
        photoUrl: ''
    });

    useEffect(() => {
        const fetchLease = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/tenant/lease', config);
                setLease(data);
            } catch (error) {
                console.error("Error fetching lease", error);
            } finally {
                setLoadingLease(false);
            }
        };
        fetchLease();
    }, [user.token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if (!lease) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                ...formData,
                propertyId: lease.propertyId._id,
                unitId: lease.unitId
            };
            await axios.post('/api/maintenance', payload, config);
            alert('Request submitted successfully!');
            navigate('/tenant');
        } catch (error) {
            console.error(error);
            alert('Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingLease) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (!lease) return <div className="p-10 text-center">You need an active lease to report maintenance issues.</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <div className="flex items-center mb-6">
                <Wrench className="h-8 w-8 text-orange-500 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Report Maintenance Issue</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Issue Title</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2"
                        placeholder="e.g. Leaking Faucet"
                        value={formData.issue}
                        onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        rows="4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2"
                        placeholder="Please describe the problem in detail..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Photo Evidence</label>
                        <div className="mt-1 flex items-center">
                            <Camera className="h-5 w-5 text-gray-400 mr-2" />
                            <input
                                type="text"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2"
                                placeholder="http://image-url.com (Stub)"
                                value={formData.photoUrl}
                                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit Request'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MaintenanceRequestForm;
