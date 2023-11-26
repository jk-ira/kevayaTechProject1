import { useLocation } from 'react-router';
import { useContext, useEffect } from 'react';
import { Context } from '../contexts/Context';
import { auth, firestore } from "../firebase-backend/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import AboutPart1Img1 from '../assets/images/kevin5-min.png';
import AboutPart2Svg1 from '../assets/svgs/takeout-boxes.svg';
import AboutPart3Svg1 from '../assets/svgs/team-spirit.svg';
import { collection, getDocs } from "firebase/firestore";

const About = () => {

    const location = useLocation();
    const path = location.pathname;

    const { updatePath, isLoggedIn, isAdminLoggedIn, setIsAdminLoggedIn, setIsLoggedIn } = useContext(Context);
    useEffect(()=>{
        updatePath(path);
    },[path,updatePath]);

    //auth subscription
    useEffect(() => {
        onAuthStateChanged(auth, () => {
            if(auth.currentUser){
                setIsLoggedIn(true);
                const colRef = collection(firestore, 'admins');
                getDocs(colRef)
                .then((snapshot) => {
                    snapshot.docs.forEach(doc => {
                        //check if the person logged in is an admin
                        if(doc.data().email === auth.currentUser.email){
                            console.log('admin logged in');
                            setIsAdminLoggedIn(true);
                            return
                        }
                        else{
                            setIsAdminLoggedIn(false);
                        }
                    })
                })
                .catch((err) => {
                    alert('Some error occured: '+ err.message);
                });
            }
            else{
                setIsLoggedIn(false);
            }
        });
        console.log(isAdminLoggedIn);
    },[isLoggedIn, setIsLoggedIn, isAdminLoggedIn, setIsAdminLoggedIn]);

    return ( 
        <div className="about">
            <div className=" row g-0 about-part1">
                <div className=" about-part1-1 col-6">
                    <h1>Our Mission</h1>
                    <p>"To seek to be recipients trusted last mile parcel keeper to safeguard the interest of all your deliveries"</p>
                </div>
                <div className="about-part1-2 col-4">
                    <img src={AboutPart1Img1} alt="" />
                </div>
            </div>
            <div className="row g-0 about-part2">
                <div className="image-part2 col">
                    <img src={AboutPart2Svg1} alt="" />
                </div>
                <div className="text-part2 col">
                    <h1>How We Operate</h1>
                    <ol>
                        <li>We collect the parcel for you,</li>
                        <li>We keep it while you are away,</li>
                        <li>You collect it from us or we deliver it to you at your desired date, time, and location.</li>
                    </ol>
                </div>
            </div>

            <div className=" row g-0 about-part3">
                
                <div className="text-part3 col">
                    <h1>Why Choose Us?</h1>
                    <li>System track and record the parcel</li>
                    <li>24/7 CCTV to monitor your parcel</li>
                    <li>We protect your privacy</li>
                    <li>Avoid missed deliveries</li>
                    <li>Prevent your parcel from being stolen</li>
                </div>
        
                <div className="image-part3 col">
                    <img src={AboutPart3Svg1} alt="" />
                </div>
            </div>  

            <div className="components-div-bg" />

        </div>
     );
}
 
export default About;