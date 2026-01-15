import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AddProperty = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        amenities: '',
    });
    const [units, setUnits] = useState([
        { unitNumber: '', type: '1BHK', rentAmount: '' }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUnitChange = (index, e) => {
        const newUnits = [...units];
        newUnits[index][e.target.name] = e.target.value;
        setUnits(newUnits);
    };

    const addUnitField = () => {
        setUnits([...units, { unitNumber: '', type: '1BHK', rentAmount: '' }]);
    };

    const removeUnitField = (index) => {
        const newUnits = [...units];
        newUnits.splice(index, 1);
        setUnits(newUnits);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Convert amenities string to array
            const payload = {
                ...formData,
                amenities: formData.amenities.split(',').map(a => a.trim()),
                units: units
            };
            await axios.post('/api/properties', payload, config);
            navigate('/landlord');
        } catch (error) {
            console.error("Error creating property", error);
            // Handle error UI here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 border-b border-blue-500">
                <h2 className="text-xl font-bold text-white">Add New Property</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Property Details</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Property Title</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" rows="3" value={formData.description} onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" name="location" required value={formData.location} onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amenities (comma separated)</label>
                        <input type="text" name="amenities" placeholder="e.g. WiFi, Parking, Gym" value={formData.amenities} onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-medium text-gray-900">Units</h3>
                        <button type="button" onClick={addUnitField} className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                            + Add Another Unit
                        </button>
                    </div>

                    {units.map((unit, index) => (
                        <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-md relative group">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500">Unit No.</label>
                                <input type="text" name="unitNumber" required value={unit.unitNumber} onChange={(e) => handleUnitChange(index, e)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                            </div>
                            <div className="w-1/4">
                                <label className="block text-xs font-medium text-gray-500">Type</label>
                                <select name="type" value={unit.type} onChange={(e) => handleUnitChange(index, e)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                    <option>1BHK</option>
                                    <option>2BHK</option>
                                    <option>Studio</option>
                                    <option>Shop</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500">Rent Amount (KES)</label>
                                <input type="number" name="rentAmount" required value={unit.rentAmount} onChange={(e) => handleUnitChange(index, e)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                            </div>
                            {units.length > 1 && (
                                <button type="button" onClick={() => removeUnitField(index)} className="text-red-500 hover:text-red-700 pb-2">
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save Property'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProperty;
