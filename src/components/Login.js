import {useLocation} from 'react-router';

const Login = () => {
    const location = useLocation();
    console.log(location.pathname); 
    return (  
        <div className="login">
            <h1>Login</h1>
        </div>
    );
}
 
export default Login;