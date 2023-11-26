import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';
import { useContext, useState} from 'react';
import { Context } from '../contexts/Context';
import { useValidateRegister, useValidateLogin, useValidateReset } from '../other/validation';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-backend/firebase-config';
import { firebaseRegister, firebaseLogin, firebaseResetPassword } from '../firebase-backend/authentication';
import Loading from './Loading';

const NavbarMenu = () => {

    const { path, isLoggedIn, isAdminLoggedIn } = useContext(Context);

    const [showLogin, setShowLogin] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    //forms
    // const registerForm = document.getElementById('register-form');
    // const loginForm = document.getElementById('login-form');
    // const resetForm = document.getElementById('reset-form');

    //email, password, confpassword, name, surname
    const [loginEmail, setLoginEmail] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const showAccount = () => {
        window.location.href = `/account/${auth.currentUser.uid}`
    }

    const handleShowLogin = () => {
        setShowLogin(true);
        setShowReset(false);
    }
    const handleHideLogin = () => {
        setShowLogin(false);
        setLoginEmail('');
        setLoginPassword('');
    }

    const handleShowReset = () => {
        setShowReset(true);
        setShowLogin(false);
    }
    const handleHideReset = () => {
        setShowReset(false);
        setResetEmail('');
    }

    const handleShowRegister = () => {
        setShowRegister(true);
    }
    const handleHideRegister = () => {
        setShowRegister(false);
        setName('');
        setSurname('');
        setRegisterEmail('');
        setRegisterPassword('');
        setConfPassword('');
    }

    const handleLoginEmailChange = (e)=>{
        setLoginEmail(e.target.value);
    }
 
    const handleLoginPasswordChange = (e)=>{
        setLoginPassword(e.target.value);
    }

    const handleNameChange = (e)=>{
        setName(e.target.value);
    }

    const handleSurnameChange = (e)=>{
        setSurname(e.target.value);
    }

    const handleRegisterEmailChange = (e)=>{
        setRegisterEmail(e.target.value);
    }

    const handleRegisterPasswordChange = (e)=>{
        setRegisterPassword(e.target.value);
    }

    const handleConfPasswordChange = (e)=>{
        setConfPassword(e.target.value);
    }

    const handleResetEmailChange = (e) => {
        setResetEmail(e.target.value);
    }

    //get validation returns for login with custom useValidate hook
    const { emailError, validEmail,
            passwordError, validPassword } = useValidateLogin(loginEmail, loginPassword);

    const login = () => {

        //validate email
        document.querySelector('.modalLoginEmailError').innerText = emailError;
        if(emailError){
            document.querySelector('.loginEmail').style.border = '2px solid #a10606';
        }
        else{
            document.querySelector('.loginEmail').style.border = '';
        }
        // console.log(loginForm.children[4]);

        //validate password
        document.querySelector('.modalLoginPasswordError').innerText = passwordError;
        if(passwordError){
            document.querySelector('.loginPassword').style.border = '2px solid #a10606';
        }
        else{
            document.querySelector('.loginPassword').style.border = '';
        }

        //login if form is valid
        if(validEmail && validPassword){
            firebaseLogin(loginEmail, loginPassword);
            setShowLogin(false);
            setIsLoading(true);
        }
    }

        //get validation returns for register with custom useValidate hook
        const { regEmailError,regValidEmail,
        regPasswordError, regValidPassword,
        confPasswordError, validConfPassword,
        nameError, validName,
        surnameError, validSurname } = useValidateRegister(name, surname, registerEmail, registerPassword, confPassword);
        
        //register btn
        const register = (e) => {
        e.preventDefault();

        //validate name
        document.querySelector('.nameError').innerText = nameError;
        if(nameError){
            document.querySelector('.name').style.border = '2px solid #a10606';
        }
        else{
            document.querySelector('.name').style.border = '';
        }

        //validate surname
        document.querySelector('.surnameError').innerText = surnameError;
        if(surnameError){
            document.querySelector('.surname').style.border = '2px solid #a10606';
        }
        else{
            document.querySelector('.surname').style.border = '';
        }

        //validate email
        document.querySelector('.registerEmailError').innerText = regEmailError;
        if(regEmailError){
            document.querySelector('.registerEmail').style.border = '2px solid #a10606';
        }
        else{
            document.querySelector('.registerEmail').style.border = '';
        }

        //validate password
        document.querySelector('.registerPasswordError').innerText = regPasswordError;
        if(regPasswordError){
            document.querySelector('.registerPassword').style.border = '2px solid #a10606';
        }
        else{
            document.querySelector('.registerPassword').style.border = '';
        }

        //validate confPassword
        document.querySelector('.confPasswordError').innerText = confPasswordError;
        if(confPasswordError){
            document.querySelector('.confPassword').style.border = '2px solid #a10606';
        }
        else{
            document.querySelector('.confPassword').style.border = '';
        }

        //if form fields are valid
        if(validName && validSurname && regValidEmail && regValidPassword && validConfPassword){
            firebaseRegister(name, surname, registerEmail, registerPassword);
            setShowRegister(false);
            setIsLoading(true);

        }
    }

    // get validation returns of the reset password form
    const { resetEmailError, resetValidEmail  } = useValidateReset(resetEmail);

    const reset = () => {

        //validate email
        document.querySelector('.modalResetEmailError').innerText = resetEmailError;
        if(resetEmailError){
            document.querySelector('.resetEmail').style.border = '2px solid #a10606';
        }
        else{
            document.querySelector('.resetEmail').style.border = '';
        }

        if(resetValidEmail){
            firebaseResetPassword(resetEmail);
            setShowReset(false);
            setIsLoading(true);

        }
    }

    const logout= () => {
        // setIsLoggedIn(false);
        signOut(auth)
         .then(() => {
            console.log('User Signed out');
            console.log('isLoggedIn:', isLoggedIn);
         });
    }

    window.addEventListener('scroll', ()=>{
        const elmt = document.getElementById('on-scroll-div');
        const scrollPos = window.pageYOffset;
        if(scrollPos>150){
            elmt.classList.add('on-scroll-bg');
         }else{
            elmt.classList.remove('on-scroll-bg');
         }
    });
    return (
        <>
            <Navbar className='navbar' variant="dark" expand="md" sticky="top" id='navbar'>
                <Container>
                    <Navbar.Brand className='logo' href="./">M-G Parcel Care</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className='me-2' />
                        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
                            <Nav className="me-flex nav" >
                                <Nav.Link className={ path === "/" ? 'nav-link current' : 'nav-link' } href="./" >Home</Nav.Link>
                                <Nav.Link className={ path === "/about" ? 'nav-link current' : 'nav-link' } href="./about">About</Nav.Link>
                                <Nav.Link className={ path === "/contact" ? 'nav-link current' : 'nav-link' } href="./contact">Contact</Nav.Link>
                                <NavDropdown style={{'maxWidth':'100px'}} title={isLoggedIn && !isAdminLoggedIn ? "Logged In As" : "Account"} id="basic-nav-dropdown">
                                    { (!isLoggedIn || isAdminLoggedIn) && <NavDropdown.Item onClick={handleShowLogin}>Login</NavDropdown.Item> }
                                    { (!isLoggedIn || isAdminLoggedIn) && <NavDropdown.Item onClick={handleShowRegister}>Register</NavDropdown.Item> }
                                    { isLoggedIn && !isAdminLoggedIn && <>
                                    <NavDropdown.Item onClick={showAccount}>{auth.currentUser.email}</NavDropdown.Item> 
                                    <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item> 
                                    </>}
                                </NavDropdown>
                            </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div id='on-scroll-div'/>

            {/* login modal */}
            <Modal id='login-modal' show={showLogin} onHide={handleHideLogin} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Please fill in to log in</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='login-form' className='form' action="">
                        <label>Email:</label> <br />
                        <input className='loginEmail' type="email" onChange={handleLoginEmailChange} /> <br />
                        <span className='error modalLoginEmailError' /> <br />
                        <label>Password:</label> <br />
                        <input className='loginPassword' type="password" onChange={handleLoginPasswordChange} /><br />
                        <span className='error modalLoginPasswordError' /><br />
                        <p><span className="redirect" onClick={handleShowReset} >Forgot your password?</span></p>
                        <center><span id='firebaseError' className='error' /></center>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <input type="submit" value="LOGIN" onClick={login} /> 
                </Modal.Footer>
            </Modal>

            {/* reset modal */}
            <Modal show={showReset} onHide={handleHideReset} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Please fill in to reset your password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className='form' action="">
                        <label>Email:</label> <br />
                        <input className='resetEmail' type="email" onChange={handleResetEmailChange} /> <br />
                        <span className='error modalResetEmailError' /> <br />
                        <p>Or <span className="redirect" onClick={handleShowLogin}>Log in</span> to your account</p>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <input type="submit" value="RESET PASSWORD" onClick={reset} />
                </Modal.Footer>
            </Modal>

            {/* register modal */}
            <Modal show={showRegister} onHide={handleHideRegister} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Please fill in to Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className='form' action="">
                        <label>First Name:</label> <br />
                        <input className='name' type="text" onChange={handleNameChange}/> <br />
                        <span className='error nameError' /> <br />
                        <label>Surname:</label> <br />
                        <input className='surname' type="text" onChange={handleSurnameChange} /> <br />
                        <span className='error surnameError' /> <br />
                        <label>Email:</label> <br />
                        <input className='registerEmail' type="email" onChange={handleRegisterEmailChange} /> <br />
                        <span className='error registerEmailError' /> <br />
                        <label>Password:</label> <br />
                        <input className='registerPassword' type="password" onChange={handleRegisterPasswordChange} /><br />
                        <span className='error registerPasswordError' /> <br />
                        <label>Confirm Password:</label> <br />
                        <input className='confPassword' type="password" onChange={handleConfPasswordChange} /><br />
                        <span className='error confPasswordError' /> <br />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <input type="submit" value="REGISTER" onClick={register} />
                </Modal.Footer>
            </Modal>

            { isLoading && <Loading /> }
        </>
     );
}
export default NavbarMenu;