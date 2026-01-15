const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">RentalMS</h3>
                        <p className="text-gray-400 text-sm">
                            Simplifying property management for landlords and tenants across Kenya.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Listings</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <p className="text-gray-400 text-sm">Nairobi, Kenya</p>
                        <p className="text-gray-400 text-sm">info@rentalms.ke</p>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Kenya Rental Management System. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
