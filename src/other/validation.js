import { useEffect, useState } from "react";

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const nameRegex = /^([A-Za-z][A-Za-z0-9_]{0,})$/;

const useValidateRegister = (name, surname, email, password, confPassword) => {

    const [regEmailError, setRegEmailError] = useState('');
    const [regPasswordError, setRegPassError] = useState('');
    const [confPasswordError, setConfPassError] = useState('');
    const [nameError, setNameError] = useState('');
    const [surnameError, setSurnameError] = useState('');

    const [regValidEmail, setRegValidEmail] = useState(false);
    const [regValidPassword, setRegValidPassword] = useState(false);
    const [validConfPassword, setValidConfPassword] = useState(false);
    const [validName, setValidName] = useState(false);
    const [validSurname, setValidSurname] = useState(false);

    useEffect(()=>{
        //email validation
        if(email === ''){
            setRegEmailError('Email is required');
            setRegValidEmail(false);
        }
        else if (!email.match(emailRegex)){
            setRegEmailError('Email address entered is invalid');
            setRegValidEmail(false);
        }
        else{         
            setRegEmailError('');
            setRegValidEmail(true);
        }

        //password validation
        if(password === ''){
            setRegPassError('Password is required');
            setRegValidPassword(false);

        }
        else if(password.length < 8){
            setRegPassError('Password must be at least 8 char long');
            setRegValidPassword(false);

        }
        else if(!password.match(passRegex)){
            setRegPassError('Password must contain at least 1 letter, 1 number and 1 special character');
            setRegValidPassword(false);

        }
        else{
            setRegPassError('');
            setRegValidPassword(true);
        }

        //confPassword validation
        if(confPassword === ''){
            setConfPassError('Confirmation of password is required');
            setValidConfPassword(false);

        }
        else if(confPassword !== password){
            setConfPassError('Passwords don\'t match');
            setValidConfPassword(false);

        }
        else{
            setConfPassError('');
            setValidConfPassword(true);
        }

        //name validation
        if(name === ''){
            setNameError('Name is required');
            setValidName(false);
        }
        else if (!name.match(nameRegex)){
            setNameError('Name entered is invalid');
            setValidName(false);
        }
        else{
            setNameError('');
            setValidName(true);
        }

        //surname validation
        if(surname === ''){
            setSurnameError('Surname is required');
            setValidSurname(false);
        }
        else if (!surname.match(nameRegex)){
            setSurnameError('Surname entered is invalid');
            setValidSurname(false);
        }
        else{         
            setSurnameError('');
            setValidSurname(true);
        }

    },[name, surname, email, password, confPassword]);
    
    return { regEmailError,regValidEmail,
            regPasswordError, regValidPassword,
            confPasswordError, validConfPassword,
            nameError, validName,
            surnameError, validSurname };
}

const useValidateLogin = (email, password) => {

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPassError] = useState('');

    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);

    useEffect(()=>{
        //email validation
        if(email === ''){
            setEmailError('Email is required');
            setValidEmail(false);
        }
        else if (!email.match(emailRegex)){
            setEmailError('Email address entered is invalid');
            setValidEmail(false);
        }
        else{         
            setEmailError('');
            setValidEmail(true);
        }

        //password validation
        if(password === ''){
            setPassError('Password is required');
            setValidPassword(false);

        }
        else if(password.length < 8){
            setPassError('Password must be at least 8 char long');
            setValidPassword(false);

        }
        else if(!password.match(passRegex)){
            setPassError('Password must contain at least 1 letter, 1 number and 1 special character');
            setValidPassword(false);

        }
        else{
            setPassError('');
            setValidPassword(true);
        }

    },[email, password]);
    
    return { emailError, validEmail, 
            passwordError, validPassword };
}

const useValidateReset = (email) => {

    const [resetEmailError, setResetEmailError] = useState('');

    const [resetValidEmail, setResetValidEmail] = useState(false);

    useEffect(()=>{
        //email validation
        if(email === ''){
            setResetEmailError('Email is required');
            setResetValidEmail(false);
        }
        else if (!email.match(emailRegex)){
            setResetEmailError('Email address entered is invalid');
            setResetValidEmail(false);
        }
        else{         
            setResetEmailError('');
            setResetValidEmail(true);
        }

    },[email]);
    
    return { resetEmailError, resetValidEmail };
}

export { useValidateRegister, useValidateLogin, useValidateReset } 
