import NavbarMenu from "./components/Navbar";
import About from "./components/About"; 
import Contact from "./components/Contact"; 
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import FooterBar from "./components/FooterBar";
import Account from "./components/Account";
import Admin from "./components/Admin";
import AdminDashboard from "./components/AdminDashboard";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ContextProvider from "./contexts/Context";
import UserDetails from "./components/all_users/UserDetails";
import NotFound from "./components/NotFound";

function App() {

  return (
    <div className="App">
      <ContextProvider>
        <NavbarMenu/>
        <Router>
          <Routes>
            <Route path="/" element={ <Home/> }/>
            <Route path="/about" element={ <About/> }/>
            <Route path="/contact" element={ <Contact/> }/>
            <Route path="/login" element={ <Login/> }/>
            <Route path="/register" element={ <Register/> }/>
            <Route path="/account/:id" element={ <Account/> }/>
            <Route path="/admin" element={ <Admin/> }/>
            <Route path="/admin-dashboard" element={ <AdminDashboard/> }/>
            <Route path="/user-details/:id" element={ <UserDetails /> }/>

            <Route path="*" element={ <NotFound /> } /> 
          </Routes>
        </Router>
        <FooterBar />
      </ContextProvider>
    </div>
  );
}

export default App;
