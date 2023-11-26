import adminSVG from '../assets/svgs/admin2.svg'
const ADW = () => {
    return (
        <>
            <div className="center-div">
                <p>Welcome to the admin dashboard.</p>
                <img className='admin-icon' src={adminSVG} alt='admin-icon'/>
            </div>
        </>
    );
}
 
export default ADW;