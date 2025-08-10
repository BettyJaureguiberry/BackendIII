import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const generateMockUsers = (count = 50) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: `${faker.internet.email()}_${i}`, // evita duplicados
      password: bcrypt.hashSync('coder123', 10),
      role: faker.helpers.arrayElement(['user', 'admin']),
      pets: []
    });
  }

  return users;
};
