import { firestore } from "../../firebase-backend/firebase-config.js";
import { getDocs, collection, orderBy, query } from "firebase/firestore"
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";

const Default = (props) => {

    const [allUsers, setAllUsers] = useState([]);
    const [searchBy, setSearchBy] = useState("name");//by default

    const setSearchResult = props.setSearchResult;
    
    const setDashboardPath = props.setDashboardPath;
    // const dashboardPath = props.dashboardPath;

    const userSearchKeyWord = props.userSearchKeyWord;
    const setUserSearchKeyWord = props.setUserSearchKeyWord;

    const handleUserKeyWord = (e) => {
        setUserSearchKeyWord(e.target.value);
    }

    //pagination
    const [pageNumber, setPageNumber] = useState(0)
    const usersPerPage = 5;
    const [numOfPages, setNumOfPages] = useState();

    //get all users
    const colRef = collection(firestore, "users");
    const q = query(colRef, orderBy('joined_on', 'desc'))
    useEffect(() => {
        getDocs(q)
        .then(snapshot => {
            let users = [];
            snapshot.docs.forEach(doc => {
                users.push(doc.data());
            })
            setAllUsers(users)
        })
    },[q]);

    //display users based on pagination
    useEffect(() => {
        let html = "";
        const pageVisited = pageNumber * usersPerPage;
        const displayedUsers = allUsers.slice(pageVisited, pageVisited + usersPerPage);
            setNumOfPages(Math.ceil(allUsers.length / usersPerPage));

            // display all users
            displayedUsers.forEach(dispUser => {
                html += `<a href='user-details/${dispUser.firebase_uid}'
                            <li class="row users-list">
                                <span class="col-3"><input type="checkbox"></input>${dispUser.name}</span>
                                <span class="col-3">${dispUser.surname}</span>
                                <span class="col-3">${dispUser.mg_uid}</span>
                                <span class="col-3">${dispUser.joined_on.toDate().toString().split('GMT')[0]}</span>
                            </li>
                        </a>`
            })
            
            document.querySelector(".display-all-users").innerHTML = html;
    },[pageNumber, allUsers])

    const handleSearch = (searchBy) => {
        //let say we searching by name
        let r =[];
        allUsers.forEach((user) => {
            if (searchBy === "name") {
                if(user.name.toUpperCase().includes(userSearchKeyWord.toUpperCase())){
                    r.push({
                        "name" : user.name,
                        "surname" : user.surname,
                        "mg_uid" : user.mg_uid,
                        "joined_on" : user.joined_on,
                        "firebase_uid" : user.firebase_uid
                    })
                }
            }
            if (searchBy === "mguid") {
                if(user.mg_uid.toUpperCase().includes(userSearchKeyWord.toUpperCase())){
                    r.push({
                        "name" : user.name,
                        "surname" : user.surname,
                        "mg_uid" : user.mg_uid,
                        "joined_on" : user.joined_on,
                        "firebase_uid" : user.firebase_uid
                    })
                }
            }
            
        })
        setDashboardPath("workspace/user_search_results");
        setSearchResult(r);
    }
    
    const handlePaginationPageChange = ({ selected }) => {
        setPageNumber(selected);

    }

    const handleSearchBy = (e)=> {
        setSearchBy(e.target.value);
    }

    return (
        <>
            <div className="tab">
                <p>All Users</p>
                <div className="tab-search-div">
                    <form action="" className='tab-search-form'>
                        <input placeholder={"Search by "+ searchBy} type="text" className="tab-search-input" onChange={handleUserKeyWord} />
                        <span> Search By: </span>
                        <select className="search-by" onChange={handleSearchBy} >
                            <option value="name">Name</option>
                            <option value="mguid">MGUID</option>
                        </select>
                        <button className='tab-search-submit' onClick={()=>{handleSearch(searchBy)}}> Search </button>
                        <div className="users-header">
                            <ol>
                                <li className="row titles">
                                    <span className="col-3"><input type="checkbox"></input>Name</span>
                                    <span className="col-3">Surname</span>
                                    <span className="col-3">MG UID</span>
                                    <span className="col-3">Joined On</span>
                                </li>
                            </ol>
                            {/* SINGLE USER ENTRY :::To Loop  */}
                            <ol className="display-all-users">

                            </ol>
                            <ReactPaginate 
                                previousLabel = {"<<"}
                                nextLabel = {">>"}
                                pageCount = {numOfPages}
                                onPageChange = {handlePaginationPageChange}
                                containerClassName="pagination"
                                previousLinkClassName="prev"
                                nextLinkClassName="next"
                                activeClassName="active-page"

                            />
                        </div>
                    </form>
                </div>
            </div>
            
        </> 
    );
}

export default Default;