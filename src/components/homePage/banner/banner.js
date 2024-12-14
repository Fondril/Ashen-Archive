import "./banner.scss";

import bannerImage from "../../../gallery/bannerImage.jfif";
import ExploreButton from "../../sharedComponents/exploreButton/exploreButton";

function Banner({ homepage }) {
  return (
    <div className="sectionContainer bannerSection">
      <div className="bannerContainer">
        {homepage && (
          <>
            <h1 className="bannerHeader">Ashen Archive</h1>
            <ExploreButton className={"homepageExploreButton"} />
            <h2 className="bannerHeaderH2">Log your journey!</h2>
            <h3 className="bannerHeaderH3">
              Store, favourite and rate games in your personal game archive.
            </h3>
          </>
        )}
        <img className="bannerImage" src={bannerImage} alt="banner" />
      </div>
    </div>
  );
}

export default Banner;
