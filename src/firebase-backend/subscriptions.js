import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import { useEffect, useContext } from 'react';
import { Context } from '../contexts/Context';

const useAuthSubscription = () => {

    const { isLoggedIn, setIsLoggedIn } = useContext(Context);

    //auth subscription
    useEffect(() => {
        onAuthStateChanged(auth, () => {
            if(auth.currentUser){
                setIsLoggedIn(true);
            }
            else{
                setIsLoggedIn(false);
                window.location.href = '/';
            }
        });
        console.log(isLoggedIn);
    },[]);

}
export { useAuthSubscription }