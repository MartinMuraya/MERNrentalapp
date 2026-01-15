import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useParams, Link } from 'react-router-dom';
import { useRef } from 'react';
import { Loader2, Users, MapPin, CheckCircle, Copy, Link as LinkIcon, UserPlus } from 'lucide-react';

const PropertyDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`/api/properties/${id}`, config);
                setProperty(data);
            } catch (error) {
                console.error("Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id, user.token]);

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (!property) return <div className="p-10">Property not found</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{property.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{property.location}</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900">{property.status}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900 text-justify">{property.description}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Amenities</dt>
                            <dd className="mt-1 text-sm text-gray-900 flex flex-wrap gap-2">
                                {property.amenities.map(a => <span key={a} className="bg-gray-100 px-2 py-1 rounded">{a}</span>)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Units & Tenants</h3>
                    {/* Placeholder for Add Unit Logic if separate */}
                </div>
                <ul className="divide-y divide-gray-200">
                    {property.units.map(unit => (
                        <UnitItem key={unit._id} unit={unit} propertyId={property._id} userToken={user.token} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PropertyDetails;

const UnitItem = ({ unit, propertyId, userToken }) => {
    const [inviteLink, setInviteLink] = useState(unit.inviteCode ? `http://localhost:5173/join/${unit.inviteCode}` : null);
    const [generating, setGenerating] = useState(false);

    const generateInvite = async () => {
        setGenerating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userToken}` } };
            const { data } = await axios.post(`/api/properties/${propertyId}/units/${unit._id}/invite`, {}, config);
            setInviteLink(data.inviteLink);
        } catch (error) {
            console.error("Error generating invite", error);
            alert("Failed to generate invite link");
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        alert("Invite link copied!");
    };

    return (
        <li className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-indigo-600 truncate">
                        Unit {unit.unitNumber} ({unit.type})
                    </p>
                    <p className="text-sm text-gray-500">
                        Rent: KES {unit.rentAmount.toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${unit.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {unit.status}
                    </span>

                    {unit.status === 'available' && (
                        <div className="flex space-x-2 ml-4">
                            <Link
                                to={`/landlord/properties/${propertyId}/assign/${unit._id}`}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                                <UserPlus className="h-3 w-3 mr-1" /> Assign
                            </Link>

                            {inviteLink ? (
                                <button
                                    onClick={copyToClipboard}
                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                    title="Copy Invite Link"
                                >
                                    <Copy className="h-3 w-3 mr-1" /> Copy Link
                                </button>
                            ) : (
                                <button
                                    onClick={generateInvite}
                                    disabled={generating}
                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
                                >
                                    {generating ? <Loader2 className="animate-spin h-3 w-3" /> : <LinkIcon className="h-3 w-3 mr-1" />}
                                    {generating ? '' : 'Get Link'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {inviteLink && unit.status === 'available' && (
                <div className="mt-1 text-xs text-gray-400 pl-1">
                    Invite: {inviteLink}
                </div>
            )}
        </li>
    );
};
