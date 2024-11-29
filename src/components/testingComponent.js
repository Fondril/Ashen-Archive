import "./testingComponent.scss";
import { useState } from "react";

export default function TestingComponent() {
  const [gameName, setGameName] = useState();

  // function AddingGamesOneAtATime() {
  //   const addGame = async (gameData) => {
  //     // Step 1: Add the game to Firestore and get the generated ID
  //     const docRef = await addDoc(collection(db, "Games"), gameData);
  //     const gameId = docRef.id; // Auto-generated document ID

  //     // Step 2: Update the document to include the ID within its data
  //     await updateDoc(docRef, { id: gameId });

  //     console.log("Game added with ID: ", gameId);
  //   };

  //   // Example usage
  //   addGame({
  //     backgroundImage:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1719426374",
  //     gameName: "Counter-Strike 2",
  //     websiteStatistics: {
  //       rating: 0,
  //       rank: 0,
  //       sumOfRatings: 0,
  //       peopleRated: 0,
  //       peopleWhishlisted: 0,
  //       peopleFavourited: 0,
  //     },
  //     gameDetails: {
  //       genre: ["FPS"],
  //       numberOfPlayers: ["Multiplayer"],
  //       platform: ["Windows"],
  //       publisher: ["Valve"],
  //       developer: ["Valve"],
  //       releaseDate: "Aug 21, 2012",
  //     },

  //     description:
  //       "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2. A free upgrade to CS:GO, Counter-Strike 2 marks the largest technical leap in Counter-Strike’s history. Built on the Source 2 engine, Counter-Strike 2 is modernized with realistic physically-based rendering, state of the art networking, and upgraded Community Workshop tools.",
  //     gameMedia: {
  //       images: [
  //         "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/ss_d830cfd0550fbb64d80e803e93c929c3abb02056.600x338.jpg?t=1719426374",
  //         "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/ss_ef82850f036dac5772cb07dbc2d1116ea13eb163.600x338.jpg?t=1719426374",
  //         "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/ss_ef98db5d5a4d877531a5567df082b0fb62d75c80.600x338.jpg?t=1719426374",
  //       ],
  //       videos: [],
  //     },
  //     minSystemReqs: {
  //       os: "Windows 10",
  //       processor: "4 hardware CPU threads - Intel® Core™ i5 750 or higher",
  //       memory: "8 GB RAM",
  //       graphics:
  //         "Video card must be 1 GB or more and should be a DirectX 11-compatible with support for Shader Model 5.0",
  //       directX: "Version 11",
  //       storage: "85 GB available space",
  //     },
  //     recSystemReqs: {
  //       os: "",
  //       processor: "",
  //       memory: "",
  //       graphics: "",
  //       directX: "",
  //       storage: "",
  //     },
  //   });
  // }

  async function getTestAPI(params) {
    const response = await fetch("/testAPI/1105");
    console.log(response);
    const data = await response.json();
    console.log(data);
    setGameName(data[0].name);
  }

  return (
    <div className="testingPage">
      <div className="testingContainer">
        {/* {error && <h2>{error}</h2>} */}

        <button onClick={getTestAPI}>get test API</button>
        <div clase>The game is{gameName}</div>
      </div>
    </div>
  );
}

// backgroundImage:
// "url",
// gameName: "",
// websiteStatistics: {
// rating: "",
// rank: "",
// numberOfPeopleRated: 0,
// numberOfPeopleStored: 0,
// numberOfPeopleFavourited: 0,
// },
// gameDetails: {
// genre: ["RPG", "Action"],
// numberOfPlayers: ["Singleplayer", "Multiplayer"],
// platform: ["Windows", "PlayStation", "Xbox", "Nintendo Switch"],
// publisher: ["From Software, Inc", "Bandai Namco Entertainment"],
// developer: ["From Software"],
// releaseDate: "May 24, 2018",
// },

// description:
// " ",
// gameMedia: {
// images: [
//   "https://www.nintendo.com/eu/media/images/08_content_images/games_6/nintendo_switch_7/nswitch_darksouls/CI_NSwitch_DarkSoulsRemastered_creation02.jpg",
//   "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570940/ss_3a71463e4ccaf28c5c27f6cf8d32a3a125f45404.600x338.jpg?t=1700659167",
//   "https://www.trueachievements.com/customimages/l/081546.jpg",
// ],
// videos: [],
// },
// minSystemReqs: {
// os: "Windows 7 64-bit",
// processor: "Intel Core i5-2300 2.8 GHz / AMD FX-6300, 3.5 GHz",
// memory: "6 GB RAM",
// graphics: "GeForce GTX 460, 1 GB / Radeon HD 6870, 1 GB",
// directX: "Version 11",
// storage: "8 GB available space",
// },
// recSystemReqs: {
// os: "Windows 10 64-bit",
// processor: "Intel Core i5-4570 3.2 GHz / AMD FX-8350 4.2 GHz",
// memory: "8 GB RAM",
// graphics: "GeForce GTX 660, 2 GB / Radeon HD 7870, 2 GB",
// directX: "Version 11",
// storage: "8 GB available space",
// },
