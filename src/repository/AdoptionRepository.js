import GenericRepository from "./GenericRepository.js";

export default class AdoptionRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    getAllPopulated = () => {
        return this.dao.getAllPopulated();
    }
    create = (data) => {
  return this.dao.save(data);
}
}
