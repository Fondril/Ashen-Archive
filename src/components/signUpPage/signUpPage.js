import "./signUpPage.scss";

import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../config/Config";
import { useAuth } from "../../index";
import { getCurrentDate } from "../../logic/logic.js";
import { doc, setDoc } from "firebase/firestore";

import Banner from "../homePage/banner/banner.js";
import infoIcon from "../../gallery/infoIcon.png";

export function SignUpPage(props) {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const repeatedPasswordRef = useRef();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [emailInfoPopUpState, setEmailInfoPopUpState] = useState(false);
  const [passwordInfoPopUpState, setPasswordInfoPopUpState] = useState(false);
  const errorDict = {
    "auth/email-already-in-use": " Email already in use!",
    "auth/weak-password": "Password too weak",
  };

  const { signUp, setUserStatePopUp } = useAuth();

  // Registers the user, adds the user to the database and navigates him back to the homepage

  async function handeSubmit(e) {
    e.preventDefault();
    const currentNewUsername = usernameRef.current.value;
    const currentDate = getCurrentDate();

    if (passwordRef.current.value !== repeatedPasswordRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      const userCredential = await signUp(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      const currentNewUser = userCredential.user;
      setDoc(doc(db, "Users", currentNewUser.uid), {
        userId: currentNewUser.uid,
        username: currentNewUsername,
        email: currentNewUser.email,
        dateJoined: currentDate,
        profileImage:
          "https://firebasestorage.googleapis.com/v0/b/gamevault-193bd.appspot.com/o/Images%2FgenericProfilePicture.png?alt=media&token=f66f641a-4176-4605-ad46-d6b46c2472b6",
        numberOfGamesRated: 0,
        numberOfGamesStored: 0,
        numberOfGamesFavourited: 0,
        gamesRated: {},
        gamesStored: {},
        gamesFavourited: {},
      });

      setUserStatePopUp({
        logInPopUpState: false,
        signUpPopUpState: true,
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
      setLoading(false);
      return setError(
        errorDict[e.code] ?? `Something went wrong! \n ${e.code}`
      );
    }
  }

  function handleInfoIconHoverEnter() {
    setEmailInfoPopUpState(true);
  }
  function handleInfoIconHoverLeave() {
    setEmailInfoPopUpState(false);
  }
  function handlePasswordInfoIconHoverEnter() {
    setPasswordInfoPopUpState(true);
  }
  function handlePasswordInfoIconHoverLeave() {
    setPasswordInfoPopUpState(false);
  }
  return (
    <>
      <Banner />
      <div className="signUpContainer">
        <form className="signUpForm" onSubmit={handeSubmit} autoComplete="on">
          <div className="signUpFormContainer">
            <h1>Sign up</h1>
            <label>Username</label>
            <input
              className="signUpInput"
              type="text"
              ref={usernameRef}
              spellCheck="false"
            ></input>
            <div className="signUpInfoPopUp">
              <label>Email</label>
              <div>
                <img
                  src={infoIcon}
                  alt="info"
                  className="signUpInfoIconImage"
                  onMouseEnter={handleInfoIconHoverEnter}
                  onMouseLeave={handleInfoIconHoverLeave}
                />
                {emailInfoPopUpState ? (
                  <p className="signUpEmailInfoPopUp">
                    Please enter a valid email. <br /> e.g. format:
                    jsmith@example.com
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <input className="signUpInput" type="email" ref={emailRef}></input>
            <div className="signUpInfoPopUp">
              <label>Password</label>
              <div>
                <img
                  src={infoIcon}
                  alt="info"
                  className="signUpInfoIconImage"
                  onMouseEnter={handlePasswordInfoIconHoverEnter}
                  onMouseLeave={handlePasswordInfoIconHoverLeave}
                />
                {passwordInfoPopUpState ? (
                  <p className="signUpPasswordInfoPopUp">
                    Your password must be at least 6 characters long.
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <input
              className="signUpInput"
              type="password"
              ref={passwordRef}
              // minLength="6"
            ></input>
            <label>Repeat password</label>
            <input
              className="signUpInput"
              type="password"
              ref={repeatedPasswordRef}
              // minLength="6"
            ></input>
          </div>

          <div className="signUpCTA">
            {error && <h2>{error}</h2>}
            <button type="submit" id="signUpButton" disabled={loading}>
              Register
            </button>
            <p>
              Already have an account?{" "}
              <Link to="/login" className="signUpLink">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUpPage;
