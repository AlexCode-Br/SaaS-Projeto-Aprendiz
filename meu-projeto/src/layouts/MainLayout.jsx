import React, { useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { AuthContext } from '../contexts/AuthContext';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useContext(AuthContext);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-bg-end overflow-hidden">
            {/* Sidebar */}
            <Sidebar user={user} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Overlay para fechar a sidebar em telas pequenas */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            <div className="flex flex-col flex-1 w-full overflow-hidden">
                {/* Header */}
                <Header toggleSidebar={toggleSidebar} />

                {/* Conteúdo Principal da Página (AGORA SEM CONTAINER E MX-AUTO) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-end p-8"> {/* Removido container mx-auto px-6 */}
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;