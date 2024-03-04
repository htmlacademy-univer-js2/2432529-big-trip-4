import { getRandomValue, getRandomInteger } from '../utils.js';
import { CITIES, DESCRIPTION } from '../const.js';

function generateDestination () {
  const city = getRandomValue(CITIES);

  return {
    id: crypto.randomUUID(),
    description: DESCRIPTION,
    name: city,
    pictures: Array.from({ length: getRandomInteger(1, 5) }, () => ({
      'src': `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
      'description': `${city} description`
    }))
  };
}

export { generateDestination };
