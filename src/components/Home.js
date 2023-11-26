import { useLocation } from 'react-router';
import { useContext, useEffect,useState } from 'react';
import { Context } from '../contexts/Context';
import { useValidateRegister, useValidateLogin, useValidateReset } from '../other/validation';
import { firebaseRegister, firebaseLogin, firebaseError, firebaseResetPassword } from '../firebase-backend/authentication';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '../firebase-backend/firebase-config';
import { collection, getDocs } from "firebase/firestore";

import HomeGB from '../assets/images/home-bg.jpg';
import HomePart2SVG1 from '../assets/svgs/wave3.svg';
import HomePart2SVG2 from '../assets/svgs/blob1.svg';
import HomePart4SVG1 from '../assets/svgs/mobile-user.svg';
import HomePart3SVG1 from '../assets/svgs/scooter.svg';
import HomePart3SVG2 from '../assets/svgs/delivery-guy.svg';
import HomePart3SVG3 from '../assets/svgs/takeout-boxes.svg';
import HomePart2Img1 from '../assets/images/africanMan.png';
import HomePart3Img1 from '../assets/images/reg-login.jpg';
import Loading from './Loading';

const Home = () => {
    const { updatePath, isLoggedIn, isAdminLoggedIn, setIsAdminLoggedIn, setIsLoggedIn } = useContext(Context);

    const location = useLocation();
    const path = location.pathname;

    // forms containers
    const registerDiv = document.getElementById('register-div');
    const loginDiv = document.getElementById('login-div');
    const resetDiv = document.getElementById('reset-div');

    //forms
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const resetForm = document.getElementById('reset-form');

    //error spans
    const emailErrorSpans = document.querySelectorAll('#emailError');
    const passErrorSpans = document.querySelectorAll('#passError');
    const confPassErrorSpans = document.querySelectorAll('#confPassError');
    const nameErrorSpans = document.querySelectorAll('#nameError');
    const surnameErrorSpans = document.querySelectorAll('#surnameError');

    //email, password, confpassword, name, surname
    const [loginEmail, setLoginEmail] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    
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

    //show login form only
    useEffect(()=>{
        const loginDiv = document.getElementById('login-div');
        const registerDiv = document.getElementById('register-div');
        const resetDiv = document.getElementById('reset-div');
        if(!isLoggedIn || isAdminLoggedIn){
            loginDiv.style.display = "block";
            registerDiv.style.display = "none";
            resetDiv.style.display = "none"
        }
    },[isLoggedIn, isAdminLoggedIn]);

    const showRegister = () =>{
        registerDiv.style.display = "block";
        loginDiv.style.display = "none";
        resetDiv.style.display = "none";

        //delete login error messages
        loginForm.email.style.border = '';
        loginForm.password.style.border = '';
        emailErrorSpans[0].innerText = '';
        passErrorSpans[0].innerText = '';

    }
    const showLogin = () =>{
        loginDiv.style.display = "block";
        registerDiv.style.display = "none";
        resetDiv.style.display = "none";

        //delete register error messages
        registerForm.email.style.border = '';
        registerForm.password.style.border = '';
        emailErrorSpans[1].innerText = '';
        passErrorSpans[1].innerText = '';
        
    }
    const showResetPassword = () =>{
        resetDiv.style.display = "block";
        loginDiv.style.display = "none";
        registerDiv.style.display = "none";
    }
    
    const handleNameChange = (e)=>{
        setName(e.target.value.toUpperCase());
    }

    const handleSurnameChange = (e)=>{
        setSurname(e.target.value.toUpperCase());
    }

    const handleLoginEmailChange = (e)=>{
        setLoginEmail(e.target.value);
    }

    const handleRegisterEmailChange = (e)=>{
        setRegisterEmail(e.target.value);
    }

    const handleResetEmailChange = (e)=>{
        setResetEmail(e.target.value);
    }

    const handleLoginPasswordChange = (e)=>{
        setLoginPassword(e.target.value);
    }

    const handleRegisterPasswordChange = (e)=>{
        setRegisterPassword(e.target.value);
    }

    const handleConfPasswordChange = (e)=>{
        setConfPassword(e.target.value);
    }

    //get validation returns for login with custom useValidate hook
    const { emailError, validEmail,
            passwordError, validPassword } = useValidateLogin(loginEmail, loginPassword);

    // login button
    const handleLogin = (e)=>{
        e.preventDefault();

        //validate email
        emailErrorSpans[0].innerText = emailError;
        if(emailError){
            loginForm.email.style.border = '2px solid #a10606';
        }
        else{
            loginForm.email.style.border = '';
        }

        //validate password
        passErrorSpans[0].innerText = passwordError;
        if(passwordError){
            loginForm.password.style.border = '2px solid #a10606';
        }
        else{
            loginForm.password.style.border = '';
        }

        
        //login if form is valid
        if(validEmail && validPassword){
            firebaseLogin(loginEmail, loginPassword);

            //firebase error
            document.querySelector('.loginFirebaseError').innerText = firebaseError;
        
            setIsLoading(true);

        }

    }

    //get validation returns for register with custom useValidate hook
    const { regEmailError,regValidEmail,
        regPasswordError, regValidPassword,
        confPasswordError, validConfPassword,
        nameError, validName,
        surnameError, validSurname } = useValidateRegister(name, surname, registerEmail, registerPassword, confPassword);

    //register button
    const handleRegister = (e)=>{
        e.preventDefault();

        //validate name
        nameErrorSpans[0].innerText = nameError;
        if(nameError){
            registerForm.name.style.border = '2px solid #a10606';
        }
        else{
            registerForm.name.style.border = '';
        }
        
        //validate surname
        surnameErrorSpans[0].innerText = surnameError;
        if(surnameError){
            registerForm.surname.style.border = '2px solid #a10606';
        }
        else{
            registerForm.surname.style.border = '';
        }

        //validate email
        emailErrorSpans[1].innerText = regEmailError;
        if(regEmailError){
            registerForm.email.style.border = '2px solid #a10606';
        }
        else{
            registerForm.email.style.border = '';
        }

        //validate password
        passErrorSpans[1].innerText = regPasswordError;
        if(regPasswordError){
            registerForm.password.style.border = '2px solid #a10606';
        }
        else{
            registerForm.password.style.border = '';
        }

        //validate confPassword
        confPassErrorSpans[0].innerText = confPasswordError;
        if(confPasswordError){
            registerForm.confPassword.style.border = '2px solid #a10606';
        }
        else{
            registerForm.confPassword.style.border = '';
        }

        if(validName && validSurname && regValidEmail && regValidPassword && validConfPassword){
            firebaseRegister(name, surname, registerEmail, registerPassword);

            //firebase error
            document.querySelector('.registerFirebaseError').innerText = firebaseError;

            setIsLoading(true);

        }
    }

    // get validation returns of the reset password form
    const { resetEmailError, resetValidEmail  } = useValidateReset(resetEmail);

    //reset password button
    const handleResetPassword = (e) => {
        e.preventDefault();
    
        //validate the email address
        emailErrorSpans[2].innerText = resetEmailError;
        if(resetEmailError){
            resetForm.email.style.border = '2px solid #a10606';
        }
        else{
            resetForm.email.style.border = '';
        }
    
        //firebase error
        if(firebaseError){
            document.querySelector('.resetFirebaseError').innerText = firebaseError;
        }
        else{
            document.querySelector('.resetFirebaseError').innerText = '';
        }

        if(resetValidEmail){
            firebaseResetPassword(resetEmail);
            
            setIsLoading(true);
            
        }
    }
    
    return (<>
            {!isLoading && <div className="home">
            {/* Top Section */}
            <img src={HomeGB} alt="" className='home-gb-img' />
            
            <div className='home-text-part1 g-0 row'>
                <div className="home-text-part1-title col-md-6">
                    <span className=''>Not available on time for your parcels?<br/> WE'VE GOT YOU!!!</span>
                </div>
                <div className="home-text-part1-paragraph col-md-6">
                    <h1>What do we do?</h1>
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</li>
                    <li> ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco </li>
                    <li>laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate </li>
                </div>
            </div>
            <div className="components-div-bg" />

            {/* 2nd part */}
            <div className="home-text-part2">
                <img src={HomePart2SVG1} alt="" className='home-svg1' />
                <div className="home-text-part2-1 g-0 row">
                    <div className="home-text-part2-1-svg-div col-6">
                        <img src={HomePart2SVG2} alt="" className='home-svg2' />
                        <img src={HomePart2Img1} alt="" className='home-part2-img1' />
                    </div>
                    <div className="home-text-part2-1-paragraph col-md-4">
                        <div className="home-text-part1-paragraph-copy col-md-6">
                            <h1>What do we do?</h1>
                            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</li>
                            <li> ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco </li>
                            <li>laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate </li>
                        </div>

                        <h1>All you need to do?</h1>
                        <ol>
                            <li>Register for a free account and/or Login,</li>
                            <li>Request for a parcel keeping reference number online,</li>
                            <li>Share your reference number with the one that'll bring the parcel to us.</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* 3rd part */}

            <div className="home-text-part3">
                <img src={HomePart2SVG1} alt="" className='home-svg2' />
                <div className="home-text-part3-1">
                    <div className="home-text-part3-1-text g-0 row">
                        <img className='svg1' src={HomePart3SVG1} alt="" />
                        <h1>Register/Login</h1>
                        <p className='col'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        </p>
                        <div className="col img-div"><img src={HomePart3Img1} alt="" /></div>
                    </div>
                    <div className="home-text-part3-1-text g-0 row">
                        <img className='svg2' src={HomePart3SVG2} alt="" />
                        <h1>Request for Ref Number</h1>
                        <div className="col img-div"><img src={HomePart3Img1} alt="" /></div>
                        <p className='col'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        </p>
                    </div>
                    <div className="home-text-part3-1-text g-0 row">
                        <img className='svg3' src={HomePart3SVG3} alt="" />
                        <h1>Share your Ref number</h1>
                        <p className='col'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        </p>
                        <div className="col img-div"><img src={HomePart3Img1} alt="" /></div>
                    </div>
                </div>
            </div>  
            
            {/* 4th part */}
            {(!isLoggedIn || isAdminLoggedIn) && <>
            <div className="home-text-part4 ">
                {/* login form */}
                <div  id='login-div'>
                    <div className="row g-0 login-div">
                        <div className="form-div login-box col">
                            <h1>Log in to your account</h1>
                            <form id='login-form' className='form' action="">
                                <label>Email:</label> <br />
                                <input type="email" name='email' onChange={handleLoginEmailChange} /> <br />
                                <span id='emailError' className="error"></span><br />
                                <label>Password:</label> <br />
                                <input type="password" name='password' onChange={handleLoginPasswordChange} /><br />
                                <span id='passError' className="error"></span><br />
                                <p><span className="redirect" onClick={showResetPassword}>Forgot your password?</span></p>
                                <input type="submit" value="LOGIN" onClick={handleLogin}  />
                                <p>Or <span className="redirect" onClick={showRegister}>Create</span> a free account</p>
                                <center><span className='error loginFirebaseError' /></center>
                            </form>
                        </div>
                        <div className="form-text col">
                            <p>Please enter your login credentials </p>
                            <img className='part4-svg1' src={HomePart4SVG1} alt="" />
                        </div>
                    </div>
                </div>
                {/* register form */}
                <div id='register-div'>
                    <div className="row g-0 register-div" >
                        <div className="form-div register-box col">
                            <h1>Create a free account</h1>
                            <form id='register-form' className='form' action="">
                                <label>First Name:</label> <br />
                                <input type="text" name='name' onChange={handleNameChange} size='' /> <br />
                                <span id='nameError' className="error"></span><br />
                                <label>Surname:</label> <br />
                                <input type="text" name='surname' onChange={handleSurnameChange} /> <br />
                                <span id='surnameError' className="error"></span><br />
                                <label>Email:</label> <br />
                                <input type="email" name='email' onChange={handleRegisterEmailChange}  /> <br />
                                <span id='emailError' className="error"></span><br />
                                <label>Password:</label> <br />
                                <input type="password" name='password' onChange={handleRegisterPasswordChange}  /><br />
                                <span id='passError' className="error"></span><br />
                                <label>Confirm Password:</label> <br />
                                <input type="password" name='confPassword' onChange={handleConfPasswordChange} /><br />
                                <span id='confPassError' className="error"></span><br />
                                <input type="submit" value="REGISTER" onClick={handleRegister}  />
                                <p>Or <span className="redirect" onClick={showLogin}>Log in</span> to your account</p>
                                <center><span className='error registerFirebaseError' /></center>
                            </form>
                        </div>
                        <div className="form-text col">
                            <p>Please fill in to register </p>
                            <img className='part4-svg1' src={HomePart4SVG1} alt="" />
                        </div>
                    </div>
                </div>
                {/* reset password form */}
                <div  id='reset-div'>
                    <div className="row g-0 reset-div">
                        <div className="form-div reset-box col">
                            <h1>Fill in to reset your password</h1>
                            <form id='reset-form' className='form' action="">
                                <label>Email:</label> <br />
                                <input name='email' type="email" onChange={handleResetEmailChange} /> <br />
                                <span id='emailError' className="error"></span><br />
                                <input type="submit" value="RESET PASSWORD" onClick={handleResetPassword}/>
                                <p>Or <span className="redirect" onClick={showLogin}>Log in</span> to your account</p>
                                <center><span className='error resetFirebaseError' /></center>
                            </form>
                        </div>
                        <div className="form-text col">
                            <p>Please enter the email you registered with</p>
                            <img className='part4-svg1' src={HomePart4SVG1} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            </> }
            </div>}
            { isLoading && <Loading /> }

    </>);
}

export default Home;