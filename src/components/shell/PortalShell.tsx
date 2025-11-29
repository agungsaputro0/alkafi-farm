// src/components/shell/HomeShell.tsx
import React, { useState } from 'react';
import HomeNavbar from '../organisms/HomeNavbar';
import PortalSidebar from '../organisms/PortalSidebar';
import { useAuth } from '../hooks/AuthContext';


type AppShellProps = {
    children: React.ReactNode;
}

const PortalShell = (props: AppShellProps) => {
    const [expanded, setExpanded] = useState(false);
    const { userName, loading } = useAuth();

    return (
        <main>
            <div className="flex flex-col bg-[url('/assets/img/bg-gradient.jpg')] bg-no-repeat bg-center bg-cover bg-fixed w-full min-h-screen overflow-y-auto">
            {/* <div className="flex flex-col bg-gradient-to-tr from-[#0f172a] via-[#0f4c5c] to-[#1b6a4a] bg-no-repeat bg-center bg-cover bg-fixed w-full min-h-screen overflow-y-auto"> */}

                <HomeNavbar userName={userName} expanded={expanded} />
    
                {/* Menambahkan kondisi loading */}
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <p>Loading...</p> {/* Atau bisa menggunakan komponen spinner */}
                    </div>
                ) : (
                    <div className="flex flex-1">
                        <div 
                            className={`sidebar ${expanded ? 'sidebar-expanded' : ''} bg-transparent shadow-md h-full`}
                            onMouseEnter={() => setExpanded(true)}
                            onMouseLeave={() => setExpanded(false)}
                        >
                            <PortalSidebar />
                        </div>
    
                        {/* Menambahkan class dinamis untuk konten */}
                        <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${expanded ? 'content-expanded' : 'content-collapsed'}`}>
                             {props.children}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default PortalShell;
