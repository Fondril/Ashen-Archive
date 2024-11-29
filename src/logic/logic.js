import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { db } from "../config/Config";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

// REUSABLE FUNCS

// Scrolls window to top of the page on redirect

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Returns current date in dd mm, yyyy format

export function getCurrentDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.toLocaleString("default", { month: "short" });
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  const formattedToday = dd + " " + mm + ", " + yyyy;
  return formattedToday;
}

// Returns a rounded number to 1 decimel

export function getRoundedNumberTo1Decimel(number) {
  let roundedNumber = Math.round(number * 10) / 10;
  return roundedNumber;
}

// NAVIGATION

export async function getSearchBarArrayOfGames(stateSetterArrayOfGames) {
  const docs = await getDocs(collection(db, "Games"));
  const array = [];

  docs.forEach((e) => {
    const item = e.data();
    array.push({
      backgroundImage: item.backgroundImage,
      gameName: item.gameName,
      gameId: item.id,
    });
  });

  const resultArray = array;

  stateSetterArrayOfGames(resultArray);
}

//  HOMEPAGE
//  Fetches documents from firestore database by ID and stores it in state // Takes 3 paramaters

export async function getDocumentById(collectionName, documentId, stateSetter) {
  if (documentId === null || documentId === undefined) {
    stateSetter(null);
  } else {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();
    stateSetter(docData);
  }
}
export async function topRatedSectionGetTopRatedGamesList(stateSetter) {
  const docs = await getDocs(collection(db, "Games"));
  const array = [];
  docs.forEach((e) => {
    array.push(e.data());
  });
  const sortedArrayByRating = array.sort(
    (a, b) => b.websiteStatistics.rating - a.websiteStatistics.rating
  );
  const resultArrayByRating = sortedArrayByRating.slice(0, 5);

  stateSetter(resultArrayByRating);
}
export async function featuredSectionGetRandomFeaturedGames(stateSetter) {
  const docs = await getDocs(collection(db, "Games"));
  const array = [];
  docs.forEach((e) => {
    array.push(e.data());
  });
  const sortedArrayByRandom = array
    .map((game) => ({ game, sort: Math.random() })) // Create a new array with random sort values
    .sort((a, b) => a.sort - b.sort) // Sort based on the random values
    .map(({ game }) => game);
  const resultArrayByRandom = sortedArrayByRandom.slice(0, 9);
  stateSetter(resultArrayByRandom);
}

// ALLGAMESPAGE

// Gets all games, puts them in an array and stores them in a state and a backup state

export async function getAllGamesList(stateSetter, backupStateSetter) {
  const docs = await getDocs(collection(db, "Games"));
  const array = [];
  docs.forEach((e) => {
    array.push(e.data());
  });

  const resultArray = array;

  stateSetter(resultArray);
  backupStateSetter(resultArray);
}

// GAMEPAGE

export async function getGameRating(gameId, stateSetter) {
  const docRef = doc(db, "Games", gameId);
  const docSnap = await getDoc(docRef);
  const docData = docSnap.data();

  const docSumOfRatings = Number(docData.websiteStatistics.sumOfRatings);
  const docNumberOfPeopleRated = Number(
    docData.websiteStatistics.numberOfPeopleRated
  );

  if (docNumberOfPeopleRated === 0) {
    return stateSetter(0);
  }

  const resultRating = docSumOfRatings / docNumberOfPeopleRated;

  stateSetter(resultRating);
}

export async function getUserRatingForGame(userId, gameId, stateSetter) {
  if (userId === null || userId === undefined) {
    return stateSetter(0);
  } else {
    const docRef = doc(db, "Users", userId);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();

    const didUserRate = docData.gamesRated[gameId] ? true : false;
    if (didUserRate === true) {
      const userRating = Number(docData.gamesRated[gameId].rating);
      return stateSetter(userRating);
    } else {
      return stateSetter(0);
    }
  }
}

// USERPAGE

export async function userPageGetUserData(
  collectionName,
  documentId,
  stateSetterUserData,
  stateSetterFavouriteGames,
  stateSetterStoredGames
) {
  // get user data
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);
  const docData = docSnap.data();
  // get stored games
  const storedGames = docData.gamesStored;
  const resultArrayStoredGames = Object.values(storedGames);

  const favGames = docData.gamesFavourited;
  const resultArrayFavouritedGames = Object.values(favGames);

  stateSetterStoredGames(resultArrayStoredGames);
  stateSetterFavouriteGames(resultArrayFavouritedGames);
  stateSetterUserData(docData);
}

export async function getStoredGameRating(userId, gameId, stateSetter) {
  // get user data
  const docRef = doc(db, "Users", userId);
  const docSnap = await getDoc(docRef);
  const docData = docSnap.data();

  // get user rating for game
  const resultRating = docData.gamesRated[gameId]?.rating;
  stateSetter(resultRating);
}
