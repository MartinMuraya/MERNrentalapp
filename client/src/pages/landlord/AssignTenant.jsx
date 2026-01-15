import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, UserCheck, Calendar, DollarSign } from 'lucide-react';

const AssignTenant = () => {
    const { id, unitId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        startDate: '',
        endDate: '',
        rentAmount: '',
        depositAmount: ''
    });
    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState(null);

    // Fetch unit details to verify and pre-fill rent
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`/api/properties/${id}`, config);
                const targetUnit = data.units.find(u => u._id === unitId);
                if (targetUnit) {
                    setUnit(targetUnit);
                    setFormData(prev => ({ ...prev, rentAmount: targetUnit.rentAmount }));
                }
            } catch (error) {
                console.error("Error fetching property", error);
            }
        };
        fetchProperty();
    }, [id, unitId, user.token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(
                `/api/properties/${id}/units/${unitId}/assign`,
                formData,
                config
            );
            alert('Tenant Assigned Successfully!');
            navigate(`/landlord/properties/${id}`);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Assignment Failed');
        } finally {
            setLoading(false);
        }
    };

    if (!unit) return <div className="p-10 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto" /> Loading Unit Details...</div>;

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10">
            <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <UserCheck className="mr-2 h-6 w-6" /> Assign Tenant
                </h2>
                <p className="text-blue-100 text-sm mt-1">Unit {unit.unitNumber} ({unit.type})</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tenant Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="tenant@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                    <p className="text-xs text-gray-400 mt-1">Tenant must be registered in the system first.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="startDate"
                                required
                                value={formData.startDate}
                                onChange={handleChange}
                                className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md border p-2"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rent Amount</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                name="rentAmount"
                                required
                                value={formData.rentAmount}
                                onChange={handleChange}
                                className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md border p-2"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Deposit</label>
                        <input
                            type="number"
                            name="depositAmount"
                            placeholder="0"
                            value={formData.depositAmount}
                            onChange={handleChange}
                            className="block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Assign Tenant'}
                </button>
            </form>
        </div>
    );
};

export default AssignTenant;
