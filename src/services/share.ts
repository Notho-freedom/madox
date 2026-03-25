import { type MovieData } from '../data/movies';

export type ShareOutcome = 'copied' | 'shared';

function buildShareUrl(movie: MovieData): string {
  const tmdbId = movie.tmdbId ?? Number(movie.id);
  const mediaType = movie.mediaType ?? 'movie';
  return `https://www.themoviedb.org/${mediaType}/${tmdbId}`;
}

export async function shareMovie(movie: MovieData): Promise<ShareOutcome> {
  const shareUrl = buildShareUrl(movie);
  const sharePayload = {
    text: movie.description || `Check out ${movie.title} on Madox.`,
    title: movie.title,
    url: shareUrl
  };

  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    await navigator.share(sharePayload);
    return 'shared';
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(shareUrl);
    return 'copied';
  }

  if (typeof window !== 'undefined') {
    window.prompt('Copy this link', shareUrl);
  }

  return 'copied';
}
