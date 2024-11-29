import { NavLink } from "react-router-dom";
import "./navigation.scss";
import searchIcon from "../../gallery/searchIcon.png";
import { useEffect, useState } from "react";
import { useAuth } from "../../index";
import { getSearchBarArrayOfGames } from "../../logic/logic";
import XIcon from "../../gallery/XIcon.png";
import NavigationSearchComponent from "./navigationSearchComponent/navigationSearchComponent";
import LogOutPopUp from "../sharedComponents/logOutPopUp/logOutPopUp";

function Navigation() {
  const [searchState, setSearchState] = useState(false);
  const [arrayOfGames, setArrayOfGames] = useState([]);
  const [fillteredArrayOfGames, setFillteredArrayOfGames] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");

  const [logOutPopUpState, setLogOutPopUpState] = useState(false);

  const { currentUser, userStatePopUp, setUserStatePopUp } = useAuth();

  function handleSearchInputChange(e) {
    if (e.target.value.length !== 0) {
      setSearchInputValue(e.target.value);
      setSearchState(true);
      const lowerCaseQuery = e.target.value.toLowerCase();
      const filteredArray = arrayOfGames.filter((game) =>
        game.gameName.toLowerCase().includes(lowerCaseQuery)
      );
      setFillteredArrayOfGames(filteredArray);
    }
    if (e.target.value.length === 0) {
      setSearchInputValue(e.target.value);
      setSearchState(false);
      setFillteredArrayOfGames([]);
    }
  }
  function HandleOnBlur() {
    setFillteredArrayOfGames([]);
    setSearchState(false);
  }

  function handleLogOutClick() {
    setLogOutPopUpState(true);
  }

  function handleUserStatePopUpClick() {
    setUserStatePopUp({
      logInPopUpState: false,
      signUpPopUpState: false,
      logOutPopUpState: false,
    });
  }

  useEffect(() => {
    getSearchBarArrayOfGames(setArrayOfGames);
  }, []);

  return (
    <>
      {userStatePopUp.logInPopUpState ? (
        <div className="userStatePopUpContainer">
          <p>Successfully logged in!</p>
          <img
            onClick={handleUserStatePopUpClick}
            src={XIcon}
            className="userStatePopUpImage"
            alt="remove"
          />
        </div>
      ) : (
        ""
      )}
      {userStatePopUp.signUpPopUpState ? (
        <div className="userStatePopUpContainer">
          <p>Successfully signed up and logged in!</p>
          <img
            onClick={handleUserStatePopUpClick}
            src={XIcon}
            className="userStatePopUpImage"
            alt="remove"
          />
        </div>
      ) : (
        ""
      )}
      {userStatePopUp.logOutPopUpState ? (
        <div className="userStatePopUpContainer">
          <p>Successfully logged out!</p>
          <img
            onClick={handleUserStatePopUpClick}
            src={XIcon}
            className="userStatePopUpImage"
            alt="remove"
          />
        </div>
      ) : (
        ""
      )}
      <div className="sectionContainer navigationContainer">
        {logOutPopUpState ? (
          <LogOutPopUp setLogOutPopUpState={setLogOutPopUpState} />
        ) : (
          ""
        )}
        {/* // */}
        <div className="navigation">
          <div className="leftSideNavigation">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/allGames">Categories</NavLink>
            <NavLink to="/about_us">About</NavLink>

            {currentUser ? (
              <>
                <NavLink to="/profile">My profile</NavLink>
                <div className="likeNavLink" onClick={handleLogOutClick}>
                  Log out
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signUp">Sign Up</NavLink>
              </>
            )}
          </div>

          <div className="navigationSearch">
            <input
              type="text"
              placeholder="search"
              className="navigationSearchBar"
              onChange={handleSearchInputChange}
              spellCheck="false"
              value={searchInputValue}
              onBlur={HandleOnBlur}
            ></input>
            <button className="navigationSearchBtn">
              <img src={searchIcon} alt="icon" />
            </button>

            {fillteredArrayOfGames.length !== 0 ? (
              <div className="searchResult">
                {fillteredArrayOfGames.map((item) => (
                  <NavigationSearchComponent
                    gameName={item.gameName}
                    backgroundImage={item.backgroundImage}
                    gameId={item.gameId}
                    setSearchInputValue={setSearchInputValue}
                    setSearchState={setSearchState}
                  />
                ))}
              </div>
            ) : (
              <>
                {searchState ? (
                  <div className="searchResult">
                    No games match your search!
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigation;
