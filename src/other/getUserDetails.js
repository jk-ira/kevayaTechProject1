import { doc, getDoc, getDocs, query, where, orderBy, collection } from "firebase/firestore";
import { auth, firestore } from "../firebase-backend/firebase-config";
import { useContext, useState, useEffect } from "react";
import { Context } from "../contexts/Context";
import { onAuthStateChanged } from "firebase/auth";

const useGetUserDetails = (userUID) => {

    const { currUserName, setCurrUserName, currUserSurname, setCurrUserSurname, 
            currUserMgUid, setCurrUserMgUid, currUserUid, setCurrUserUid, currFirebaseUid, setCurrFirebaseUid,
            joinedOn, setJoinedOn, isLoggedIn, setIsLoggedIn} = useContext(Context);

    const [dbErr, setDbErr] = useState(null);
    const [allRequests, setAllRequests] = useState([]);
    const [noRequests, setNoRequest] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        onAuthStateChanged(auth,() => {
            //get current user details from firestore
            if(auth.currentUser){
                setCurrUserUid(userUID);
                setIsLoggedIn(true);
                const docRef = doc(firestore, "users", userUID);
                getDoc(docRef)
                    .then((doc) => {
                        setCurrUserName(doc.data().name);
                        setCurrUserSurname(doc.data().surname);
                        setCurrUserMgUid(doc.data().mg_uid);
                        setCurrFirebaseUid(doc.data().firebase_uid);
                        setJoinedOn(doc.data().joined_on.toDate());
                        setDbErr(null);

                        //get all requests of the current user from db
                        const reqCol = collection(firestore,"requests");
                        const q = query(reqCol, where("firebase_uid", "==", userUID), orderBy("created_at", "desc"));

                        getDocs(q)
                        .then(snapshot => {
                            if(snapshot.docs.length > 0){
                                setNoRequest(false);
                                setAllRequests(snapshot.docs);
                            }
                            else{
                                setNoRequest(true);
                            }
                        })
                        .catch(err => {
                            setDbErr(err.message);
                        });
                        setIsLoading(false);
                    })
                    .catch(err => {
                    setDbErr(err.message);
                    setIsLoading(false);
                    });
            }
            else{
                setIsLoggedIn(false);
            }
        })

    }, [userUID])
    return { dbErr, allRequests, currUserMgUid, noRequests, isLoading, currUserName,
            currUserSurname, currUserUid, currFirebaseUid, joinedOn, isLoggedIn}
}

export default useGetUserDetails;