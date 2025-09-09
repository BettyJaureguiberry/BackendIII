import { adoptionsService, petsService, usersService } from "../services/index.js"

const getAllAdoptions = async (req, res) => {
  const result = await adoptionsService.getAllPopulated();
  res.send({ status: "success", payload: result });
};


const getAdoption = async(req,res)=>{
    const adoptionId = req.params.aid;
    const adoption = await adoptionsService.getBy({_id:adoptionId})
    if(!adoption) return res.status(404).send({status:"error",error:"Adoption not found"})
    res.send({status:"success",payload:adoption})
}

const updatePet = async (req, res) => {
  const petUpdateBody = req.body;
  const petId = req.params.pid;
  const userId = req.user._id; // viene del JWT

  const updatedPet = await petsService.update(petId, petUpdateBody);
  console.log(`[ADOPTION] Updated pet:`, updatedPet);

  await adoptionsService.create({
    owner: userId,
    pet: petId
  });
  console.log(`[ADOPTION] Created adoption for user ${userId} and pet ${petId}`);

  res.send({ status: "success", message: "Pet adopted and registered" });
};

const createAdoption = async(req,res)=>{
    const {uid,pid} = req.params;
    const user = await usersService.getUserById(uid);
    if(!user) return res.status(404).send({status:"error", error:"user Not found"});
    const pet = await petsService.getBy({_id:pid});
    if(!pet) return res.status(404).send({status:"error",error:"Pet not found"});
    if(pet.adopted) return res.status(400).send({status:"error",error:"Pet is already adopted"});
    user.pets.push(pet._id);
    await usersService.update(user._id,{pets:user.pets})
    await petsService.update(pet._id,{adopted:true,owner:user._id})
    const adoption = await adoptionsService.create({
      owner: user._id,
      pet: pet._id
    });

    res.status(200).send({ status: "success", payload: adoption });
}
const deleteAdoption = async (req, res) => {
  const adoptionId = req.params.aid;
  const adoption = await adoptionsService.getBy({ _id: adoptionId });

  if (!adoption) {
    return res.status(404).send({ status: "error", error: "Adoption not found" });
  }

  await adoptionsService.delete(adoptionId);
  res.send({ status: "success", message: "Adoption deleted successfully" });
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
  deleteAdoption
};