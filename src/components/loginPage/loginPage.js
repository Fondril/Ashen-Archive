import "./loginPage.scss";

import { useRef, useState } from "react";
import { auth } from "../../config/Config";
import { useAuth } from "../../index";
import { Link, useNavigate } from "react-router-dom";
import Banner from "../homePage/banner/banner";

function LoginPage() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { logIn, setUserStatePopUp } = useAuth();

  const errorDict = {
    "auth/invalid-credential": "Email or password invalid!",
    "auth/too-many-requests":
      "Account login temporarily disabled due to too many login attempts. Try again later.",
  };

  async function handeSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await logIn(auth, emailRef.current.value, passwordRef.current.value);
      setUserStatePopUp({
        logInPopUpState: true,
        signUpPopUpState: false,
        logOutPopUpState: false,
      });
      setTimeout(() => {
        setUserStatePopUp({
          logInPopUpState: false,
          signUpPopUpState: false,
          logOutPopUpState: false,
        });
      }, 2000);
      setLoading(false);
      navigate("/");
    } catch (e) {
      console.log(e);
      setLoading(false);
      return setError(errorDict[e.code]);
    }
  }

  return (
    <>
      <Banner />
      <div className="loginContainer">
        <form autoComplete="off" className="logInForm" onSubmit={handeSubmit}>
          <h1>Login</h1>
          <div className="logInFormInputComponent">
            <label>Email</label>
            <input
              className="logInInput"
              type="email"
              spellCheck="false"
              ref={emailRef}
            ></input>
          </div>
          <div className="logInFormInputComponent">
            <label>Password</label>
            <input
              className="logInInput"
              type="password"
              ref={passwordRef}
            ></input>
          </div>
          <div className="logInFormCTA">
            {error && <h2>{error}</h2>}
            <button type="submit" id="loginButton" disabled={loading}>
              Log In
            </button>
            <p>
              Forgot password?{" "}
              <Link to="/passwordReset" className="logInFormLink">
                Reset password
              </Link>
            </p>
            <p>
              Don't have an account?{" "}
              <Link to="/signUp" className="logInFormLink">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
