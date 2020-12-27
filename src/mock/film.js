import {getFilledList, getRandomBool, getRandomChoice, getRandomNumber, getRandomSlice} from "../tools";
import {
  ACTORS,
  DESCRIPTIONS,
  DIRECTORS,
  TITLES,
  POSTERS,
  WRITERS,
  DURATION_MIN, DURATION_MAX,
  DESCRIPTION_SENTENCES_COUNT_MIN, DESCRIPTION_SENTENCES_COUNT_MAX,
  COUNTRIES,
  GENRES
} from "./film-consts";
import {COMMENTS_COUNT_MIN, COMMENTS_COUNT_MAX} from "./comments-consts";
import {getRandomComment} from "./comment";
import {getRandomDate} from "./tools";


export const getRandomFilm = () => {
  const title = getRandomChoice(TITLES);
  const originalTitle = title;
  const poster = getRandomChoice(POSTERS);
  const description = getRandomSlice(DESCRIPTIONS, getRandomNumber(DESCRIPTION_SENTENCES_COUNT_MIN, DESCRIPTION_SENTENCES_COUNT_MAX)).join(` `);
  const comments = getFilledList(getRandomNumber(COMMENTS_COUNT_MIN, COMMENTS_COUNT_MAX), getRandomComment);
  const actors = getRandomSlice(ACTORS);
  const director = getRandomChoice(DIRECTORS);
  const writers = getRandomSlice(WRITERS);
  const releaseDate = getRandomDate();
  const duration = getRandomNumber(DURATION_MIN, DURATION_MAX);
  const country = getRandomChoice(COUNTRIES);
  const genres = getRandomSlice(GENRES, getRandomNumber(1, 3));
  const rating = getRandomNumber(10, 100) / 10;
  const ageRating = getRandomNumber(0, 18);

  const isInWatchlist = getRandomBool();
  const isAlreadyWatched = getRandomBool();
  const isInFavourites = getRandomBool();
  return {
    title,
    originalTitle,
    director,
    writers,
    releaseDate,
    duration,
    ageRating,
    rating,
    genres,
    country,
    actors,
    poster,
    description,
    comments,
    isInWatchlist,
    isAlreadyWatched,
    isInFavourites
  };
};
