const FooterBar = () => {
    return ( 
        <div className="footer">
            <div className="footer-bar g-0 row">
                <div className="LOGO col-sm-4">
                    <h1>M-G Parcel Care</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Totam quae molestias ducimus quam! Fuga eveniet, nam deserunt quia dolorem consequatur laudantium itaque blanditiis quaerat voluptas nostrum voluptates ex dicta nobis.</p><br/>
                </div>
                <div className="menu col">
                    <h2>Menu</h2>
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                    <a href="#">Account</a>
                </div>
                <div className="follow-us col">
                <h2>Follow Us</h2>
                <a href="#">Facebook</a>
                <a href="#">WhatsApp</a>
                <a href="#">Instagram</a>
                </div>
            </div>
            <div className="ribbon">
                <p>&copy; All Rights Reserved  by M-G Trading</p>
            </div>
        </div>
     );
}

export default FooterBar;