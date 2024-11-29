import { useAuth } from "../../..";
import ExploreButton from "../../sharedComponents/exploreButton/exploreButton";
import "./homePageCTA.scss";

function HomePageCTA() {
  const { currentUser } = useAuth();
  return (
    <div className="homePageCTASection centerFlex">
      <div className="homePageCTAContainer">
        {currentUser === null || currentUser === undefined ? (
          <ExploreButton buttonText={"Join the Archive!"} linkPath={"/login"} />
        ) : (
          <ExploreButton />
        )}
      </div>
    </div>
  );
}

export default HomePageCTA;
