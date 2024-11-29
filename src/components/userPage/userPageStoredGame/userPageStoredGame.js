import { useEffect, useState } from "react";
import "./userPageStoredGame.scss";
import { Link } from "react-router-dom";
import { getStoredGameRating } from "../../../logic/logic";
import { db } from "../../../config/Config";
import { doc, runTransaction, deleteField } from "firebase/firestore";

import XIcon from "../../../gallery/XIcon.png";

function UserPageStoredGame(props) {
  const [gameRating, setGameRating] = useState();

  async function handleRemoveGameClick(e) {
    e.stopPropagation();
    e.preventDefault();

    const gameRef = doc(db, "Games", props.id);
    const userRef = doc(db, "Users", props.userId);
    try {
      await runTransaction(db, async (transaction) => {
        // get game data
        const gameSnap = await transaction.get(gameRef);
        if (!gameSnap.exists()) {
          throw new Error("Game does not exist!");
        }
        const gameData = gameSnap.data();
        const numberOfPeopleStored = Number(
          gameData.websiteStatistics.numberOfPeopleStored || 0
        );
        // get user data
        const userSnap = await transaction.get(userRef);
        const userData = userSnap.data();
        const numberOfGamesStored = Number(userData.numberOfGamesStored || 0);
        // remove game
        const userDatabaseUpdate = {
          [`gamesStored.${props.id}`]: deleteField(), // Remove this specific game
        };
        transaction.update(userRef, userDatabaseUpdate);
        transaction.update(userRef, {
          numberOfGamesStored: numberOfGamesStored - 1,
        });
        transaction.update(gameRef, {
          "websiteStatistics.numberOfPeopleStored": numberOfPeopleStored - 1,
        });
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }

    if (props.onGameChange) {
      props.onGameChange();
    }
  }

  useEffect(() => {
    getStoredGameRating(props.userId, props.id, setGameRating);
  }, [props.id, props.userId]);

  return (
    <Link to={`/games/${props.id}`}>
      <div className="storedGame">
        <img
          className="storedGameImage"
          src={props?.backgroundImage ?? "no image"}
          alt="game"
        />
        <div className="storedGameDetailsAndCTA">
          <div className="storedGameDetails">
            <p className="storedGameName">{props?.gameName}</p>
            <p>
              <span>Your rating:</span> {gameRating ?? "Not rated"}
            </p>
            <p>
              <span>Date stored:</span> {props.dateStored ?? ""}
              {}
            </p>
          </div>
          <div className="storedGameCTA" onClick={handleRemoveGameClick}>
            <img src={XIcon} alt="remove" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default UserPageStoredGame;
