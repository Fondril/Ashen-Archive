import Banner from "./banner/banner";
import FeaturedGames from "./featuredGames/featuredGames";
import HomePageCTA from "./homePageCTA/homePageCTA";
import TopRated from "./topRated/topRated";

function HomePage() {
  return (
    <>
      <Banner homepage />
      <TopRated />
      <FeaturedGames />
      <HomePageCTA />
    </>
  );
}

export default HomePage;
