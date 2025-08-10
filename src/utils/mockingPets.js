import { faker } from '@faker-js/faker';

export const generateMockPets = (count = 100) => {
  const pets = [];

  for (let i = 0; i < count; i++) {
    pets.push({
      name: faker.word.noun(), // nombre temático
      specie: faker.helpers.arrayElement(['dog', 'cat', 'rabbit', 'parrot']),
      birthDate: faker.date.past({ years: 10 }),
      adopted: faker.datatype.boolean(),
      image: faker.image.urlPicsumPhotos()
    });
  }

  return pets;
};
