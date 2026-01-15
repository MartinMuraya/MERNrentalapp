import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Home, CreditCard, History, DollarSign, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import MaintenanceList from '../../components/MaintenanceList';

const TenantDashboard = () => {
    const { user } = useAuth();
    const [lease, setLease] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(user.phone || '');

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const leaseRes = await axios.get('/api/tenant/lease', config);
            const paymentsRes = await axios.get('/api/tenant/payments', config);

            setLease(leaseRes.data);
            setPayments(paymentsRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setPaying(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/tenant/pay', {
                leaseId: lease._id,
                amount: lease.rentAmount,
                phoneNumber
            }, config);

            alert('Payment Initiated Successfully!');
            fetchData(); // Refresh history
        } catch (error) {
            console.error(error);
            alert('Payment Failed');
        } finally {
            setPaying(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Tenant Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lease Details Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                            <Home className="mr-2 h-5 w-5 text-blue-500" /> My Home
                        </h2>
                        {lease && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active Lease</span>}
                    </div>
                    {lease ? (
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Property</label>
                                <p className="font-semibold text-gray-800">{lease.propertyId.title}</p>
                                <p className="text-sm text-gray-600">{lease.propertyId.location}</p>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Unit</label>
                                    <p className="font-medium text-gray-800">{lease.unitId}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Rent</label>
                                    <p className="font-medium text-gray-800">KES {lease.rentAmount.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Pay Rent via M-Pesa</h3>
                                <form onSubmit={handlePayment} className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="M-Pesa Phone (254...)"
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full border rounded p-2 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={paying}
                                        className="w-full bg-green-600 text-white rounded py-2 text-sm font-medium hover:bg-green-700 flex justify-center items-center"
                                    >
                                        {paying ? <Loader2 className="animate-spin h-4 w-4" /> : <><CreditCard className="h-4 w-4 mr-1" /> Pay KES {lease.rentAmount.toLocaleString()}</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No active lease found.</p>
                            <p className="text-sm mt-2">Contact your landlord to be assigned to a unit.</p>
                        </div>
                    )}
                </div>

                {/* Payment History Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <History className="mr-2 h-5 w-5 text-indigo-500" /> Payment History
                    </h2>
                    {/* ... (Existing Payment History) ... */}
                    <div className="overflow-hidden">
                        {payments.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {payments.map(payment => (
                                    <li key={payment._id} className="py-3 flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-medium text-gray-900">{payment.paymentType}</p>
                                            <p className="text-gray-500 text-xs">{new Date(payment.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">KES {payment.amount.toLocaleString()}</p>
                                            <span className={`text-xs ${payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No payments yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Maintenance Section */}
            <div className="bg-white shadow rounded-lg p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <Wrench className="mr-2 h-5 w-5 text-orange-500" /> Maintenance Requests
                    </h2>
                    <Link to="/tenant/maintenance/new" className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium hover:bg-orange-200">
                        + New Request
                    </Link>
                </div>
                <MaintenanceList isLandlord={false} />
            </div>
        </div>
    );
};
export default TenantDashboard;
