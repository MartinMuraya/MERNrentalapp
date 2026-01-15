import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Home, Plus, Loader2, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';
import MaintenanceList from '../../components/MaintenanceList';

const LandlordDashboard = () => {
    const { user } = useAuth();
    const isVerified = user.isVerified; // Assuming updated context with user.isVerified
    const verificationStatus = user.verificationStatus || 'unsubmitted';
    const [properties, setProperties] = useState([]);
    const [stats, setStats] = useState({
        totalProperties: 0,
        totalUnits: 0,
        occupiedUnits: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/properties/my', config);
                setProperties(data);

                // Calculate stats
                let units = 0;
                let occupied = 0;
                data.forEach(p => {
                    units += p.units.length;
                    occupied += p.units.filter(u => u.status === 'occupied').length;
                });
                setStats({
                    totalProperties: data.length,
                    totalUnits: units,
                    occupiedUnits: occupied
                });

            } catch (error) {
                console.error("Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.token]);

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Landlord Dashboard</h1>
                {isVerified ? (
                    <Link to="/landlord/properties/add" className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" /> Add Property
                    </Link>
                ) : (
                    <button disabled className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed">
                        <Plus className="h-4 w-4 mr-2" /> Add Property (Verify First)
                    </button>
                )}
            </div>

            {!isVerified && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Your account is not verified yet. You cannot publish properties until verification is complete.
                                <Link to="/landlord/verify" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-2">
                                    {verificationStatus === 'pending' ? 'Check Status' : 'Complete Verification'}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-gray-500 truncate">My Properties</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalProperties}</dd>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Units</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalUnits}</dd>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-gray-500 truncate">Occupancy Rate</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {stats.totalUnits > 0 ? Math.round((stats.occupiedUnits / stats.totalUnits) * 100) : 0}%
                    </dd>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Properties</h3>
                        <Link to="/landlord/properties" className="text-sm text-blue-600 hover:text-blue-500">View All</Link>
                    </div>
                    {/* ... (Existing Property List Logic) ... */}
                    <ul className="divide-y divide-gray-200">
                        {properties.slice(0, 5).map((property) => (
                            <li key={property._id} className="px-4 py-4 hover:bg-gray-50 transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                            <Home className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{property.title}</p>
                                            <p className="text-sm text-gray-500">{property.location}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {property.status}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {properties.length === 0 && <li className="px-4 py-8 text-center text-gray-500">No properties.</li>}
                    </ul>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 bg-orange-50">
                        <h3 className="text-lg leading-6 font-medium text-orange-900 flex items-center">
                            <Wrench className="h-5 w-5 mr-2" /> Maintenance Requests
                        </h3>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto">
                        <MaintenanceList isLandlord={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LandlordDashboard;
