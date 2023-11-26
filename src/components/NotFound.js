import { Link } from "react-router-dom";
const NotFound = () => {
    return ( 
        <>
            Page Not Found
            <br />
            Go to <Link to="/">Home Page</Link>.
        </>
     );
}
 
export default NotFound;