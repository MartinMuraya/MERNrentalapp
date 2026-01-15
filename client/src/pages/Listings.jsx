const Listings = () => {
    // Placeholder data
    const listings = [
        { id: 1, title: 'Modern Apartment in Kilimani', price: 'KES 55,000', location: 'Kilimani, Nairobi', beds: 2, baths: 2, image: 'https://via.placeholder.com/300' },
        { id: 2, title: 'Spacious House in Karen', price: 'KES 120,000', location: 'Karen, Nairobi', beds: 4, baths: 3, image: 'https://via.placeholder.com/300' },
        { id: 3, title: 'Cozy Studio in Westlands', price: 'KES 35,000', location: 'Westlands, Nairobi', beds: 1, baths: 1, image: 'https://via.placeholder.com/300' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Available Properties</h2>
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                    {listings.map((property) => (
                        <div key={property.id} className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-w-3 aspect-h-2 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-48">
                                <img src={property.image} alt={property.title} className="w-full h-full object-center object-cover sm:w-full sm:h-full" />
                            </div>
                            <div className="flex-1 p-4 space-y-2 flex flex-col">
                                <h3 className="text-sm font-medium text-gray-900">
                                    <a href="#">
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        {property.title}
                                    </a>
                                </h3>
                                <p className="text-sm text-gray-500">{property.location}</p>
                                <div className="flex-1 flex flex-col justify-end">
                                    <p className="text-lg font-medium text-blue-600">{property.price}/mo</p>
                                    <p className="text-sm text-gray-500 mt-1">{property.beds} Beds • {property.baths} Baths</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Listings;
