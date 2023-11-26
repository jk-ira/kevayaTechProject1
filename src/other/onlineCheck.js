import { useState, useEffect } from "react";

const useDeviceOnline = () => {
    const [deviceOnline, setDeviceOnline] = useState();
    
    useEffect(() => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts', true);
        xhr.onload = () => {
            if(xhr.status === 200){
                setDeviceOnline(true);
            }
            else{
                setDeviceOnline(false);
            }
        }
        xhr.onerror = () => {
            setDeviceOnline(false);
        }
        xhr.send();

    });
    return {deviceOnline}
}

export { useDeviceOnline };