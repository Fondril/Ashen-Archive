import { useEffect, useState } from "react";
import "./featuredGames.scss";
import { featuredSectionGetRandomFeaturedGames } from "../../../logic/logic";
import FeaturedGamesComponent from "../../sharedComponents/featuredGamesComponent/featuredGamesComponent";
import leftArrowIcon from "../../../gallery/leftArrowIcon.png";
import rightArrowIcon from "../../../gallery/rightArrowIcon.png";

function FeaturedGames() {
  const [featuredGamesList, setFeaturedGamesList] = useState([]);
  const [carouselPositionState, setCarouselPositionState] = useState(0);

  function carouselLeftArrowClickHandle() {
    if (carouselPositionState === 0) {
      setCarouselPositionState(2);
    } else {
      setCarouselPositionState(carouselPositionState - 1);
    }
  }
  function carouselRightArrowClickHandle() {
    if (carouselPositionState === 2) {
      setCarouselPositionState(0);
    } else {
      setCarouselPositionState(carouselPositionState + 1);
    }
  }

  function carouselRenderHandle() {
    const position = carouselPositionState.toString();
    return (
      <div className={`featuredGamesSlider pos${position}`}>
        {featuredGamesList.map((item) => (
          <FeaturedGamesComponent
            className={"pos0"}
            key={item.id}
            id={item.id}
            backgroundImage={item.backgroundImage}
            gameName={item.gameName}
            rating={item.websiteStatistics.rating}
            genre={item.gameDetails.genre}
            releaseDate={item.gameDetails.releaseDate}
          />
        ))}
      </div>
    );
  }

  useEffect(() => {
    featuredSectionGetRandomFeaturedGames(setFeaturedGamesList);
  }, []);
  return (
    <div className="featuredGamesSection centerFlex">
      <div className="featuredGamesContainer">
        <h1 className="featuredGamesHeader">Featured games</h1>
        <div className="featuredGamesCarouselWrapper">
          <div
            className="featuredGamesArrowWrapper"
            onClick={carouselLeftArrowClickHandle}
          >
            <img
              src={leftArrowIcon}
              alt="leftArrow"
              className="featuredGamesArrows"
            />
          </div>
          <div className="featuredGamesListWrapper">
            {carouselRenderHandle()}
          </div>
          <div
            className="featuredGamesArrowWrapper"
            onClick={carouselRightArrowClickHandle}
          >
            <img
              src={rightArrowIcon}
              alt="rightArrow"
              className="featuredGamesArrows"
            />
          </div>
        </div>
        <div className="featuredGamesCarouselDots">
          <>
            <div className="featuredGamesCarouselDotsOuterRing">
              <div
                className={`${
                  carouselPositionState === 0
                    ? "featuredGamesCarouselDotsActive"
                    : ""
                }`}
              ></div>
            </div>
            <div className="featuredGamesCarouselDotsOuterRing">
              <div
                className={`${
                  carouselPositionState === 1
                    ? "featuredGamesCarouselDotsActive"
                    : ""
                }`}
              ></div>
            </div>
            <div className="featuredGamesCarouselDotsOuterRing">
              <div
                className={`${
                  carouselPositionState === 2
                    ? "featuredGamesCarouselDotsActive"
                    : ""
                }`}
              ></div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

export default FeaturedGames;
