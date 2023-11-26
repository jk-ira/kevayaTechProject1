import { useLocation } from 'react-router';
import { useContext, useEffect } from 'react';
import { Context } from '../contexts/Context';
import { auth, firestore } from "../firebase-backend/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";


import ContactPart1Svg1 from '../assets/svgs/pc-lady.svg';

const Contact = () => {

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
        console.log('logged in',isAdminLoggedIn);
    },[isLoggedIn, setIsLoggedIn, isAdminLoggedIn, setIsAdminLoggedIn]);

    return ( 

        <div className="contact">
            <div className="contact-part1">
                <div className="contact-part1-svg1">
                    <img src={ContactPart1Svg1} alt="" />
                </div>
                <div className="contact-part1-text">
                    <h1 className='title'>Contact Us</h1>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit! Adipisci sunt officia dolor expedita pariatur culpa dolorem?</p>
                </div>
                
            </div>
            <div className="contact-part2 g-0 row">
                <div className="contact-part2-form col-md">
                    <h3>Please fill in the form to contact us</h3>
                    <form action="">
                        <div className="row">
                        <div className="col-sm">
                                <label htmlFor="name" >Name:</label> <br />
                                <input type="text" required />
                            </div>
                            <div className="col-sm">
                                <label htmlFor="surname" >Surname:</label> <br />
                                <input type="text" required />
                            </div>
                        </div>
                        <label htmlFor="name" >Email:</label> <br />
                        <input type="email" required /> <br />
                        <label htmlFor="message" >Message:</label> <br />
                        <textarea required /> <br />
                        <input type="submit" value='SEND' />
                    </form>
                </div>
                <div className="contact-part2-contact-details col-md">
                    <h3>Contact Details: </h3>
                    <li>Phone: ************</li>
                    <li>Whatsapp: ************</li>
                    <li>Email: ************</li>
                    <h3>Find Us At: </h3>
                    <li>Physical Address: ************</li>
                </div>
            </div>
            
            <div className="components-div-bg" />
        </div>
     );
}

export default Contact;