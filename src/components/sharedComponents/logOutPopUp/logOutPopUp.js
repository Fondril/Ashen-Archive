import { useNavigate } from "react-router-dom";
import { useAuth } from "../../..";
import "./logOutPopUp.scss";

function LogOutPopUp(props) {
  // eslint-disable-next-line
  const { logOut, setUserStatePopUp } = useAuth();
  const navigate = useNavigate();

  function handleMissclick() {
    props.setLogOutPopUpState(false);
  }
  function handleLogOut() {
    logOut();
    props.setLogOutPopUpState(false);
    setUserStatePopUp({
      logInPopUpState: false,
      signUpPopUpState: false,
      logOutPopUpState: true,
    });
    setTimeout(() => {
      setUserStatePopUp({
        logInPopUpState: false,
        signUpPopUpState: false,
        logOutPopUpState: false,
      });
    }, 2000);
    navigate("/login");
  }
  return (
    <div className="logOutPopUpContainer">
      <p>Are you sure you wish to Log out?</p>
      <div className="logOutPopUpCTA">
        <button className="logOutPopUpButton" onClick={handleMissclick}>
          <p>No, i missclicked</p>
        </button>
        <button className="logOutPopUpButton" onClick={handleLogOut}>
          <p>Yes, get me out</p>
        </button>
      </div>
    </div>
  );
}

export default LogOutPopUp;
