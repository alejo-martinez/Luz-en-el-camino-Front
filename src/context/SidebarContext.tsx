'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

interface SidebarContextType {
    showSidebar: boolean;
    setIsShown: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const [showSidebar, setShowSidebar] = useState(false);
    const pathname = usePathname();

    const setIsShown = ()=>{
        setShowSidebar(prev => !prev);
        
    }

    useEffect(()=>{
        if(showSidebar === true) setShowSidebar(false);
    },[pathname]);

    return (
        <SidebarContext.Provider value={{ setIsShown, showSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within an SidebarProvider');
    }
    return context;
};