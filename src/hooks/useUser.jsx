import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../util/ApiEndpoints';
import AxiosConfig from "../util/AxiosConfig"
function useUser() {
    const {user,setUser,clearUser}=useContext(AppContext)
    const navigate=useNavigate();
useEffect(() => {
    if (user) {
        return;
    }

    let isMounted = true;
    const fetchUser = async () => {
        try {
            const response = await AxiosConfig.get(API_ENDPOINTS.USER_INFO);
            if (isMounted && response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error(error);
            if (isMounted) {
                clearUser();
                navigate("/login");
            }
        }
    };
    fetchUser();
    return () => {
        isMounted = false;
    };
}, [user, setUser, clearUser, navigate]);
}


export default useUser