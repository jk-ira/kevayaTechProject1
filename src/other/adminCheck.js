import { useEffect, useState, useContext } from "react";
import { auth, firestore } from "../firebase-backend/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Context } from '../contexts/Context';

const useAdminCheck = () => {

    const { isAdminLoggedIn, setIsAdminLoggedIn } = useContext(Context);
    const [ adminName, setAdminName ] = useState();
    const [ adminUid, setAdminUid ] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, () => {
            //check if anyone is logged in
            if (auth.currentUser){
                const colRef = collection(firestore, 'admins');
                getDocs(colRef)
                .then((snapshot) => {
                    snapshot.docs.forEach(doc => {
                        //check if the person logged in is an admin
                        if(doc.data().email === auth.currentUser.email){
                            setIsAdminLoggedIn(true);
                            setIsLoading(false);
                            return
                        }
                        else{
                            setIsAdminLoggedIn(false);
                            setIsLoading(false);
                        }

                    })
                })
                .catch((err) => {
                    alert('Some error occured: '+ err.message);
                });

                //get current admin details from firestore
                const docRef = doc(firestore, "admins", auth.currentUser.uid);
                if (isAdminLoggedIn) {
                    getDoc(docRef)
                    .then((doc) => {
                        setAdminName(doc.data().name);
                        setAdminUid(doc.data().admin_id);
                    })
                }
                
            }
            else{
                setIsAdminLoggedIn(false);
                setIsLoading(false);
            }
        });
    },[isAdminLoggedIn, setIsAdminLoggedIn]);

    return { isAdminLoggedIn, adminName, adminUid, isLoading }
}

export default useAdminCheck;