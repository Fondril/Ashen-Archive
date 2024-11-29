import { Link } from "react-router-dom";
import "./exploreButton.scss";

function ExploreButton(props) {
  function linkPath() {
    if (props.linkPath === null || props.linkPath === undefined) {
      return "/allGames";
    } else {
      return props.linkPath;
    }
  }

  return (
    <Link id="exploreButton" className={props.className} to={linkPath()}>
      {props.buttonText ? (
        <p>{props.buttonText}</p>
      ) : (
        <p>Explore the archive!</p>
      )}
    </Link>
  );
}

export default ExploreButton;
