import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const ProtectedRoute = ({ children }: {children: React.ReactNode}) => {
    const router = useRouter(); 

    useEffect(() => {
        const token = localStorage.getItem("token"); 
        if(!token) {
            router.push('/')
        }
    }, [router]); 
    return <>{children}</>
}

export default ProtectedRoute; 
