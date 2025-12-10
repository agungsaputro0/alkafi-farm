// src/components/shell/HomeShell.tsx
import React, { useState } from 'react';

import { useAuth } from '../hooks/AuthContext';
import MobileBottomNav from '../organisms/MobileHomeNav';
import PekerjaNavbar from '../organisms/PekerjaNavbar';


type AppShellProps = {
    children: React.ReactNode;
}

const PekerjaShell = (props: AppShellProps) => {
    const [expanded, setExpanded] = useState(false);
    const { loading } = useAuth();

    return (
        <main>
            <div className="flex flex-col bg-[url('/assets/img/bg-homeshell.jpg')] bg-no-repeat bg-center bg-cover bg-fixed w-full min-h-screen overflow-y-auto">
            {/* <div className="flex flex-col bg-gradient-to-tr from-[#0f172a] via-[#0f4c5c] to-[#1b6a4a] bg-no-repeat bg-center bg-cover bg-fixed w-full min-h-screen overflow-y-auto"> */}

                <PekerjaNavbar />
    
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
                        </div>
    
                        {/* Menambahkan class dinamis untuk konten */}
                        <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${expanded ? 'content-expanded' : 'content-collapsed'}`}>
                             {props.children}
                        </div>
                    </div>
                )}
                <MobileBottomNav />
            </div>
        </main>
    );
};

export default PekerjaShell;
