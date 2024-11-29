import "./passwordResetPage.scss";

import { useRef, useState } from "react";
import { auth } from "../../config/Config";
import { useAuth } from "../../index";
import { Link } from "react-router-dom";
import Banner from "../homePage/banner/banner";

function PasswordResetPage() {
  const emailRef = useRef();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();

  const { resetPassword } = useAuth();

  function handeSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      resetPassword(auth, emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      return setError("Failed to reset password");
    }
    setLoading(false);
  }

  return (
    <>
      <Banner />

      <div className="passwordResetContainer">
        <form
          autoComplete="off"
          className="passwordResetForm"
          onSubmit={handeSubmit}
        >
          <h1>Password Reset</h1>
          <div className="passwordResetInputComponent">
            <label>Email</label>
            <input
              className="passwordResetInput"
              type="email"
              spellCheck="false"
              ref={emailRef}
            ></input>
          </div>
          <div className="passwordResetCTA">
            {message && <h2>{message}</h2>}
            {error && <h2>{error}</h2>}
            <button type="submit" id="passwordResetButton" disabled={loading}>
              Reset
            </button>
            <p>
              Back to{" "}
              <Link to="/logIn" className="passwordResetLink">
                Log in
              </Link>
            </p>
            <p>
              Don't have an account?{" "}
              <Link to="/signUp" className="passwordResetLink">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default PasswordResetPage;
