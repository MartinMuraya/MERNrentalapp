import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Home, Star, Loader2 } from 'lucide-react';

const Listings = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const { data } = await axios.get('/api/properties/public');
                setProperties(data);
            } catch (error) {
                console.error("Error fetching listings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        const numRating = parseFloat(rating);
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={16}
                    className={i <= numRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen py-12 flex justify-center items-center">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Available Properties</h2>
                    <p className="mt-2 text-gray-600">Find your perfect rental home</p>
                </div>

                {properties.length === 0 ? (
                    <div className="text-center py-12">
                        <Home className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-gray-500 text-lg">No properties available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                        {properties.map((property) => {
                            const availableUnits = property.units?.filter(u => u.status === 'available').length || 0;
                            const priceRange = property.units?.length > 0
                                ? `KES ${Math.min(...property.units.map(u => u.rentAmount)).toLocaleString()} - ${Math.max(...property.units.map(u => u.rentAmount)).toLocaleString()}`
                                : 'Contact for pricing';

                            return (
                                <div key={property._id} className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="aspect-w-3 aspect-h-2 bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:opacity-90 sm:aspect-none sm:h-48 flex items-center justify-center">
                                        <Home className="h-16 w-16 text-blue-400" />
                                    </div>
                                    <div className="flex-1 p-4 space-y-2 flex flex-col">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                                {property.title}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {property.location}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                                            {property.description || 'No description available'}
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center">
                                                {renderStars(property.averageRating)}
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {property.averageRating > 0 ? `${property.averageRating} (${property.totalRatings})` : 'No ratings yet'}
                                            </span>
                                        </div>

                                        <div className="pt-3 border-t border-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-lg font-semibold text-blue-600">{priceRange}</p>
                                                    <p className="text-xs text-gray-500">/month</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">{availableUnits} Available</p>
                                                    <p className="text-xs text-gray-500">of {property.units?.length || 0} units</p>
                                                </div>
                                            </div>
                                        </div>

                                        {property.amenities && property.amenities.length > 0 && (
                                            <div className="flex flex-wrap gap-1 pt-2">
                                                {property.amenities.slice(0, 3).map((amenity, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                        {amenity}
                                                    </span>
                                                ))}
                                                {property.amenities.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                        +{property.amenities.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Listings;
