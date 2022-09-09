import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

const useAuth=()=>{
    
  const { isLoggingIn, user } = useSelector(state => state.auth);

  if(isLoggingIn && user.rol == 0){
    return true
  } else {
    return false
  }
}

const AdminRoute=(props) =>{


  const auth=useAuth()

return auth ? <Outlet/> : <Navigate to="/login"/>

};

export default AdminRoute;
