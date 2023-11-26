import { signOut } from 'firebase/auth';
import { auth } from '../firebase-backend/firebase-config';
import { useEffect, useState } from "react";
import WSDefault from './work_space/Default';
import RequestSearchResults from './work_space/SearchResults';
import UserSearchResults from './all_users/SearchResults';
import AllUsersDefault from './all_users/Default';
import AllRequestsDefault from './all_requests/Default';
import ADW from './AdminDashboardWelcome';
import useAdminCheck from '../other/adminCheck';

const AdminDashboard = () => {

    const [dashboardPath, setDashboardPath] = useState('');
    const [currentTab, setCurrentTab] = useState();

    const [userSearchKeyWord, setUserSearchKeyWord] = useState();
    const [requestSearchKeyWord, setRequestSearchKeyWord] = useState();
    const [reqRefNum, setReqRefNum] = useState();

    const [searchResult, setSearchResult] = useState([]);


    //all tabs buttons
    const wsBtn = document.querySelector('.admin-ws');
    const usersBtn = document.querySelector('.all-users');
    const requestsBtn = document.querySelector('.all-requests');

    //admin login check
    const { isAdminLoggedIn, adminName, adminUid } = useAdminCheck();
    
    const logOut = () => {
        signOut(auth)
        .then(window.location.href = '/admin');
    }

    useEffect(() => {
        if(!isAdminLoggedIn && isAdminLoggedIn != null){
            window.location.href = "/admin"
        }
    },[isAdminLoggedIn])
    
    const dashboardHelper = () => {
        if(dashboardPath === "") {
            return <ADW />
        }
        if(dashboardPath === "workspace/default"){
            return <WSDefault dashboardPath={dashboardPath} setDashboardPath ={setDashboardPath} 
                    reqRefNum = {reqRefNum}  setReqRefNum = {setReqRefNum} />
        }
        if(dashboardPath === "all_users/default"){
            return <AllUsersDefault dashboardPath={dashboardPath} setDashboardPath ={setDashboardPath} 
                    userSearchKeyWord = {userSearchKeyWord} setUserSearchKeyWord = {setUserSearchKeyWord}
                    setSearchResult = {setSearchResult}/>
        }
        if(dashboardPath === "all_requests/default"){
            return <AllRequestsDefault dashboardPath={dashboardPath} setDashboardPath ={setDashboardPath} 
                    requestSearchKeyWord = {requestSearchKeyWord}  setRequestSearchKeyWord = {setRequestSearchKeyWord} />
        }
        if(dashboardPath === "workspace/request_search_results"){
            return <RequestSearchResults dashboardPath={dashboardPath} setDashboardPath ={setDashboardPath} 
                    reqRefNum = {reqRefNum}  setReqRefNum = {setReqRefNum}  />
        }
        if(dashboardPath === "workspace/user_search_results"){
            return <UserSearchResults dashboardPath={dashboardPath} setDashboardPath ={setDashboardPath}
                    userSearchKeyWord = {userSearchKeyWord} setUserSearchKeyWord = {setUserSearchKeyWord} 
                    searchResult = {searchResult}
                    />
        }
    }

    //get Current tab
    useEffect(() => {
        const a = dashboardPath.split('/');
        const tab = a[0];
        setCurrentTab(tab);

    }, [dashboardPath, currentTab]);

    const handleWorkSpace = () => {
        setDashboardPath('workspace/default');

        wsBtn.style.background = '#fff';
        wsBtn.style.color = '#051725';
        wsBtn.style.border = '#051725 1px solid';

        usersBtn.style.background = '#051725';
        usersBtn.style.color = '#fff';
        usersBtn.style.border = '#051725 1px solid';

        requestsBtn.style.background = '#051725';
        requestsBtn.style.color = '#fff';
        requestsBtn.style.border = '#051725 1px solid';
        
    }
    const handleAllUsers = () => {
        setDashboardPath('all_users/default');
        
        usersBtn.style.background = '#fff';
        usersBtn.style.color = '#051725';
        usersBtn.style.border = '#051725 1px solid';

        wsBtn.style.background = '#051725';
        wsBtn.style.color = '#fff';
        wsBtn.style.border = '#051725 1px solid';

        requestsBtn.style.background = '#051725';
        requestsBtn.style.color = '#fff';
        requestsBtn.style.border = '#051725 1px solid';
        
    }
    const handleAllRequests = () => {
        setDashboardPath('all_requests/default');
        
        requestsBtn.style.background = '#fff';
        requestsBtn.style.color = '#051725';
        requestsBtn.style.border = '#051725 1px solid';

        wsBtn.style.background = '#051725';
        wsBtn.style.color = '#fff';
        wsBtn.style.border = '#051725 1px solid';

        usersBtn.style.background = '#051725';
        usersBtn.style.color = '#fff';
        usersBtn.style.border = '#051725 1px solid';
    }

    return ( 
        <>
            {isAdminLoggedIn && 
                <>
                    {/*
                     <div className="top-rubbon">
                        Admin: {adminName} {adminUid}
                        <button onClick={logOut}>Log out</button>
                    </div> */}
                    <div className="main-container row">
                        <div className="col-3 left-part">
                            <div className="admin-info">
                                <span>Admin: {adminName} {adminUid}</span><br/>
                                <button onClick={logOut}>Log out</button>
                            </div>
                            <div className="admin-tabs">
                                <button className="admin-ws" onClick={handleWorkSpace}> Work Space </button>
                                <br />
                                <button className="all-users" onClick={handleAllUsers}> Users </button>
                                <br />
                                <button className="all-requests" onClick={handleAllRequests}> Requests </button>
                            </div>
                        </div>

                        <div className="col-9 right-part">
                            {dashboardHelper()}
                        </div>
                    </div>
                </>
            }
        </>
    );  
}

export default AdminDashboard;