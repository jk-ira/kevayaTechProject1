import {useLocation} from 'react-router';


const Register = () => {
    const location = useLocation();
    const pathname = location.pathname;
    console.log(pathname);

    return (
        <div className="register">
            <h1>Registration</h1>
        </div>
     );
}
 
export default Register;