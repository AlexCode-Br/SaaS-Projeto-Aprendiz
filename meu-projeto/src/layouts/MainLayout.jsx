import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-b from-bg-start to-bg-end">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Área de Conteúdo */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                
                {/* Header Principal */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    {/* NOTA DE CORREÇÃO: 
                      A principal mudança foi aqui. Removemos as classes 'container' e 'mx-auto'
                      para permitir que o conteúdo se expanda por toda a largura disponível, 
                      mantendo a fidelidade ao design do protótipo.
                    */}
                    {children}
                </main>

            </div>
        </div>
    );
};

export default MainLayout;