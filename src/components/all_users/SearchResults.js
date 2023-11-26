import ArrowLeft from "bootstrap-icons/icons/arrow-left.svg";
import { useEffect } from "react";

const SearchResults = (props) => {

    const userSearchKeyWord = props.userSearchKeyWord;
    const setDashboardPath = props.setDashboardPath;
    const searchResult = props.searchResult;

    useEffect(() => {
        let h ="";
        if(searchResult.length === 0){
            h += `<span>No user found!!!</span>`
        }
        else{
            searchResult.forEach((res)=>{
                h += `
                    <span>Name: ${res.name} </span><br/>
                    <span>Surname: ${res.surname} </span><br/>
                    <span>MG UID: ${res.mg_uid} </span><br/>
                    <span>Joined On: ${res.joined_on} </span><br/>
                    <a href="user-details/${res.firebase_uid}" class="view-all-requests">
                        View all ${res.name}'s details
                    </a>
                    <br/><br/>
                `;
            })     
        }
        document.querySelector(".display-search-results").innerHTML = h;
    },[]);

    const handlePrevious = () => {
        setDashboardPath("all_users/default");
    }
    
    return (
        <>
            <div className="tab">
                <img src={ArrowLeft} onClick={handlePrevious} className="back-arrow" alt="back-arrow" />
                <h3>User Found</h3>
                <div className="tab-search-div">

                    <div className="display-search-results" >
                        {}
                    </div>
                </div>
                
            </div>
        </>
    );
}
export default SearchResults;