import { type TMDBCatalogSource } from '../hooks/useTMDB';
import { type HomeGenreOption } from './homeGenres';

export interface HomeSectionConfig {
  id: string;
  title: string;
  description: string;
  source: TMDBCatalogSource;
}

interface HomeSectionSet {
  popularMovies: HomeSectionConfig;
  popularSeries: HomeSectionConfig;
  topRated: HomeSectionConfig;
  trending: HomeSectionConfig;
}

function isAllGenre(genre: HomeGenreOption): boolean {
  return genre.id === 'all';
}

export function getHeroSource(genre: HomeGenreOption): TMDBCatalogSource {
  if (isAllGenre(genre)) {
    return {
      kind: 'trending',
      timeWindow: 'day',
      type: 'all'
    };
  }

  if (genre.movieGenreId) {
    return {
      kind: 'discover',
      genreId: genre.movieGenreId,
      type: 'movie',
      sortBy: 'popularity.desc',
      filterLabels: genre.filterLabels
    };
  }

  return {
    kind: 'trending',
    timeWindow: 'day',
    type: 'all',
    filterLabels: genre.filterLabels
  };
}

export function getHomeSectionSet(genre: HomeGenreOption): HomeSectionSet {
  const genrePrefix = isAllGenre(genre) ? '' : `${genre.label} `;

  return {
    trending: {
      id: 'trending',
      title: isAllGenre(genre) ? 'Trending Now' : `${genre.label} Trends`,
      description:
        isAllGenre(genre) ?
          'The most popular content this week.' :
          `What is trending right now for ${genre.label.toLowerCase()} fans.`,
      source: {
        kind: 'trending',
        timeWindow: 'week',
        type: 'all',
        ...(isAllGenre(genre) ? {} : { filterLabels: genre.filterLabels })
      }
    },
    popularMovies: {
      id: 'popular-movies',
      title: `${genrePrefix}Popular Movies`.trim(),
      description:
        isAllGenre(genre) ?
          'Movies everyone is watching right now.' :
          `Popular ${genre.label.toLowerCase()} movies right now.`,
      source:
        genre.movieGenreId ?
          {
            kind: 'discover',
            genreId: genre.movieGenreId,
            type: 'movie',
            sortBy: 'popularity.desc',
            filterLabels: genre.filterLabels
          } :
          {
            kind: 'popular',
            type: 'movie',
            filterLabels: genre.filterLabels
          }
    },
    topRated: {
      id: 'top-rated',
      title: `${genrePrefix}Top Rated`.trim(),
      description:
        isAllGenre(genre) ?
          'The highest rated movies of all time.' :
          `Top rated ${genre.label.toLowerCase()} movies worth watching.`,
      source:
        genre.movieGenreId ?
          {
            kind: 'discover',
            genreId: genre.movieGenreId,
            type: 'movie',
            sortBy: 'vote_average.desc',
            voteCountGte: 200,
            filterLabels: genre.filterLabels
          } :
          {
            kind: 'topRated',
            type: 'movie',
            filterLabels: genre.filterLabels
          }
    },
    popularSeries: {
      id: 'popular-tv',
      title: `${genrePrefix}Popular Series`.trim(),
      description:
        isAllGenre(genre) ?
          'Binge-worthy series everyone is talking about.' :
          `Popular ${genre.label.toLowerCase()} series and shows.`,
      source:
        genre.tvGenreId ?
          {
            kind: 'discover',
            genreId: genre.tvGenreId,
            type: 'tv',
            sortBy: 'popularity.desc',
            filterLabels: genre.filterLabels
          } :
          {
            kind: 'popular',
            type: 'tv',
            filterLabels: genre.filterLabels
          }
    }
  };
}
