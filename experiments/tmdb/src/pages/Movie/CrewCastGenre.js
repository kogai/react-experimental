import React, { useContext, useRef } from 'react';
import useSwr from 'swr';

import { MovieContext } from './MovieContext';

import css from './css/Info.module.css';

export default function CrewCastGenre() {
  const { movie, movieId } = useContext(MovieContext);
  const castEl = useRef(null);

  const { data: credits } = useSwr(
    `https://api.themoviedb.org/3/movie/${movieId}/credits`,
    {
      suspense: true
    }
  );

  function checkClientHeight() {
    if (castEl.current !== null && castEl.current.clientHeight > 24) {
      return true;
    }

    return false;
  }

  function getDirector(crew) {
    const director = crew.find(member => member.department === 'Directing');

    return director.name;
  }

  function generateString(A) {
    const result = [];
    const len = A.length < 3 ? A.length : 3;

    for (let i = 0; i < len; i++) {
      result.push(A[i].name);
    }

    return result.join(', ');
  }

  return (
    <>
      {credits.crew.length > 0 && (
        <li className={css.info}>
          <span className={css.credits}>Director</span>
          {getDirector(credits.crew)}
        </li>
      )}
      {credits.cast.length > 0 && (
        <li className={css.info} ref={castEl}>
          <span className={css.credits}>Starring</span>
          <span style={checkClientHeight() ? { lineHeight: `2rem` } : null}>
            {generateString(credits.cast)}
          </span>
        </li>
      )}
      {movie.genres.length > 0 && (
        <li className={css.info}>
          <span className={css.credits}>Genre</span>
          {generateString(movie.genres)}
        </li>
      )}
    </>
  );
}
