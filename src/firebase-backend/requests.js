import { onSnapshot, query, where, getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "./firebase-config";

const useRequestDocuments = (col, field, field_value) => {
    const [error, setError] = useState(''); 
    useEffect(() => {
        const q = query(col, where(field, '==', field_value));
        let documents;
        onSnapshot(q, (snapshot) => {
            documents = snapshot.docs;
        })
        .catch((err) => {
            setError(err);
        });
    return { error, documents };
    });
}

const requestDocument = (col, userId) => {
    let error = null;
    const docRef = doc(firestore, col, userId);
    const document = [];
    getDoc(docRef)
     .then((doc) => {
        document.push(doc.data());
        console.log(doc.data());
     })
     .catch((err) => {
        error = err.message;
     });
    return { error, document};
}

export { useRequestDocuments, requestDocument }