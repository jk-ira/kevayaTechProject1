import { useParams } from "react-router";
import { useEffect, useState } from "react";
import useAdminCheck from "../../other/adminCheck";
import useGetUserDetails from "../../other/getUserDetails";
import ReactPaginate from "react-paginate";
import deleteButton from "../../assets/svgs/delete-button.svg";

const UserDetails = () => {

    //admin login check
    const { isAdminLoggedIn } = useAdminCheck();

    //admin not logged in
    useEffect(() => {
        if(!isAdminLoggedIn && isAdminLoggedIn != null){
            window.location.href = "/admin"
        }
    }, [isAdminLoggedIn])

    const { id } = useParams();

    const { currUserName, currUserSurname, currUserMgUid, currFirebaseUid, joinedOn,
            allRequests, noRequests } = useGetUserDetails(id);

    //pagination
    const [pageNumber, setPageNumber] = useState(0)
    const reqPerPage = 10;
    const pageVisited = pageNumber * reqPerPage;
    const [numOfPages, setNumOfPages] = useState();

    //get current user details
    useEffect(() => {
        let html = "";
        html = `<li class="row users-list">
                    <span class="col-2">${currUserName}</span>
                    <span class="col-2">${currUserSurname}</span>
                    <span class="col-2">${currUserMgUid}</span>
                    <span class="col-3">${currFirebaseUid}</span>
                    <span class="col-2">${joinedOn.toString().split('GMT')[0]}</span>
                </li>`
        if(isAdminLoggedIn){
            document.querySelector('.user').innerHTML = html;
        }

    },[isAdminLoggedIn, currUserName, currUserSurname, currUserMgUid, currFirebaseUid, joinedOn]);

    //display user requests
    useEffect(() => {
        const displayedRequests = allRequests.slice(pageVisited, pageVisited + reqPerPage);
        setNumOfPages(Math.ceil(allRequests.length / reqPerPage));
        let html = '';
        if(noRequests){
            html += `<center><span> User has no requests recorded </span></center>`;
        }
        else{
            displayedRequests.forEach(req => {
                html += `<li class="row">
                            <span class="col-2">${req.data().brought_by}</span>
                            <span class="col-2">${req.data().received_by_name}</span>
                            <span class="col-2">${req.data().created_at.toDate().toString().split("GMT")[0]}</span>
                            <span class="col-2">${req.data().type}</span>
                            <span class="col-2">${req.data().reference}</span>
                            <span class="col-2"><a href="/request-details">More Details</a></span>
                        </li>`;
            });
        }
        if(isAdminLoggedIn){
            document.getElementById("requests-list").innerHTML = html;
        }
        
    },[isAdminLoggedIn, allRequests, noRequests, pageNumber])

    const handlePaginationPageChange = ({ selected }) => {
        setPageNumber(selected);
    }

    return (
        <>
            {isAdminLoggedIn && 
                <div className="user-details">
                    <img src={deleteButton} className="del-Btn" alt="delete user Button" />
                    <h3>User Details:</h3>
                    <li className="row header">
                        <span className="col-2">Name</span>
                        <span className="col-2">Surname</span>
                        <span className="col-2">MG UID</span>
                        <span className="col-3">Firebase UID</span>
                        <span className="col-2">Joined On</span>
                    </li>
                    <div className="user" />
                    <h4> All Requests </h4>
                    <ol id="requests-list">
                        <center><span>Loading...</span></center>
                    </ol>
                    {!noRequests && <ReactPaginate 
                        previousLabel = {"<<"}
                        nextLabel = {">>"}
                        pageCount = {numOfPages}
                        onPageChange = {handlePaginationPageChange}
                        containerClassName="pagination"
                        previousLinkClassName="prev"
                        nextLinkClassName="next"
                        activeClassName="active-page"
                    />
                    }
                </div>
            }
        </>
    );
}

export default UserDetails;