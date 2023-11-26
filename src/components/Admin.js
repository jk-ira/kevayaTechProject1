import { useState, useEffect } from "react";
import { adminFirebaseLogin } from "../firebase-backend/authentication"
import Loading from './Loading';
import useAdminCheck from "../other/adminCheck";

const Admin = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    //admin login check
    const { isAdminLoggedIn, isLoading } = useAdminCheck();

    useEffect(() => {
        if(isAdminLoggedIn){
            window.location.href = "/admin-dashboard"
        }
    },[isAdminLoggedIn])

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const adminLogin = (e)=>{
        e.preventDefault();
        adminFirebaseLogin(email, password);
    }

    return (
        <>
            <form className="admin-login-form">
                <h1>Admin Login</h1>
                <input type="email" placeholder="Admin Email Address" onChange={handleEmailChange}/> <br />
                <input type="password" placeholder="Admin Password"  onChange={handlePasswordChange} />
                <input type="submit" value="Login" onClick={adminLogin}/>
            </form>
            { isLoading && <Loading /> }
        </>
    );
}

export default Admin;