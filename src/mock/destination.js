import { getRandomInteger } from "../utils.js";
import { CITIES, DESCRIPTION } from "../const.js";

const remainingCities = [...CITIES];

const generateDestination = () => {
  const randomIndex = getRandomInteger(0, remainingCities.length - 1);
  const city = remainingCities[randomIndex];

  remainingCities.splice(randomIndex, 1);

  return {
    id: crypto.randomUUID(),
    description: DESCRIPTION,
    name: city,
    pictures: Array.from({ length: getRandomInteger(0, 5) }, () => ({
      'src': `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
      'description': `${city} description`
    }))
  };
}

export { generateDestination };
