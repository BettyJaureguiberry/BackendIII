
import bcrypt from 'bcrypt';
import GenericRepository from './GenericRepository.js';

export default class UserRepository extends GenericRepository {
  constructor(dao) {
    super(dao);
  }

  getUserByEmail = (email) => {
    return this.getBy({ email });
  };

  getUserById = (id) => {
    return this.getBy({ _id: id });
  };

  async create(userData) {
  const existingUser = await this.getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;

  return await this.dao.save(userData); // o .create si renombraste
}
  validatePassword = async (email, inputPassword) => {
    const user = await this.getUserByEmail(email);
    if (!user) return false;

    const isValid = await bcrypt.compare(inputPassword, user.password);
    return isValid ? user : false;
  };
}