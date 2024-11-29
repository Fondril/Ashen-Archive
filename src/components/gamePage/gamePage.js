import "./gamePage.scss";

import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import {
  getCurrentDate,
  getDocumentById,
  getRoundedNumberTo1Decimel,
  getUserRatingForGame,
} from "../../logic/logic";
import { useAuth } from "../..";
import { db } from "../../config/Config";
import { doc, runTransaction, deleteField } from "firebase/firestore";

function GamePage() {
  const [selectedRating, setSelectedRating] = useState("");

  const [game, setGame] = useState();
  const [user, setUser] = useState();
  const { gameId } = useParams();

  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  async function handleSelectChange(e) {
    const ratingValue = Number(e.target.value);
    setSelectedRating(ratingValue);

    const gameRef = doc(db, "Games", gameId);
    const userRef = doc(db, "Users", userId);

    try {
      await runTransaction(db, async (transaction) => {
        // Get the current game data
        const gameSnap = await transaction.get(gameRef);
        const gameData = gameSnap.data();
        const prevSumOfRatings = Number(
          gameData.websiteStatistics.sumOfRatings || 0
        );
        const prevNumberOfPeopleRated = Number(
          gameData.websiteStatistics.numberOfPeopleRated || 0
        );
        // Get the user data
        const userSnap = await transaction.get(userRef);
        const userData = userSnap.data();
        const didUserRate = userData.gamesRated?.[gameId] ? true : false;
        const numberOfGamesRated = Number(userData.numberOfGamesRated || 0);

        // Case 1: First time rating or no previous rating exists
        if (didUserRate === false) {
          const newSumOfRatings = prevSumOfRatings + ratingValue;
          const newNumberOfPeopleRated = prevNumberOfPeopleRated + 1;
          const userDatabaseUpdate = {
            [`gamesRated.${gameId}`]: {
              gameName: gameData.gameName,
              backgroundImage: gameData.backgroundImage,
              gameId: gameData.id,
              rating: ratingValue,
            },
          };
          const newGameRating = newSumOfRatings / newNumberOfPeopleRated;

          transaction.update(gameRef, {
            "websiteStatistics.sumOfRatings": newSumOfRatings,
            "websiteStatistics.numberOfPeopleRated": newNumberOfPeopleRated,
            "websiteStatistics.rating": newGameRating,
          });
          transaction.update(userRef, {
            numberOfGamesRated: numberOfGamesRated + 1,
          });
          transaction.update(userRef, userDatabaseUpdate);
        }

        // Case 2: User has previously rated the game
        else {
          const userRating = Number(userData.gamesRated[gameId].rating);
          const newSumOfRatings = prevSumOfRatings + ratingValue - userRating;

          let userDatabaseUpdate = {
            [`gamesRated.${gameId}`]: {
              gameName: gameData.gameName,
              backgroundImage: gameData.backgroundImage,
              gameId: gameData.id,
              rating: ratingValue,
            },
          };
          let newNumberOfPeopleRated = prevNumberOfPeopleRated;
          let newNumberOfGamesRated = numberOfGamesRated;
          if (ratingValue === 0) {
            newNumberOfPeopleRated -= 1; // Decrease count if the user "unrates" the game
            newNumberOfGamesRated -= 1;
            userDatabaseUpdate = {
              [`gamesRated.${gameId}`]: deleteField(), // Remove this specific game
            };
          }
          let newGameRating = newSumOfRatings;
          if (newNumberOfPeopleRated !== 0) {
            newGameRating = newSumOfRatings / newNumberOfPeopleRated;
          }
          console.log(newGameRating);
          transaction.update(gameRef, {
            "websiteStatistics.sumOfRatings": newSumOfRatings,
            "websiteStatistics.numberOfPeopleRated": newNumberOfPeopleRated,
            "websiteStatistics.rating": newGameRating,
          });
          transaction.update(userRef, {
            numberOfGamesRated: newNumberOfGamesRated,
          });
          transaction.update(userRef, userDatabaseUpdate);
        }
      });

      console.log("Transaction successfully committed!");
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
    getDocumentById("Games", gameId, setGame);
  }

  async function handleStoreGame() {
    const gameRef = doc(db, "Games", gameId);
    const userRef = doc(db, "Users", userId);

    try {
      await runTransaction(db, async (transaction) => {
        const gameSnap = await transaction.get(gameRef);
        if (!gameSnap.exists()) {
          throw new Error("Game does not exist!");
        }
        // get game data
        const gameData = gameSnap.data();
        const numberOfPeopleStored = Number(
          gameData.websiteStatistics.numberOfPeopleStored || 0
        );
        // get user data
        const userSnap = await transaction.get(userRef);
        const userData = userSnap.data();
        const numberOfGamesStored = Number(userData.numberOfGamesStored || 0);
        const gameStoredState = userData.gamesStored[gameId];

        const currentDate = getCurrentDate();

        if (gameStoredState === false || !gameStoredState) {
          const userDatabaseUpdate = {
            [`gamesStored.${gameId}`]: {
              gameName: gameData.gameName,
              backgroundImage: gameData.backgroundImage,
              gameId: gameData.id,
              dateStored: currentDate,
            },
          };
          transaction.update(userRef, userDatabaseUpdate);

          transaction.update(userRef, {
            numberOfGamesStored: numberOfGamesStored + 1,
          });
          transaction.update(gameRef, {
            "websiteStatistics.numberOfPeopleStored": numberOfPeopleStored + 1,
          });
        } else {
          const userDatabaseUpdate = {
            [`gamesStored.${gameId}`]: deleteField(), // Remove this specific game
          };
          transaction.update(userRef, userDatabaseUpdate);
          transaction.update(userRef, {
            numberOfGamesStored: numberOfGamesStored - 1,
          });
          transaction.update(gameRef, {
            "websiteStatistics.numberOfPeopleStored": numberOfPeopleStored - 1,
          });
        }
      });

      console.log("Transaction successfully committed!");
    } catch (error) {
      console.error("Transaction falied:", error);
    }
    getDocumentById("Games", gameId, setGame);
    getDocumentById("Users", userId, setUser);
  }

  async function handleFavouriteGame() {
    const gameRef = doc(db, "Games", gameId);
    const userRef = doc(db, "Users", userId);

    try {
      await runTransaction(db, async (transaction) => {
        // Get the current game data
        const gameSnap = await transaction.get(gameRef);
        if (!gameSnap.exists()) {
          throw new Error("Game does not exist!");
        }

        const gameData = gameSnap.data();
        const prevNumberOfPeopleFavourited = Number(
          gameData.websiteStatistics.numberOfPeopleFavourited || 0
        );
        // Get the user's data
        const userSnap = await transaction.get(userRef);
        const userData = userSnap.data();
        const userGameFavouritedState = userData.gamesFavourited?.[gameId] || 0;
        const numberOfGamesFavourited = Number(
          userData.numberOfGamesFavourited || 0
        );

        // Case 1: First time rating or no previous rating exists
        if (userGameFavouritedState === 0) {
          const newNumberOfPeopleFavourited = prevNumberOfPeopleFavourited + 1;
          transaction.update(gameRef, {
            "websiteStatistics.numberOfPeopleFavourited":
              newNumberOfPeopleFavourited,
          });
          transaction.update(userRef, {
            numberOfGamesFavourited: numberOfGamesFavourited + 1,
          });

          // Update the user's stored games in their data
          const userDatabaseUpdate = {
            [`gamesFavourited.${gameId}`]: {
              gameName: gameData.gameName,
              backgroundImage: gameData.backgroundImage,
              gameId: gameData.id,
            },
          };
          transaction.update(userRef, userDatabaseUpdate);
        }

        // Case 2: User has previously favourited the game
        else {
          const newNumberOfPeopleFavourited = prevNumberOfPeopleFavourited - 1;
          transaction.update(gameRef, {
            "websiteStatistics.numberOfPeopleFavourited":
              newNumberOfPeopleFavourited,
          });
          transaction.update(userRef, {
            numberOfGamesFavourited: numberOfGamesFavourited - 1,
          });

          // Update the user's stored games in their data
          const userDatabaseUpdate = {
            [`gamesFavourited.${gameId}`]: deleteField(), // Remove this specific game
          };
          transaction.update(userRef, userDatabaseUpdate);
        }
      });

      console.log("Transaction successfully committed!");
    } catch (error) {
      console.error("Transaction failed: ", error);
    }

    getDocumentById("Games", gameId, setGame);
    getDocumentById("Users", userId, setUser);
  }

  useEffect(() => {
    getDocumentById("Users", userId, setUser);
    getDocumentById("Games", gameId, setGame);
    getUserRatingForGame(userId, gameId, setSelectedRating);

    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [gameId, userId]);

  return (
    <div className="sectionGamePageContainer">
      <div className="gamePageContainer">
        <div className="topFlex gamePageSection">
          <img
            className="gamePageGameImage"
            alt="game"
            src={game?.backgroundImage ?? ""}
          />
          <div className="gameDetails">
            <h1>{game?.gameName ?? "Game name"}</h1>
            <div>
              <span>Mode:</span>
              {game?.gameDetails.numberOfPlayers.join(", ") ?? ""}

              <span>Genre: </span>
              {game?.gameDetails.genre.join(", ") ?? ""}

              <span>Platform: </span>
              {game?.gameDetails.platform.join(", ") ?? ""}

              <span>Publisher: </span>
              {game?.gameDetails.publisher.join(", ") ?? ""}

              <span>Developer: </span>
              {game?.gameDetails.developer.join(", ") ?? ""}

              <span>Release date: </span>
              {game?.gameDetails.releaseDate ?? ""}
            </div>
          </div>
        </div>
        {userId === null || userId === undefined ? (
          <>
            <div className="gamePageSection gamePageNotLoggedInMessage">
              You must be logged in to store games!{" "}
              <NavLink to="/login">Login</NavLink>
            </div>
          </>
        ) : (
          <>
            <div className="websiteStatisticsAndCta gamePageSection">
              <div className="websiteStatistics">
                <div></div>
                <div className="websiteStatisticsComponent">
                  <p>Rating</p>
                  <p>
                    {getRoundedNumberTo1Decimel(
                      game?.websiteStatistics.rating
                    ) === 0
                      ? "0"
                      : getRoundedNumberTo1Decimel(
                          game?.websiteStatistics.rating
                        )}
                  </p>
                  <p>
                    {game?.websiteStatistics.numberOfPeopleRated ?? "0"} users
                  </p>
                </div>
                <div className="websiteStatisticsComponent">
                  <p>Stored by</p>
                  <p>{game?.websiteStatistics.numberOfPeopleStored ?? "0"}</p>
                  {game?.websiteStatistics.numberOfPeopleStored === 1 ? (
                    <p>person</p>
                  ) : (
                    <p>people</p>
                  )}
                </div>
                <div className="websiteStatisticsComponent">
                  <p>Favourited by</p>
                  <p>
                    {game?.websiteStatistics.numberOfPeopleFavourited ?? ""}
                  </p>
                  {game?.websiteStatistics.numberOfPeopleFavourited === 1 ? (
                    <p>person</p>
                  ) : (
                    <p>people</p>
                  )}
                </div>
              </div>
              <div className="cta">
                <div></div>
                <select value={selectedRating} onChange={handleSelectChange}>
                  <option value="0">Select rating</option>
                  <option value="10">(10) Masterpiece</option>
                  <option value="9">(9) Great</option>
                  <option value="8">(8) Very Good</option>
                  <option value="7">(7) Good</option>
                  <option value="6">(6) Fine</option>
                  <option value="5">(5) Average</option>
                  <option value="4">(4) Bad</option>
                  <option value="3">(3) Very Bad</option>
                  <option value="2">(2) Horrible</option>
                  <option value="1">(1) Appaling</option>
                </select>
                <button onClick={handleStoreGame}>
                  {user?.gamesStored[gameId] ? (
                    <p>Remove game</p>
                  ) : (
                    <p>Store game</p>
                  )}
                </button>
                <button onClick={handleFavouriteGame}>
                  {user?.gamesFavourited[gameId] ? (
                    <p>Remove favourite</p>
                  ) : (
                    <p>Favourite</p>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
        <div className="gameDescriptionContainer gamePageSection">
          <h2>Description</h2>
          <div className="gameDescription">{game?.description ?? ""}</div>
        </div>
        <div className="gameMediaSection gamePageSection">
          <h2>Game media</h2>
          <div className="gameMedia">
            {game?.gameMedia.images.map((item) => (
              <img className="gameMediaImage" src={item} alt="game" />
            )) ?? "game media"}
          </div>
        </div>
        <div className="sysReqsSection gamePageSection">
          <h2>System requirements</h2>
          <div className="sysReqs">
            <div className="reqs">
              <h3>Minimum</h3>
              <div>
                <span>OS:</span>
                {game?.minSystemReqs.os ?? ""}
                <span>Processor:</span>
                {game?.minSystemReqs.processor ?? ""}
                <span>Memory:</span>
                {game?.minSystemReqs.memory ?? ""}
                <span>Graphics:</span>
                {game?.minSystemReqs.graphics ?? ""}

                {game?.minSystemReqs.directX === undefined ? (
                  <>
                    <span>DirectX:</span>
                    {game?.minSystemReqs.directX ?? ""}
                  </>
                ) : (
                  ""
                )}

                <span>Storage:</span>
                {game?.minSystemReqs.storage ?? ""}
              </div>
            </div>
            <div className="reqs">
              <h3>Recommended</h3>
              <div>
                <span>OS:</span>
                {game?.recSystemReqs.os ?? ""}

                <span>Processor:</span>
                {game?.recSystemReqs.processor ?? ""}

                <span>Memory:</span>
                {game?.recSystemReqs.memory ?? ""}

                <span>Graphics:</span>
                {game?.recSystemReqs.graphics ?? ""}

                {game?.recSystemReqs.directX === undefined ? (
                  <>
                    <span>DirectX:</span>
                    {game?.recSystemReqs.directX ?? ""}
                  </>
                ) : (
                  ""
                )}

                <span>Storage:</span>
                {game?.recSystemReqs.storage ?? ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default GamePage;
