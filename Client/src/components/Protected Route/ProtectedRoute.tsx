import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface AllowedRoleType {
    allowedRoles:string[]
}

const ProtectedRoute: React.FC<AllowedRoleType> = ({allowedRoles}) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.user);
    const role = useSelector((state:RootState)=>state.userDetails.role)
    const navigate = useNavigate();
    const authorized = role.find(role => allowedRoles.includes(role))    
    useEffect(() => {
        if(authorized){
            <Outlet/>
        }else if(isAuthenticated){
            navigate('/unauthorized')
        }else{
            navigate('/')
        }
        // if (!isAuthenticated) {
        //     navigate('/')
        // }
    }, [isAuthenticated, navigate,authorized]);

    return authorized ?<Outlet/>: null;

    

}

export default ProtectedRoute;


