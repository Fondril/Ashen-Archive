import "./userPageFavouriteGame.scss";

import { useState } from "react";
import { Link } from "react-router-dom";

import { db } from "../../../config/Config";
import { doc, runTransaction, deleteField } from "firebase/firestore";

import XIcon from "../../../gallery/XIcon.png";

function UserPageFavouriteGame(props) {
  const [isVisible, setIsVisible] = useState(false);

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
        const prevNumberOfPeopleFavourited = Number(
          gameData.websiteStatistics.numberOfPeopleFavourited || 0
        );
        // get user data
        const userSnap = await transaction.get(userRef);
        const userData = userSnap.data();
        const numberOfGamesFavourited = Number(
          userData.numberOfGamesFavourited || 0
        );
        // remove game
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
          [`gamesFavourited.${props.id}`]: deleteField(), // Remove this specific game
        };
        transaction.update(userRef, userDatabaseUpdate);
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
    if (props.onGameChange) {
      props.onGameChange();
    }
  }

  return (
    <Link to={`/games/${props.id}`}>
      <div
        className="favouriteGame"
        onMouseEnter={() => {
          setIsVisible(true);
        }}
        onMouseLeave={() => {
          setIsVisible(false);
        }}
      >
        <img
          className="favouriteGameImage"
          src={props?.backgroundImage ?? "no image"}
          alt="game"
        />
        <div
          className={`favouriteGameComponentHoverElementsContainer ${
            isVisible ? "favouriteGameShow" : ""
          }`}
        >
          <p>{props?.gameName ?? "Name"}</p>
        </div>
        <div
          className={`favouriteGameComponentHoverRemoveGame ${
            isVisible ? "favouriteGameRemoveGameShow" : ""
          }`}
          onClick={handleRemoveGameClick}
        >
          <img src={XIcon} alt="remove" />
        </div>
      </div>
    </Link>
  );
}

export default UserPageFavouriteGame;
