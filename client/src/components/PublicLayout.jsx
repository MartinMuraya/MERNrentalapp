import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex flex-col">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
