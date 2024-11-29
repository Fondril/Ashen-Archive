import { Link } from "react-router-dom";
import "./navigationSearchComponent.scss";

function NavigationSearchComponent(props) {
  function handleLinkClick() {
    props.setSearchInputValue("");
    props.setSearchState("");
  }
  return (
    <Link
      onClick={handleLinkClick}
      to={`/games/${props.gameId}`}
      className="navigationSearchComponent"
    >
      <img src={props.backgroundImage} alt="game" />
      <p>{props.gameName}</p>
    </Link>
  );
}

export default NavigationSearchComponent;
