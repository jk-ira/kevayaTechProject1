import { firestore, auth } from "./firebase-config";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import emailjs from 'emailjs-com';

let firebaseError = "";

const generateRandomNum = (n) => {
    return Math.floor(Math.random() * (9 * (Math.pow(10, n)))) + (Math.pow(10, n));
}

const sendEmail = (e) => {
    e.preventDefault();
    
    emailjs.sendForm('service_cvh6uyg', 'template_achdas8', e.target, 'wtSia0hjyNGLh07vu')
    .then((result) => {
        window.location.reload()  //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior) 
    }, (error) => {
        console.log(error.text);
    });
}

const firebaseLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
     .then(() => {
        window.location.href = `/account/${auth.currentUser.uid}`;

     })
     .catch((err) => {
        firebaseError = err.message;
        alert('Could not sign you in >>' + err.message);
        window.location.href = "./";

    });
}
const adminFirebaseLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
     .then(() => {
        window.location.href = '/admin-dashboard';
     })
     .catch((err) => {
        firebaseError = err.message;
        alert('Could not sign you in >>' + err.message);
        // window.location.href = "/admin";

    });
}

//was just testing it out
// const useFirebaseLogin = (email, password) => {
//     const [firebaseError2, setFirebaseError] = useState("");

//     useEffect(() => {
//         signInWithEmailAndPassword(auth, email, password)
//         .then(() => {
//             window.location.href = '/account';
//         })
//         .catch((err) => {
//             setFirebaseError(err.message);

//         })
//         console.log('ran');
//     });
//     return { firebaseError2 }
// }

const firebaseRegister = (name, surname, email, password) => {

    //add user with authentication
    createUserWithEmailAndPassword(auth, email, password)
     .then((cred) => {

        //save user's details on firestore
        const r = generateRandomNum(5);
        const mg_uid = 'U-' + r;
        const docRef = doc(firestore, 'users', cred.user.uid);
        name = name.toUpperCase();
        surname = surname.toUpperCase();

        setDoc(docRef, {
            name: name,
            surname: surname,
            firebase_uid: cred.user.uid,
            mg_uid: mg_uid,
            joined_on: serverTimestamp()
        })
        .then(() => {
            window.location.href = `/account/${auth.currentUser.uid}`;
            console.log("user added succesfully");
            sendEmail();
        })
        .catch((err) => {
            firebaseError = err.message
            alert('Could not sign you up >>' + err.message);
            console.log(err.message);
            window.location.href = './';
            // throw Error("Could not add the user!!")
        })
    })
    .catch((err) => {
            firebaseError = err.message
            alert('Could not sign you up >>' + err.message);
            window.location.href = './';

    });
}

const firebaseResetPassword = (email) => {
    sendPasswordResetEmail(auth, email)
    .then(() => {
        alert('Password reset email sent to: >>'+ email);
        window.location.href = './';
    })
    .catch((err => {
        firebaseError = err.message;
        alert('Could not reset your password >>'+ err.message);
        window.location.href = './';
    }))
}

export { firebaseLogin, firebaseRegister, firebaseResetPassword, firebaseError, adminFirebaseLogin };