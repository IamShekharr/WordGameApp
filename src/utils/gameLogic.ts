export const THEME_WORDS: Record<string, string[]> = {
  animals: [
    'CAT', 'DOG', 'RAT', 'BAT', 'HEN', 'COW', 'PIG', 'ANT', 'BEE',
    'LION', 'BEAR', 'DEER', 'WOLF', 'FROG', 'DUCK', 'FISH', 'BIRD', 'CRAB',
    'HORSE', 'TIGER', 'SNAKE', 'EAGLE', 'SHARK', 'WHALE', 'CAMEL', 'ZEBRA', 'PANDA',
    'RABBIT', 'MONKEY', 'PARROT', 'TURTLE', 'LIZARD', 'DONKEY',
    'ELEPHANT', 'PENGUIN', 'DOLPHIN', 'GIRAFFE', 'LEOPARD',
  ],
  food: [
    'PIE', 'JAM', 'EGG', 'NUT', 'OAT', 'RYE', 'FIG', 'YAM',
    'RICE', 'CAKE', 'SOUP', 'MEAT', 'CORN', 'BEAN', 'PEAR', 'PLUM', 'LIME',
    'BREAD', 'PASTA', 'PIZZA', 'SALAD', 'STEAK', 'CREAM', 'GRAPE', 'MANGO', 'OLIVE',
    'BURGER', 'NOODLE', 'CHEESE', 'BUTTER', 'CARROT', 'GARLIC', 'POTATO',
    'CHICKEN', 'BROCCOLI', 'SANDWICH',
  ],
  science: [
    'ION', 'GAS', 'LAB', 'DNA', 'RNA',
    'ATOM', 'CELL', 'GENE', 'ACID', 'BASE', 'MASS', 'HEAT', 'WAVE', 'LENS',
    'FORCE', 'LASER', 'OXIDE', 'SOLAR', 'LUNAR', 'NERVE', 'VIRUS', 'METAL',
    'ENERGY', 'PROTON', 'NEURON', 'PLASMA', 'MAGNET', 'CARBON',
    'GRAVITY', 'NEUTRON', 'ELEMENT', 'NUCLEUS', 'VACCINE',
    'ELECTRON', 'MOLECULE', 'CHEMICAL', 'ORGANISM',
  ],
  countries: [
    'IRAN', 'IRAQ', 'OMAN', 'PERU', 'CUBA', 'FIJI', 'MALI', 'CHAD',
    'CHINA', 'INDIA', 'ITALY', 'JAPAN', 'SPAIN', 'EGYPT', 'GHANA', 'KENYA', 'NEPAL',
    'FRANCE', 'RUSSIA', 'BRAZIL', 'CANADA', 'GREECE', 'MEXICO', 'TURKEY', 'ISRAEL',
    'GERMANY', 'ENGLAND', 'NIGERIA', 'DENMARK', 'SWEDEN', 'IRELAND', 'AUSTRIA',
    'PORTUGAL', 'THAILAND', 'PAKISTAN', 'COLOMBIA', 'AUSTRALIA',
  ],
  music: [
    'JAM', 'POP', 'RAP', 'HIT', 'GIG',
    'BEAT', 'BASS', 'TUNE', 'SONG', 'BAND', 'DRUM', 'JAZZ', 'ROCK', 'SOUL', 'FOLK',
    'CHORD', 'TEMPO', 'PITCH', 'LYRIC', 'DISCO', 'BLUES', 'VOCAL', 'RADIO',
    'MELODY', 'RHYTHM', 'GUITAR', 'SINGER', 'CHORUS', 'BRIDGE', 'VIOLIN',
    'CONCERT', 'HARMONY', 'TRUMPET', 'ORCHESTRA', 'SYMPHONY',
  ],
  valentine: [
    'LOVE', 'KISS', 'ROSE', 'GIFT', 'CARE', 'DEAR', 'FOND',
    'HEART', 'SWEET', 'BLOOM', 'BLISS', 'CHARM', 'CUPID', 'LOVER', 'ANGEL',
    'CHERISH', 'TENDER', 'ADORE', 'ROMANCE', 'DEVOTED',
    'PASSION', 'EMBRACE', 'DARLING', 'BELOVED', 'FOREVER', 'PROMISE',
  ],
};

export const DAILY_LETTERS = [
  ['E', 'H', 'S', 'I', 'N', 'B', 'T', 'G', 'O', 'R'],
  ['A', 'L', 'E', 'N', 'T', 'S', 'R', 'C', 'I', 'P'],
  ['M', 'O', 'U', 'N', 'T', 'A', 'I', 'N', 'S', 'E'],
  ['F', 'L', 'O', 'W', 'E', 'R', 'S', 'T', 'A', 'G'],
  ['B', 'R', 'I', 'G', 'H', 'T', 'S', 'U', 'N', 'L'],
  ['C', 'H', 'A', 'M', 'P', 'I', 'O', 'N', 'S', 'E'],
  ['W', 'O', 'R', 'D', 'S', 'M', 'A', 'K', 'E', 'R'],
];

export const WORD_OF_DAY = [
  {
    word: 'FORTIFY',
    definition: 'To strengthen or reinforce against attack.',
    pos: 'Verb',
    pronunciation: '/ˈfɔːr.tɪ.faɪ/',
    synonyms: ['strengthen', 'reinforce', 'bolster'],
  },
  {
    word: 'LOITER',
    definition: 'To stand or wait around idly without purpose.',
    pos: 'Verb',
    pronunciation: '/ˈlɔɪ.tər/',
    synonyms: ['linger', 'dawdle', 'hang around'],
  },
  {
    word: 'SATIRE',
    definition: 'Using humor or irony to criticize society.',
    pos: 'Noun',
    pronunciation: '/ˈsæt.aɪr/',
    synonyms: ['parody', 'irony', 'mockery'],
  },
  {
    word: 'BENIGN',
    definition: 'Gentle and kindly, not harmful.',
    pos: 'Adjective',
    pronunciation: '/bɪˈnaɪn/',
    synonyms: ['harmless', 'gentle', 'kind'],
  },
  {
    word: 'CANDOR',
    definition: 'The quality of being open and honest.',
    pos: 'Noun',
    pronunciation: '/ˈkæn.dər/',
    synonyms: ['honesty', 'frankness', 'openness'],
  },
];

export const getTodayLetters = (): string[] => {
  const day = Math.floor(Date.now() / 86400000);
  return DAILY_LETTERS[day % DAILY_LETTERS.length];
};

export const getWordOfDay = () => {
  const day = Math.floor(Date.now() / 86400000);
  return WORD_OF_DAY[day % WORD_OF_DAY.length];
};

export const canFormWord = (word: string, letters: string[]): boolean => {
  const available = [...letters];
  for (const char of word.toUpperCase()) {
    const idx = available.indexOf(char);
    if (idx === -1) return false;
    available.splice(idx, 1);
  }
  return true;
};

export const validateWord = async (word: string): Promise<boolean> => {
  if (word.length < 3) return false;
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    );
    return res.ok;
  } catch {
    return word.length >= 3;
  }
};

export const calculateScore = (word: string, timeBonus: number = 0): number => {
  const base = word.length * 10;
  const lengthBonus = word.length >= 6 ? 20 : word.length >= 5 ? 10 : 0;
  return base + lengthBonus + timeBonus;
};

export const generateLetters = (count: number = 10): string[] => {
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W'];
  const letters: string[] = [];
  const vowelCount = Math.floor(count * 0.4);
  for (let i = 0; i < vowelCount; i++) {
    letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
  }
  for (let i = vowelCount; i < count; i++) {
    letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
  }
  return letters.sort(() => Math.random() - 0.5);
};