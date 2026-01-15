import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Home, MapPin, Loader2 } from 'lucide-react';

const MyProperties = () => {
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/properties/my', config);
                setProperties(data);
            } catch (error) {
                console.error("Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [user.token]);

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
                <Link to="/landlord/properties/add" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Add New
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            {/* Placeholder for Image */}
                            <Home className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-gray-900 truncate">{property.title}</h3>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${property.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {property.status}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                {property.location}
                            </div>
                            <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-4">
                                <span className="text-sm font-medium text-gray-600">{property.units.length} Units</span>
                                <Link to={`/landlord/properties/${property._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Manage Units &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {properties.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You don't have any properties listed.</p>
                </div>
            )}
        </div>
    );
};

export default MyProperties;
