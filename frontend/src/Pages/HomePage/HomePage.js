import Login from "../../Components/Login/Login";
import SignUp from "../../Components/SignUp/SignUp";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h1 className="homepage_app-name col-12 col-sm-10 col-lg-7 text-center py-4">
        ZezO Chat App!
      </h1>
      <div className="homepage_login-signup mt-2 col-12 col-sm-10 col-lg-7 text-center p-4">
        <div className="">
          <ul className="nav nav-pills d-flex justify-content-center" role="tablist">
            <li className="nav-item w-25 me-3">
              <a className="nav-link active" data-bs-toggle="pill" href="#login">
                Login
              </a>
            </li>
            <li className="nav-item w-25">
              <a className="nav-link" data-bs-toggle="pill" href="#signup">
                Signup
              </a>
            </li>
          </ul>

          <div className="tab-content mt-5">
            <div id="login" className="container tab-pane active">
            <Login></Login>
            </div>
            <div id="signup" className="container tab-pane">
            <SignUp></SignUp>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
