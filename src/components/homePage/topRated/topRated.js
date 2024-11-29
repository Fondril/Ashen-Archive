import { useEffect, useState } from "react";
import "./topRated.scss";
import { topRatedSectionGetTopRatedGamesList } from "../../../logic/logic";
import GamesListGameComponent from "../../sharedComponents/gameListGameComponent/gamesListGameComponent";

function TopRated() {
  const [topRatedGamesList, setTopRatedGamesList] = useState([]);

  useEffect(() => {
    topRatedSectionGetTopRatedGamesList(setTopRatedGamesList);
  }, []);

  return (
    <div className="topRatedSection centerFlex">
      <div className="topRatedContainer">
        <h1 className="topRatedHeader">Top rated games</h1>

        <div className="topRatedGamesListContainer">
          {topRatedGamesList.map((item) => (
            <>
              <div className="topRatedGamesListComponentRankWrapper">
                <div className="topRatedGamesListComponentRank">
                  {topRatedGamesList.indexOf(item) + 1}#
                </div>
              </div>
              <GamesListGameComponent
                id={item.id}
                backgroundImage={item.backgroundImage}
                gameName={item.gameName}
                gameRating={item.websiteStatistics.rating}
                genre={item.gameDetails.genre}
                releaseDate={item.gameDetails.releaseDate}
              />
              <div></div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopRated;
