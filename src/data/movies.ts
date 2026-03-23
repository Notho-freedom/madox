export interface MovieData {
  id: string;
  title: string;
  year: string;
  rating: string;
  color: string;
  videoId: string;
  genre?: string;
  duration?: string;
  description?: string;
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
  duration: '2h 44m',
  description:
  'A young blade runner discovers a long-buried secret that leads him to track down former blade runner Rick Deckard.'
},
{
  id: 'oppenheimer',
  title: 'Oppenheimer',
  year: '2023',
  rating: '8.4',
  color: '#ea580c',
  videoId: 'uYPbbksJxIg',
  genre: 'Drama',
  duration: '3h 00m',
  description:
  'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.'
},
{
  id: 'the-batman',
  title: 'The Batman',
  year: '2022',
  rating: '7.8',
  color: '#b91c1c',
  videoId: 'mqqft2x_Aa4',
  genre: 'Action',
  duration: '2h 56m',
  description:
  'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.'
},
{
  id: 'interstellar',
  title: 'Interstellar',
  year: '2014',
  rating: '8.7',
  color: '#0f766e',
  videoId: 'zSWdZVtXT7E',
  genre: 'Sci-Fi',
  duration: '2h 49m',
  description:
  "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
},
{
  id: 'arrival',
  title: 'Arrival',
  year: '2016',
  rating: '7.9',
  color: '#1d4ed8',
  videoId: 'tFMo3UJ4B4g',
  genre: 'Sci-Fi',
  duration: '1h 56m',
  description:
  'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear.'
},
{
  id: 'ex-machina',
  title: 'Ex Machina',
  year: '2014',
  rating: '7.7',
  color: '#be185d',
  videoId: 'EoQuVnKhxaM',
  genre: 'Thriller',
  duration: '1h 48m',
  description:
  'A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence.'
},
{
  id: 'dune-part-two',
  title: 'Dune: Part Two',
  year: '2024',
  rating: '8.9',
  color: '#ea580c',
  videoId: 'Way9Dexny3w',
  genre: 'Sci-Fi',
  duration: '2h 46m',
  description:
  'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.'
},
{
  id: 'civil-war',
  title: 'Civil War',
  year: '2024',
  rating: '7.6',
  color: '#4b5563',
  videoId: 'aDyQxtg0V2w',
  genre: 'Drama',
  duration: '1h 49m',
  description:
  'A journey across a dystopian future America following a team of military-embedded journalists.'
},
{
  id: 'poor-things',
  title: 'Poor Things',
  year: '2023',
  rating: '8.1',
  color: '#7e22ce',
  videoId: 'RlbR5N6veqw',
  genre: 'Comedy',
  duration: '2h 21m',
  description:
  'The incredible tale of a young woman brought back to life by an eccentric scientist.'
},
{
  id: 'the-creator',
  title: 'The Creator',
  year: '2023',
  rating: '6.8',
  color: '#0f766e',
  videoId: 'ex3C1-5Dhb8',
  genre: 'Sci-Fi',
  duration: '2h 13m',
  description:
  'A former soldier is recruited to hunt down and kill the Creator of a mysterious AI weapon.'
},
{
  id: 'everything-everywhere',
  title: 'Everything Everywhere',
  year: '2022',
  rating: '7.8',
  color: '#be123c',
  videoId: 'wxN1T1uxQ2g',
  genre: 'Action',
  duration: '2h 19m',
  description:
  'An aging Chinese immigrant is swept up in an insane adventure where she alone can save the multiverse.'
},
{
  id: 'tenet',
  title: 'Tenet',
  year: '2020',
  rating: '7.3',
  color: '#1e293b',
  videoId: 'LdOM0x0XDMo',
  genre: 'Sci-Fi',
  duration: '2h 30m',
  description:
  'Armed with only one word, a CIA operative journeys through a twilight world of international espionage.'
},
{
  id: 'the-substance',
  title: 'The Substance',
  year: '2024',
  rating: '7.4',
  color: '#991b1b',
  videoId: 'LNlrGo--gPE',
  genre: 'Horror',
  duration: '2h 20m',
  description:
  'A fading celebrity takes a black-market drug that temporarily creates a younger, better version of herself.'
},
{
  id: 'nosferatu-2024',
  title: 'Nosferatu',
  year: '2024',
  rating: '7.8',
  color: '#1c1917',
  videoId: 'nulvWqYUM8k',
  genre: 'Horror',
  duration: '2h 12m',
  description:
  'A gothic tale of obsession between a haunted young woman and the terrifying vampire infatuated with her.'
},
{
  id: 'inside-out-2',
  title: 'Inside Out 2',
  year: '2024',
  rating: '7.6',
  color: '#f59e0b',
  videoId: 'LEjhY15eCx0',
  genre: 'Animation',
  duration: '1h 36m',
  description:
  'Riley enters puberty and a new set of emotions take control of her mind.'
},
{
  id: 'the-wild-robot',
  title: 'The Wild Robot',
  year: '2024',
  rating: '8.1',
  color: '#16a34a',
  videoId: 'lTELHGtGAH8',
  genre: 'Animation',
  duration: '1h 42m',
  description:
  'A robot shipwrecked on an uninhabited island must learn to adapt to the harsh surroundings.'
},
{
  id: 'gladiator-2',
  title: 'Gladiator II',
  year: '2024',
  rating: '7.0',
  color: '#92400e',
  videoId: '4rgYUipGJNo',
  genre: 'Action',
  duration: '2h 28m',
  description:
  'Lucius enters the Colosseum after his home is conquered by tyrannical emperors of Rome.'
},
{
  id: 'conclave',
  title: 'Conclave',
  year: '2024',
  rating: '7.7',
  color: '#78350f',
  videoId: 'DzUjMVYGNpI',
  genre: 'Thriller',
  duration: '2h 00m',
  description:
  'When the Pope dies, Cardinal Lawrence is tasked with managing the secretive conclave to elect a new one.'
},
{
  id: 'alien-romulus',
  title: 'Alien: Romulus',
  year: '2024',
  rating: '7.3',
  color: '#0c0a09',
  videoId: 'x0XDEhP4MQs',
  genre: 'Horror',
  duration: '1h 59m',
  description:
  'A group of young space colonists come face to face with the most terrifying life form in the universe.'
},
{
  id: 'challengers',
  title: 'Challengers',
  year: '2024',
  rating: '7.5',
  color: '#dc2626',
  videoId: 'VmijOOVwWT0',
  genre: 'Drama',
  duration: '2h 11m',
  description:
  'A former tennis prodigy turned coach transforms her husband from a mediocre player into a world-famous champion.'
},
{
  id: 'furiosa',
  title: 'Furiosa',
  year: '2024',
  rating: '7.5',
  color: '#b45309',
  videoId: 'XJMuhwVlca4',
  genre: 'Action',
  duration: '2h 28m',
  description:
  'The origin story of the renegade warrior Furiosa before her encounter with Mad Max.'
},
{
  id: 'a-quiet-place-day-one',
  title: 'A Quiet Place: Day One',
  year: '2024',
  rating: '6.7',
  color: '#374151',
  videoId: 'YPY7J-flzE8',
  genre: 'Horror',
  duration: '1h 39m',
  description:
  'Experience the day the world went quiet from the perspective of a woman named Sam in New York City.'
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
  duration: '4 Seasons',
  description:
  'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.'
},
{
  id: 'dark',
  title: 'Dark',
  year: '2017',
  rating: '8.8',
  color: '#ca8a04',
  videoId: 'rrwycJ08PSA',
  genre: 'Sci-Fi',
  duration: '3 Seasons',
  description:
  'A family saga with a supernatural twist, set in a German town where the disappearance of two children exposes relationships among four families.'
},
{
  id: 'westworld',
  title: 'Westworld',
  year: '2016',
  rating: '8.5',
  color: '#7e22ce',
  videoId: '9BFx_hEpoKE',
  genre: 'Sci-Fi',
  duration: '4 Seasons',
  description:
  'Set at the intersection of the near future and the reimagined past, it explores a world where every human appetite can be indulged.'
},
{
  id: 'altered-carbon',
  title: 'Altered Carbon',
  year: '2018',
  rating: '7.9',
  color: '#be123c',
  videoId: 'dhFM8akm9a4',
  genre: 'Sci-Fi',
  duration: '2 Seasons',
  description:
  'In a future where consciousness can be transferred to different bodies, a prisoner is given a second chance at life.'
},
{
  id: 'black-mirror',
  title: 'Black Mirror',
  year: '2011',
  rating: '8.7',
  color: '#1e293b',
  videoId: 'jDiYGjp5iFg',
  genre: 'Sci-Fi',
  duration: '6 Seasons',
  description:
  "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations collide with its darkest instincts."
},
{
  id: 'the-expanse',
  title: 'The Expanse',
  year: '2015',
  rating: '8.5',
  color: '#15803d',
  videoId: 'kQuMnECHMHw',
  genre: 'Sci-Fi',
  duration: '6 Seasons',
  description:
  "A police detective, a ship's officer, and a political activist find themselves at the center of a conspiracy that threatens the solar system."
},
{
  id: 'silo',
  title: 'Silo',
  year: '2023',
  rating: '8.1',
  color: '#4b5563',
  videoId: '8ZYhuvIv1pA',
  genre: 'Sci-Fi',
  duration: '2 Seasons',
  description:
  'In a ruined and toxic future, thousands live in a giant underground silo. After its sheriff breaks a cardinal rule, engineer Juliette starts to uncover shocking secrets.'
},
{
  id: 'foundation',
  title: 'Foundation',
  year: '2021',
  rating: '7.6',
  color: '#1d4ed8',
  videoId: 'X4QYV5GTz7c',
  genre: 'Sci-Fi',
  duration: '2 Seasons',
  description:
  'A complex saga of humans scattered on planets throughout the galaxy all living under the rule of the Galactic Empire.'
},
{
  id: 'andor',
  title: 'Andor',
  year: '2022',
  rating: '8.4',
  color: '#ea580c',
  videoId: 'cKOegEuCcfw',
  genre: 'Sci-Fi',
  duration: '2 Seasons',
  description:
  'The tale of the burgeoning rebellion against the Empire and how people and planets became involved.'
},
{
  id: 'stranger-things',
  title: 'Stranger Things',
  year: '2016',
  rating: '8.7',
  color: '#b91c1c',
  videoId: 'b9EkMc79ZSU',
  genre: 'Horror',
  duration: '4 Seasons',
  description:
  'When a young boy disappears, his mother and friends must confront terrifying supernatural forces to get him back.'
},
{
  id: 'the-mandalorian',
  title: 'The Mandalorian',
  year: '2019',
  rating: '8.7',
  color: '#0f766e',
  videoId: 'aOC8E8z_ifw',
  genre: 'Sci-Fi',
  duration: '3 Seasons',
  description:
  'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.'
},
{
  id: 'arcane',
  title: 'Arcane',
  year: '2021',
  rating: '9.0',
  color: '#7e22ce',
  videoId: 'fXmAurh012s',
  genre: 'Animation',
  duration: '2 Seasons',
  description:
  'Set in the utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions.'
},
{
  id: 'the-last-of-us',
  title: 'The Last of Us',
  year: '2023',
  rating: '8.8',
  color: '#166534',
  videoId: 'uLtkt8BonwM',
  genre: 'Drama',
  duration: '2 Seasons',
  description:
  'Joel and Ellie, a pair connected through the harshness of the world they live in, must survive a brutal journey across what remains of the United States.'
},
{
  id: 'house-of-the-dragon',
  title: 'House of the Dragon',
  year: '2022',
  rating: '8.4',
  color: '#991b1b',
  videoId: 'DotnJ7tTA34',
  genre: 'Fantasy',
  duration: '2 Seasons',
  description:
  'An internal succession war within House Targaryen at the height of its power, 172 years before Daenerys Targaryen.'
},
{
  id: 'shogun',
  title: 'Shōgun',
  year: '2024',
  rating: '8.7',
  color: '#78350f',
  videoId: 'o1mGE1hO4RI',
  genre: 'Drama',
  duration: '1 Season',
  description:
  'In Japan in the year 1600, a mysterious European ship is found marooned in a nearby fishing village.'
},
{
  id: 'fallout',
  title: 'Fallout',
  year: '2024',
  rating: '8.5',
  color: '#65a30d',
  videoId: 'V-mugKDQDlg',
  genre: 'Sci-Fi',
  duration: '1 Season',
  description:
  'In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves.'
},
{
  id: 'the-bear',
  title: 'The Bear',
  year: '2022',
  rating: '8.6',
  color: '#ea580c',
  videoId: 'y-cqqAJIXhs',
  genre: 'Drama',
  duration: '3 Seasons',
  description:
  "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop."
},
{
  id: 'blue-eye-samurai',
  title: 'Blue Eye Samurai',
  year: '2023',
  rating: '8.5',
  color: '#1e40af',
  videoId: 'YxSPHKVDIOo',
  genre: 'Animation',
  duration: '1 Season',
  description:
  'In Edo-period Japan, a mixed-race swordsman goes on a quest for revenge against the white men who brought her into the world.'
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