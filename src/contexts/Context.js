import {createContext, Component} from 'react';

export const Context = createContext();

class ContextProvider extends Component{

  state = {
    path : '',
    isLoggedIn : null,
    isAdminLoggedIn : null,
    currUserUid : '',
    currUserName: "",
    currUserSurname: "",
    currUserMgUid: "",
    currFirebaseUid: "",
    joinedOn: ""

  }

  updatePath = (p) => {
    this.setState({ path: p });
  }

  setIsLoggedIn = (isLoggedIn) => {
    this.setState({isLoggedIn});
  }

  setIsAdminLoggedIn = (isAdminLoggedIn) => {
    this.setState({isAdminLoggedIn});
  }

  setCurrUserUid = (userUid) => {
    this.setState({currUserUid : userUid});
  }

  setCurrUserName = (currUserName) => {
    this.setState({currUserName});
  }

  setCurrUserSurname = (currUserSurname) => {
    this.setState({currUserSurname});
  }

  setCurrUserMgUid = (currUserMgUid) => {
    this.setState({currUserMgUid});
  }
  setCurrFirebaseUid = (currFirebaseUid) => {
    this.setState({currFirebaseUid});
  }
  setJoinedOn = (joinedOn) => {
    this.setState({joinedOn});
  }

  render () {
    return (
        <Context.Provider value = {{...this.state, updatePath: this.updatePath, setIsLoggedIn: this.setIsLoggedIn,
                                    setIsAdminLoggedIn: this.setIsAdminLoggedIn,
                                    setCurrUserUid: this.setCurrUserUid, setCurrUserName: this.setCurrUserName,
                                    setCurrUserSurname: this.setCurrUserSurname, setCurrUserMgUid: this.setCurrUserMgUid,
                                    setCurrFirebaseUid: this.setCurrFirebaseUid, setJoinedOn: this.setJoinedOn}}>
            {this.props.children}
        </Context.Provider>
    )

  }

}

export default ContextProvider;