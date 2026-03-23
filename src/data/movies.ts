export interface MovieData {
  id: string;
  title: string;
  year: string;
  rating: string;
  color: string;
  videoId: string;
  genre?: string;
  duration?: string;
}

export const movies: MovieData[] = [
{
  id: 'blade-runner-2049',
  title: 'Blade Runner 2049',
  year: '2017',
  rating: '8.0',
  color: '#b91c1c',
  videoId: 'gCcx85e7-Kg',
  genre: 'Sci-Fi',
  duration: '2h 44m'
},
{
  id: 'oppenheimer',
  title: 'Oppenheimer',
  year: '2023',
  rating: '8.4',
  color: '#ea580c',
  videoId: 'uYPbbksJxIg',
  genre: 'Drama',
  duration: '3h 00m'
},
{
  id: 'the-batman',
  title: 'The Batman',
  year: '2022',
  rating: '7.8',
  color: '#b91c1c',
  videoId: 'mqqft2x_Aa4',
  genre: 'Action',
  duration: '2h 56m'
},
{
  id: 'interstellar',
  title: 'Interstellar',
  year: '2014',
  rating: '8.7',
  color: '#0f766e',
  videoId: 'zSWdZVtXT7E',
  genre: 'Sci-Fi',
  duration: '2h 49m'
},
{
  id: 'arrival',
  title: 'Arrival',
  year: '2016',
  rating: '7.9',
  color: '#1d4ed8',
  videoId: 'tFMo3UJ4B4g',
  genre: 'Sci-Fi',
  duration: '1h 56m'
},
{
  id: 'ex-machina',
  title: 'Ex Machina',
  year: '2014',
  rating: '7.7',
  color: '#be185d',
  videoId: 'EoQuVnKhxaM',
  genre: 'Thriller',
  duration: '1h 48m'
},
{
  id: 'dune-part-two',
  title: 'Dune: Part Two',
  year: '2024',
  rating: '8.9',
  color: '#ea580c',
  videoId: 'Way9Dexny3w',
  genre: 'Sci-Fi',
  duration: '2h 46m'
},
{
  id: 'civil-war',
  title: 'Civil War',
  year: '2024',
  rating: '7.6',
  color: '#4b5563',
  videoId: 'aDyQxtg0V2w',
  genre: 'Drama',
  duration: '1h 49m'
},
{
  id: 'poor-things',
  title: 'Poor Things',
  year: '2023',
  rating: '8.1',
  color: '#7e22ce',
  videoId: 'RlbR5N6veqw',
  genre: 'Comedy',
  duration: '2h 21m'
},
{
  id: 'the-creator',
  title: 'The Creator',
  year: '2023',
  rating: '6.8',
  color: '#0f766e',
  videoId: 'ex3C1-5Dhb8',
  genre: 'Sci-Fi',
  duration: '2h 13m'
},
{
  id: 'everything-everywhere',
  title: 'Everything Everywhere',
  year: '2022',
  rating: '7.8',
  color: '#be123c',
  videoId: 'wxN1T1uxQ2g',
  genre: 'Action',
  duration: '2h 19m'
},
{
  id: 'tenet',
  title: 'Tenet',
  year: '2020',
  rating: '7.3',
  color: '#1e293b',
  videoId: 'LdOM0x0XDMo',
  genre: 'Sci-Fi',
  duration: '2h 30m'
}];


export const series: MovieData[] = [
{
  id: 'severance',
  title: 'Severance',
  year: '2022',
  rating: '8.7',
  color: '#0e7490',
  videoId: 'xEQP4VVuyrY',
  genre: 'Thriller',
  duration: '4 Seasons'
},
{
  id: 'dark',
  title: 'Dark',
  year: '2017',
  rating: '8.8',
  color: '#ca8a04',
  videoId: 'rrwycJ08PSA',
  genre: 'Sci-Fi',
  duration: '3 Seasons'
},
{
  id: 'westworld',
  title: 'Westworld',
  year: '2016',
  rating: '8.5',
  color: '#7e22ce',
  videoId: '9BFx_hEpoKE',
  genre: 'Sci-Fi',
  duration: '4 Seasons'
},
{
  id: 'altered-carbon',
  title: 'Altered Carbon',
  year: '2018',
  rating: '7.9',
  color: '#be123c',
  videoId: 'dhFM8akm9a4',
  genre: 'Sci-Fi',
  duration: '2 Seasons'
},
{
  id: 'black-mirror',
  title: 'Black Mirror',
  year: '2011',
  rating: '8.7',
  color: '#1e293b',
  videoId: 'jDiYGjp5iFg',
  genre: 'Sci-Fi',
  duration: '6 Seasons'
},
{
  id: 'the-expanse',
  title: 'The Expanse',
  year: '2015',
  rating: '8.5',
  color: '#15803d',
  videoId: 'kQuMnECHMHw',
  genre: 'Sci-Fi',
  duration: '6 Seasons'
},
{
  id: 'silo',
  title: 'Silo',
  year: '2023',
  rating: '8.1',
  color: '#4b5563',
  videoId: '8ZYhuvIv1pA',
  genre: 'Sci-Fi',
  duration: '2 Seasons'
},
{
  id: 'foundation',
  title: 'Foundation',
  year: '2021',
  rating: '7.6',
  color: '#1d4ed8',
  videoId: 'X4QYV5GTz7c',
  genre: 'Sci-Fi',
  duration: '2 Seasons'
},
{
  id: 'andor',
  title: 'Andor',
  year: '2022',
  rating: '8.4',
  color: '#ea580c',
  videoId: 'cKOegEuCcfw',
  genre: 'Sci-Fi',
  duration: '2 Seasons'
},
{
  id: 'stranger-things',
  title: 'Stranger Things',
  year: '2016',
  rating: '8.7',
  color: '#b91c1c',
  videoId: 'b9EkMc79ZSU',
  genre: 'Sci-Fi',
  duration: '4 Seasons'
},
{
  id: 'the-mandalorian',
  title: 'The Mandalorian',
  year: '2019',
  rating: '8.7',
  color: '#0f766e',
  videoId: 'aOC8E8z_ifw',
  genre: 'Sci-Fi',
  duration: '3 Seasons'
},
{
  id: 'arcane',
  title: 'Arcane',
  year: '2021',
  rating: '9.0',
  color: '#7e22ce',
  videoId: 'fXmAurh012s',
  genre: 'Animation',
  duration: '2 Seasons'
}];


export function getYouTubeThumbnail(
videoId: string,
quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'hq')
: string {
  const qualityMap = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault'
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}