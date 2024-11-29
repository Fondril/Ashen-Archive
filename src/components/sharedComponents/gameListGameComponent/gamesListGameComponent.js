import { Link } from "react-router-dom";
import "./gamesListGameComponent.scss";
import { getRoundedNumberTo1Decimel } from "../../../logic/logic";

function GamesListGameComponent(prop) {
  return (
    <Link
      to={`/games/${prop.id}`}
      className="gameComponentContainer"
      key={prop.id}
    >
      <div>
        <div className="gameComponentLeftSide">
          <div>
            <img
              className="gameComponentImage"
              src={prop.backgroundImage}
              alt="banner"
            />
          </div>{" "}
          <div className="gameComponentInfo">
            <div className="gameComponentA gameComponentNameA">
              {prop.gameName}
            </div>
            <p>
              <span>Rating: </span>
              {getRoundedNumberTo1Decimel(prop?.gameRating) === 0
                ? "Not rated"
                : getRoundedNumberTo1Decimel(prop?.gameRating)}
            </p>
            <p>
              <span>Genre: </span>
              {prop.genre.join(", ")}
            </p>
            <p>
              <span>Release date: </span>
              {prop.releaseDate}
            </p>
          </div>
        </div>
        <div className="gameComponentRightSide">
          <div className="gameComponentCTA">
            {/* <button className="gameComponentCTAButton">
              <p>Store</p>
            </button> */}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default GamesListGameComponent;
