import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle, Upload, Loader2 } from 'lucide-react';

const VerificationPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [docUrl, setDocUrl] = useState('');
    const [status, setStatus] = useState(user.verificationStatus || 'unsubmitted');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // In a real app, this would be a file upload to S3 returning a URL
            await axios.post('/api/auth/verify', { docUrl }, config);
            setStatus('pending');
            alert('Verification documents submitted successfully!');
            navigate('/landlord');
        } catch (error) {
            console.error("Verification failed", error);
            alert('Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <div className="text-center mb-8">
                <ShieldAlert className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900">Identity Verification</h1>
                <p className="mt-2 text-gray-600">
                    To maintain a safe community, we require all landlords to verify their identity before publishing properties.
                </p>
            </div>

            {status === 'verified' ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center justify-center text-green-700">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    <span className="font-medium">Your account is fully verified!</span>
                </div>
            ) : status === 'pending' ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
                    <h3 className="text-lg font-medium text-yellow-800">Verification Pending</h3>
                    <p className="mt-1 text-sm text-yellow-600">
                        Our team is reviewing your documents. This usually takes 24 hours.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload ID / Passport / Title Deed
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 justify-center">
                                    {/* Stubbed File Input for now - simulated by text */}
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                        <span>Enter Document URL (Stub)</span>
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            </div>
                        </div>
                        <input
                            type="text"
                            className="w-full mt-4 p-2 border rounded"
                            placeholder="https://example.com/my-id-card.png"
                            required
                            value={docUrl}
                            onChange={(e) => setDocUrl(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit for Verification'}
                    </button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                        By submitting, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </form>
            )}
        </div>
    );
};

export default VerificationPage;
