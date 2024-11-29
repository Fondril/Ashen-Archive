import "./allGamesPage.scss";
import { useEffect, useState } from "react";
import { getAllGamesList } from "../../logic/logic";
import GamesListGameComponent from "../sharedComponents/gameListGameComponent/gamesListGameComponent";

function AllGamesPage() {
  const [presentedList, setPresentedList] = useState([]);
  const [allGamesList, setAllGamesList] = useState([]);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedSort, setSelectedSort] = useState();

  const listOfGenres = [
    "Strategy",
    "FPS",
    "BattleRoyale",
    "Roguelite",
    "Hack & Slash",
    "Simulation",
    "Racing",
    "Grand Strategy",
    "Turn-based",
    "Horror",
    "MMO",
    "RPG",
    "Action",
    "Puzzle",
    "Adventure",
    "Platformer",
    "Sandbox",
    "Shooter",
    "Survival",
    "Fighting",
  ];

  const listOfPlayerCategories = ["Singleplayer", "CO-OP", "Multiplayer"];

  // Sets presentedList to be an array of all games and a backup allGamesList to reference

  useEffect(() => {
    getAllGamesList(setPresentedList, setAllGamesList);
  }, []);

  /// FUNCTIONS TO MODIFY PRESENTEDLIST ///

  // Updating the genre array

  function handleGenreToggle(genre) {
    setSelectedGenres((prevSelectedGenres) => {
      const genresResult = prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter((g) => g !== genre) // Remove if already selected
        : [...prevSelectedGenres, genre]; // Add if not selected
      handleFilterLogic(genresResult, selectedPlayers, selectedSort);
      return genresResult;
    });
  }

  // Upadting the players array

  function handlePlayersToggle(players) {
    setSelectedPlayers((prevSelectedPlayers) => {
      const playersResult = prevSelectedPlayers.includes(players)
        ? prevSelectedPlayers.filter((g) => g !== players) // Remove if already selected
        : [...prevSelectedPlayers, players]; // Add if not selected
      handleFilterLogic(selectedGenres, playersResult, selectedSort);
      return playersResult;
    });
  }

  // Updating the sort state

  function handleSortToggle(sortState) {
    setSelectedSort((prevSort) => {
      const sortResult = prevSort === sortState ? prevSort : sortState;
      handleFilterLogic(selectedGenres, selectedPlayers, sortResult);
      return sortResult;
    });
  }

  // Update presentedGames based on genres selected and then based on players selected
  // then sorts if a sort is selected
  // if none selected shows all games

  function handleFilterLogic(genres, players, sort) {
    let filteredList = allGamesList;

    if (genres.length > 0) {
      filteredList = filteredList.filter((item) =>
        item.gameDetails.genre.some((genre) => genres.includes(genre))
      );
    }

    if (players.length > 0) {
      filteredList = filteredList.filter((item) =>
        players.some((playerType) =>
          item.gameDetails.numberOfPlayers.includes(playerType)
        )
      );
    }

    if (sort !== 0) {
      switch (sort) {
        case "byName":
          filteredList = filteredList.sort((a, b) =>
            a.gameName.localeCompare(b.gameName)
          );
          break;
        case "byRating":
          filteredList = filteredList.sort((a, b) =>
            a.websiteStatistics.rating < b.websiteStatistics.rating ? 1 : -1
          );
          break;
        case "byReleaseDate":
          filteredList = filteredList.sort(
            (a, b) =>
              new Date(b.gameDetails.releaseDate) -
              new Date(a.gameDetails.releaseDate)
          );
          break;
        default:
          break;
      }
    }

    setPresentedList(filteredList);
  }

  return (
    <div className="allGamesPage">
      <div className="allGamesPageGamesList">
        <div className="allGamesPageGamesListTopBar">
          <div className="allGamesPageGamesListTopBarLeftSide">
            <div
              className={`topBarElement ${
                selectedSort === "byName" ? "topBarActive" : ""
              }`}
              onClick={() => handleSortToggle("byName")}
            >
              By name
            </div>
            <div
              className={`topBarElement ${
                selectedSort === "byRating" ? "topBarActive" : ""
              }`}
              onClick={() => handleSortToggle("byRating")}
            >
              By rating
            </div>
            <div
              className={`topBarElement ${
                selectedSort === "byReleaseDate" ? "topBarActive" : ""
              }`}
              onClick={() => handleSortToggle("byReleaseDate")}
            >
              By release date
            </div>
          </div>
        </div>
        <div className="allGamesleftBarAndGamesList">
          <div className="allGamesPageGamesListLeftBar">
            <div className="leftBarContainer">
              <div className="allGamesPageGamesListLeftBarCategory">
                <div>By genre</div>
                <div className="allGamesPageGamesListLeftBarSubCategory allGamesPageByGenreHeight">
                  {listOfGenres.map((genre) => (
                    <>
                      <div
                        className={`leftBarElement ${
                          selectedGenres.includes(genre) ? "leftBarActive" : ""
                        }`}
                        onClick={() => {
                          handleGenreToggle(genre);
                        }}
                      >
                        <p>{genre}</p>
                      </div>
                    </>
                  ))}
                </div>
              </div>
              <div className="allGamesPageGamesListLeftBarCategory">
                By players
                <div className="allGamesPageGamesListLeftBarSubCategory allGamesPageByPlayersHeight">
                  {listOfPlayerCategories.map((players) => (
                    <>
                      <div
                        className={`leftBarElement ${
                          selectedPlayers.includes(players)
                            ? "leftBarActive"
                            : ""
                        }`}
                        onClick={() => {
                          handlePlayersToggle(players);
                        }}
                      >
                        {players}
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="allGamesPagePresentedGamesList">
            {presentedList.map((item) => (
              <GamesListGameComponent
                id={item.id}
                backgroundImage={item.backgroundImage}
                gameName={item.gameName}
                gameRating={item.websiteStatistics.rating}
                genre={item.gameDetails.genre}
                releaseDate={item.gameDetails.releaseDate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllGamesPage;
