import { useEffect } from "react";
const Loading = (props) => {
    //hide loading page
    useEffect(() => {
        document.querySelector('.close-btn')
        .addEventListener('click', () => {
            window.location.href = "./";
        })
    })
    return ( 
        <div className="loading">
            <div className="loading-body" />
            <span className="msg-span">Loading...</span>
            <span className="close-btn">Close</span>
        </div>
     );
}
 
export default Loading;