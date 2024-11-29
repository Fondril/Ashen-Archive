import "./userPage.scss";

import { useEffect, useState } from "react";

import { userPageGetUserData } from "../../logic/logic";
import { useAuth } from "../..";

import UserPageFavouriteGame from "./userPageFavouriteGame/userPageFavouriteGame";
import UserPageStoredGame from "./userPageStoredGame/userPageStoredGame";

function UserPage() {
  const [userData, setUserData] = useState();
  const [arrayOfFavouriteGames, setArrayOfFavouriteGames] = useState([]);
  const [arrayOfStoredGames, setArrayOfStoredGames] = useState([]);
  const { currentUser } = useAuth();

  function refreshUserPage() {
    userPageGetUserData(
      "Users",
      currentUser.uid,
      setUserData,
      setArrayOfFavouriteGames,
      setArrayOfStoredGames
    );
  }

  useEffect(() => {
    userPageGetUserData(
      "Users",
      currentUser.uid,
      setUserData,
      setArrayOfFavouriteGames,
      setArrayOfStoredGames
    );
  }, [currentUser.uid]);

  return (
    <div className="userPage">
      <div className="userPageContainer">
        <div className="topFlex">
          <img
            className="profileImage"
            src={userData?.profileImage ?? "no image"}
            alt="profile"
          />
          <div className="profileStats">
            <h1>{userData?.username ?? "user undefined"}</h1>
            <div className="profileStatsWrapper">
              <div>Games stored: </div>
              <p>{userData?.numberOfGamesStored ?? "?"}</p>
              <div>Games rated:</div>
              <p> {userData?.numberOfGamesRated ?? "?"}</p>
              <div>Games Favourited: </div>
              <p>{userData?.numberOfGamesFavourited ?? "?"}</p>
              <div>Date joined: </div>
              <p>{userData?.dateJoined ?? "?"}</p>
            </div>
          </div>
        </div>
        <div className="favouriteGamesSection">
          <h2>Favourite Games</h2>
          <div className="favouriteGamesList">
            {arrayOfFavouriteGames.length === 0 ? (
              <p>You haven't favourited any games!</p>
            ) : (
              arrayOfFavouriteGames?.map((item) => (
                <UserPageFavouriteGame
                  gameName={item.gameName}
                  backgroundImage={item.backgroundImage}
                  id={item.gameId}
                  userId={currentUser.uid}
                  onGameChange={refreshUserPage}
                />
              ))
            )}
          </div>
        </div>
        <div className="userPageGamesRegistry">
          <h2>Stored games</h2>
          <div className="userPageGamesRegistryList">
            {arrayOfStoredGames.length === 0 ? (
              <p>You haven't stored any games!</p>
            ) : (
              arrayOfStoredGames?.map((item) => (
                <UserPageStoredGame
                  gameName={item.gameName}
                  backgroundImage={item.backgroundImage}
                  id={item.gameId}
                  userId={currentUser.uid}
                  onGameChange={refreshUserPage}
                  dateStored={item.dateStored}
                />
              ))
            )}
          </div>
        </div>
        {/* <div className="userPageReviews">
          <h2>Reviews</h2>
          <div className="userPageReviewsList">
            List of reviews...Coming soon!
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default UserPage;
