import "./featuredGamesComponent.scss";

import { Link } from "react-router-dom";
import { useState } from "react";
import { getRoundedNumberTo1Decimel } from "../../../logic/logic";

function FeaturedGamesComponent(props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Link to={`/games/${props.id}`}>
      <div
        className="featuredGameComponentContainer"
        onMouseEnter={() => {
          setIsVisible(true);
        }}
        onMouseLeave={() => {
          setIsVisible(false);
        }}
      >
        <img
          className="featuredGameComponentContainerImage"
          src={props?.backgroundImage ?? "no image"}
          alt="game"
        />
        <div
          className={`featuredGameComponentHoverElementsContainer ${
            isVisible ? "featuredGameShow" : ""
          }`}
        >
          <div className="featuredGameComponentHoverElements">
            <div>
              Name: <span>{props?.gameName ?? "Name"}</span>
            </div>
            <div>
              Rating:{" "}
              <span>
                {getRoundedNumberTo1Decimel(props?.rating) === 0
                  ? "Not rated"
                  : getRoundedNumberTo1Decimel(props?.rating)}
              </span>
            </div>
            <div>
              Genre: <span>{props?.genre.join(", ") ?? "Genre"}</span>
            </div>
            <div>
              Release date:{" "}
              <span>{props?.releaseDate ?? "Release Date??"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default FeaturedGamesComponent;
