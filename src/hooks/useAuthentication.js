import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebase';

function useAuthentication() {
    const [userautheticated, setUserAuthenticated] = useState(null);

    useEffect(() => {
        
        const unsuscribe = auth.onAuthStateChanged(user => {
            if(user){
                setUserAuthenticated(user);
            }else{
                setUserAuthenticated(null);
            }
        })

        return () => unsuscribe();
    }, [])

    return userautheticated;
}

export default useAuthentication;