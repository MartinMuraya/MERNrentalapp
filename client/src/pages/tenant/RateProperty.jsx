import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Star, Loader2, CheckCircle } from 'lucide-react';

const RateProperty = () => {
    const { user } = useAuth();
    const [availableProperties, setAvailableProperties] = useState([]);
    const [myRatings, setMyRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [availableRes, ratingsRes] = await Promise.all([
                axios.get('/api/ratings/available', config),
                axios.get('/api/ratings/my', config)
            ]);
            setAvailableProperties(availableRes.data);
            setMyRatings(ratingsRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/ratings', {
                propertyId: selectedProperty._id,
                rating,
                review
            }, config);

            setSuccess(true);
            setSelectedProperty(null);
            setRating(0);
            setReview('');

            // Refresh data
            fetchData();

            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit rating');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (currentRating, interactive = false) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const filled = interactive ? (hoverRating || rating) >= i : currentRating >= i;
            stars.push(
                <Star
                    key={i}
                    size={interactive ? 32 : 20}
                    className={`${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer transition-colors' : ''}`}
                    onClick={interactive ? () => setRating(i) : undefined}
                    onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
                    onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                />
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="p-10 flex justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Rate Properties</h1>
                <p className="mt-1 text-sm text-gray-500">Share your experience with properties you've lived in</p>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">Rating submitted successfully!</span>
                </div>
            )}

            {/* Rate New Property */}
            <div className="bg-white shadow sm:rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Submit a Rating</h2>

                {availableProperties.length === 0 ? (
                    <p className="text-gray-500">You have rated all properties you've lived in.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Property</label>
                            <select
                                value={selectedProperty?._id || ''}
                                onChange={(e) => {
                                    const prop = availableProperties.find(p => p._id === e.target.value);
                                    setSelectedProperty(prop);
                                    setRating(0);
                                    setReview('');
                                    setError('');
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            >
                                <option value="">Choose a property...</option>
                                {availableProperties.map((property) => (
                                    <option key={property._id} value={property._id}>
                                        {property.title} - {property.location}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedProperty && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(rating, true)}
                                    </div>
                                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Review (Optional)</label>
                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        rows={4}
                                        maxLength={500}
                                        placeholder="Share your experience..."
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">{review.length}/500 characters</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Rating'
                                    )}
                                </button>
                            </>
                        )}
                    </form>
                )}
            </div>

            {/* My Ratings */}
            <div className="bg-white shadow sm:rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">My Ratings</h2>

                {myRatings.length === 0 ? (
                    <p className="text-gray-500">You haven't submitted any ratings yet.</p>
                ) : (
                    <div className="space-y-4">
                        {myRatings.map((rating) => (
                            <div key={rating._id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{rating.propertyId?.title}</h3>
                                        <p className="text-sm text-gray-500">{rating.propertyId?.location}</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(rating.rating)}
                                    </div>
                                </div>
                                {rating.review && (
                                    <p className="mt-2 text-sm text-gray-700">{rating.review}</p>
                                )}
                                <p className="mt-2 text-xs text-gray-400">
                                    Submitted on {new Date(rating.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RateProperty;
