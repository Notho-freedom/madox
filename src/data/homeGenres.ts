export type HomeGenreId =
  | 'all'
  | 'sci-fi'
  | 'thriller'
  | 'drama'
  | 'action'
  | 'horror'
  | 'animation'
  | 'documentary'
  | 'fantasy';

export interface HomeGenreOption {
  id: HomeGenreId;
  label: string;
  filterLabels: string[];
  movieGenreId?: number;
  tvGenreId?: number;
}

export const homeGenreOptions: HomeGenreOption[] = [
  {
    id: 'all',
    label: 'All',
    filterLabels: []
  },
  {
    id: 'sci-fi',
    label: 'Sci-Fi',
    filterLabels: ['Sci-Fi', 'Sci-Fi & Fantasy'],
    movieGenreId: 878,
    tvGenreId: 10765
  },
  {
    id: 'thriller',
    label: 'Thriller',
    filterLabels: ['Thriller'],
    movieGenreId: 53
  },
  {
    id: 'drama',
    label: 'Drama',
    filterLabels: ['Drama'],
    movieGenreId: 18,
    tvGenreId: 18
  },
  {
    id: 'action',
    label: 'Action',
    filterLabels: ['Action', 'Action & Adventure'],
    movieGenreId: 28,
    tvGenreId: 10759
  },
  {
    id: 'horror',
    label: 'Horror',
    filterLabels: ['Horror'],
    movieGenreId: 27
  },
  {
    id: 'animation',
    label: 'Animation',
    filterLabels: ['Animation', 'Kids'],
    movieGenreId: 16,
    tvGenreId: 16
  },
  {
    id: 'documentary',
    label: 'Documentary',
    filterLabels: ['Documentary'],
    movieGenreId: 99,
    tvGenreId: 99
  },
  {
    id: 'fantasy',
    label: 'Fantasy',
    filterLabels: ['Fantasy', 'Sci-Fi & Fantasy'],
    movieGenreId: 14,
    tvGenreId: 10765
  }
];

export const defaultHomeGenreId: HomeGenreId = 'all';

export function getHomeGenreOption(genreId: HomeGenreId): HomeGenreOption {
  return (
    homeGenreOptions.find((genre) => genre.id === genreId) ??
    homeGenreOptions[0]
  );
}
