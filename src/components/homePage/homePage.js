import Banner from "./banner/banner";
import FeaturedGames from "./featuredGames/featuredGames";
import HomePageCTA from "./homePageCTA/homePageCTA";
import TopRated from "./topRated/topRated";

function HomePage() {
  const homepage = true;
  return (
    <>
      <Banner homepage={homepage} />
      <TopRated />
      <FeaturedGames />
      <HomePageCTA />
    </>
  );
}

export default HomePage;
