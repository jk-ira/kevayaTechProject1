import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from 'react-router';
import { Context } from "../contexts/Context";
import { auth, firestore } from "../firebase-backend/firebase-config";
import { addDoc, serverTimestamp, collection } from 'firebase/firestore';
import { Modal } from "react-bootstrap";
import { v1 } from "uuid";
import { useDeviceOnline } from "../other/onlineCheck";
import ReactPaginate from "react-paginate";
import useAdminCheck from "../other/adminCheck";
import useGetUserDetails from "../other/getUserDetails";

const Account = () => {
    const { updatePath,
            currUserName,
            currUserSurname,
        } = useContext(Context);


    const [showNewRequest, setShowNewRequest] = useState(false);
    const [checked, setChecked] = useState(true);
    const [isOnline, setIsOnline] = useState(false);

    const [refNum, setRefNum] = useState(false);

    const location = useLocation();
    const path = location.pathname;
    
    const { deviceOnline } = useDeviceOnline();

    useEffect(() => {
        setIsOnline(deviceOnline);

        window.addEventListener('online', () => {setIsOnline(deviceOnline)})
        window.addEventListener('offline', () => {setIsOnline(deviceOnline)})
    }, [deviceOnline])

    useEffect(() => {
        updatePath(path);
    },[path, updatePath]);

    //admin loggin check
    const {isAdminLoggedIn } = useAdminCheck();

    // get user details
    const { id } = useParams(); 
    
    const { dbErr, allRequests, noRequests, isLoading, isLoggedIn } = useGetUserDetails(id);
    
    // check if user is not logged in
    const [currentUser, setCurrentUser] = useState();
    useEffect(() => {
        //check if it's user or admin logged in
        if((!isLoggedIn && isLoggedIn != null) || (isAdminLoggedIn && isAdminLoggedIn != null)){
            window.location.href = "/";
        }
        //check if it's the id from link is the logged in id
        setCurrentUser(auth.currentUser);
        if(currentUser != null){
            if(currentUser.uid != id){
                window.location.href = "/";
            }
        }
    }, [isLoggedIn, isAdminLoggedIn, currentUser, setCurrentUser])

    //pagination
    const [pageNumber, setPageNumber] = useState(0)
    const reqPerPage = 5;
    const pageVisited = pageNumber * reqPerPage;
    const [numOfPages, setNumOfPages] = useState();

    //get user requests
    useEffect(() => {
        const displayedRequests = allRequests.slice(pageVisited, pageVisited + reqPerPage);
        setNumOfPages(Math.ceil(allRequests.length / reqPerPage));
        let html = '';
        if(noRequests){
            html += `<center><span> You have no previous requests </span></center>`;
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
        if(isLoggedIn){
            document.getElementById("requests-list").innerHTML = html;
        }
                
    }, [allRequests, noRequests, pageVisited]);

    
    const handleClearSearch = (e)=> {
        e.preventDefault();
        //hide search list and display all the requests
        document.getElementById("requests-list").style.display = 'block';
        document.getElementById("search-list").style.display = 'none';

        //hide clear btn and display search btn
        document.querySelector(".search").style.display = 'block';
        document.querySelector(".clear").style.display = 'none';
        
        setRefNum('');
        document.querySelector(".search-form").refNum.value = '';

    }
    const handleReferenceChange = (e)=> {
        setRefNum(e.target.value);
    }

    const handleDocSearch = (e) => {
        e.preventDefault();
        const searchForm = document.querySelector(".search-form");
        const refNumErr = document.querySelector(".refNumErr");
        const refNumField = searchForm.refNum;
        if( refNum.length !== 6 ){
            refNumField.style.border = '2px solid #a10606';
            refNumErr.innerText = 'Reference Number must be exactly 6 characters long';
        }
        else{
            refNumField.style.border = '';
            refNumErr.innerText = '';
            let html;

            allRequests.forEach(req => {
                if(refNum.toUpperCase() === req.data().reference){
                    const broughtBy = req.data().brought_by;
                    const receivedByName = req.data().received_by_name;
                    const refNum = req.data().reference;
                    const type = req.data().type;
                    html = `<li class="row">
                                <span class="col-2">${broughtBy}</span>
                                <span class="col-2">${receivedByName}</span>
                                <span class="col-2">2022/06/08 - 13:00</span>
                                <span class="col-2">${type}</span>
                                <span class="col-2">${refNum}</span>
                                <span class="col-2"><a href="/request-details">More Details</a></span>
                            </li>`;
                    return;
                }
                if(!html){
                    html = `<center><span> No match found </span></center>`;
                }
            })
            //display the search list
            document.getElementById("search-list").style.display = 'block';
            document.getElementById("search-list").innerHTML = html;

            //hide the list of all the requests
            document.getElementById("requests-list").style.display = 'none';

            //hide seach btn and display clear btn
            document.querySelector(".search").style.display = 'none';
            document.querySelector(".clear").style.display = 'block';

        }
    }
    
    const handleHideNewRequest = () => {
        setShowNewRequest(false);
    }

    const handleShowNewRequest = () => {
        setShowNewRequest(true);
        console.log('online: ', isOnline);
    }

    const handleCheckBoxChange = (e) => {
        setChecked(e.target.checked);
    }
    const handleAddNewRequest = () => {
        const newRequestForm = document.querySelector('.new-request-form');
        const msgDiv = document.querySelector('.msgDiv');

        //auto-generated request reference number by uuid v1
        const uuidV1 = v1();
        const reqRefNum = uuidV1.slice(0, 6).toUpperCase();

        //reference to Db collection
        const colRef = collection(firestore, 'requests');

        let broughtByName;
        let receivedByName;
        let receivedBySurname;

        try{
            if(!isOnline){
                throw Error('Your device is currently offline');
            }

            if(checked){
                //form values if customer collects in person
                broughtByName = newRequestForm.broughtByName.value.toUpperCase();
                receivedByName = currUserName.toUpperCase();
                receivedBySurname = currUserSurname.toUpperCase();
                if(broughtByName === ""){
                    throw Error('All Fields are required');
                }
            }
            else{
                //form values if somebody else collects it for customer
                broughtByName = newRequestForm.broughtByName.value.toUpperCase();
                receivedByName = newRequestForm.receivedByName.value.toUpperCase();
                receivedBySurname = newRequestForm.receivedBySurname.value.toUpperCase();
                if(broughtByName === "" || receivedByName === "" || receivedBySurname === ""){
                    throw Error('All Fields are required');
                }
            }
            
            //disable button when clicked
            document.querySelector('.createRequestBtn').value = "Loading...";
            document.querySelector('.createRequestBtn').disabled = true;
            document.querySelector('.createRequestBtn').style.background = "#ccc";
            document.querySelector('.createRequestBtn').style.color = "#333";

            //add the new request to db
            addDoc(colRef, {
                brought_by: broughtByName,
                received_by_name: receivedByName,
                received_by_surname: receivedBySurname,
                firebase_uid: id,
                reference: reqRefNum,
                created_at: serverTimestamp()
            })
            .then(() => {
                
                //display success message
                const html = `<div style="padding: 10px; border-radius:5px; background: #198754">
                                <span>Your request has been created successfully</span><br />
                                <span>Your request reference number is : <b>${reqRefNum}</b> </span><br />
                                <span>Please note that it is imperative that you share your reference number with <b>${broughtByName}</b>
                                as no parcel will be collected by M-G Parcel Care  without it.</span><br />
                                <span>An email explaining the next steps in details has also been sent to you at <b>${auth.currentUser.email}</b></span><br />
                                <span>Thank You</span><br />
                            </div>
                            <a className="onSuccessBtn" href='/account/${id}' style="cursor: pointer; text-decoration: none; font-weight: bold; width: fit-content">Got It</a>
                            `;
                msgDiv.innerHTML = html;
                newRequestForm.style.display = 'none';
                document.querySelector('.createRequestBtn').style.display = 'none';
            })
            .catch((err) => {
                throw Error(err.message);
            });
        }  
        catch(err){
            //display error message
            const html = `<div style="padding: 10px; border-radius:5px; background: #a10606">
                            <span>${err.message}</span>
                            </div>
                            <a class='onErrorBtn' 
                            style="cursor: pointer; color: #0287c3; text-decoration: none; font-weight: bold; width: fit-content" 
                            onClick='
                                document.querySelector(".msgDiv").innerHTML = "";
                                document.querySelector(".new-request-form").style.display = "block";
                                document.querySelector(".createRequestBtn").style.display = "block";
                                document.querySelector(".createRequestBtn").value = "Create Request";
                                document.querySelector(".createRequestBtn").disabled = false;
                                document.querySelector(".createRequestBtn").style.background = "#051725";
                                document.querySelector(".createRequestBtn").style.color = "#fff";
                            '>Try Again</a>
                        `;
            msgDiv.innerHTML = html;
            newRequestForm.style.display = 'none';
            document.querySelector('.createRequestBtn').style.display = 'none';
        }   
    }

    const handlePaginationPageChange = ({ selected }) => {
        setPageNumber(selected);
    }
    
    return (
        <div >
            { isLoggedIn && !dbErr && !isLoading &&
                <div className="account">
                    <div className="account-part1">
                        <p className="wlcm-msg">Hey <i>{currUserName}</i>, Welcome</p>
                        <p className="">Your previous requests</p>
                        <div className="requests-div">
                            <div className="requests-part1">
                                <form className="search-form row">
                                    <input required name="refNum" className="col-9" type="text"
                                    placeholder="Search by parcel reference number" onChange={handleReferenceChange}/> 
                                    <button className="col-1 search" onClick={handleDocSearch}> Search </button>
                                    <button className="col-1 clear" style={{display: 'none'}} onClick={handleClearSearch}> Clear</button>
                                    <button className="col new-request" onClick={handleShowNewRequest}> +New </button>
                                </form>
                                <span className='error refNumErr'></span>
                            </div>
                            <div className="requests-part2 ">
                                <ol>
                                    <li className="row">
                                        <span className="col-2">Brought By</span>
                                        <span className="col-2">Received By</span>
                                        <span className="col-2">Created at</span>
                                        <span className="col-2">Order Type</span>
                                        <span className="col-2">Reference #</span>
                                        <span className="col-2">Full Details</span>
                                    </li>
                                    
                                </ol>
                            </div>
                            <div className="requests-part3">
                                <ol id="requests-list">
                                    <center><span>Loading...</span></center>
                                </ol>
                                <ol id="search-list" style={{display: 'none'}} >
                                    <center><span>Loading...</span></center>
                                </ol>
                                
                            </div>
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
                    </div>

                    {/* new request modal */}
                    <Modal show={showNewRequest} onHide={handleHideNewRequest} keyboard={false} backdrop='static'>
                        <Modal.Header closeButton>
                            <Modal.Title>New request</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div  className="msgDiv" style={{'color': '#fff'}}></div>
                            <form className="new-request-form">
                                <div className="brought-by-div">
                                    <label>To Be <span>Brought</span> By:</label><br />
                                    Name: <input name="broughtByName" type="text" placeholder="NAME of person/company we will collect it from" /><br />
                                    <span className="broughtByNameError error"></span><br />

                                </div>
                                <div className="received-by-div">
                                    <label>To Be <span>Collected</span> By:</label><br />
                                    <input value="currentUser" type="checkbox" defaultChecked onChange={handleCheckBoxChange} /> Myself <br />
                                    {!checked &&
                                        <>
                                            Name: <input name="receivedByName" type="text" placeholder="NAME of person who will collect it from us" /><br />
                                            <span className="receivedByNameError error"></span><br />
                                            Surname: <input name="receivedBySurname" type="text" placeholder="SURNAME of person who will collect it from us" /><br />
                                            <span className="receivedBySurnameError error"></span><br />
                                        </>
                                    }
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <input className="createRequestBtn" type="submit" value='Create Request' onClick={handleAddNewRequest} />
                        </Modal.Footer>
                    </Modal>

                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                </div>
            }
            {dbErr && !isLoading &&
                <> <h1 style={{'color': '#a10606'}}>Error: {dbErr}</h1> </>
            }
            {isLoading && 
                <> <h1 style={{'color': '#fff'}}>Loading...</h1> </>
            }
        </div>
     );
}

export default Account;