import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const DashboardLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
