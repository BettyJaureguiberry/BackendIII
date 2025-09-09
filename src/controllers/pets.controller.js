import PetDTO from "../dto/Pet.dto.js";
import { petsService,adoptionsService } from "../services/index.js"
import __dirname from "../utils/index.js";
import User from "../dao/models/User.js";
import Pet from "../dao/models/Pet.js";

const getAllPets = async(req,res)=>{
    const pets = await petsService.getAll();
    res.send({status:"success",payload:pets})
}

const createPet = async(req,res)=> {
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}

const updatePet = async (req, res) => {
  const petUpdateBody = req.body;
  const petId = req.params.pid;
  const userId = req.user._id;

  const result = await petsService.update(petId, petUpdateBody);
  console.log(`[ADOPTION] Updated pet:`, result);

  await adoptionModel.create({
    owner: userId,
    pet: petId
  });
    const populatedOwner = await User.findById(userId).select("name email");
  const populatedPet = await Pet.findById(petId).select("name");

  if (!populatedOwner || !populatedPet) {
    console.warn("[ADOPTION WARNING] No se pudo poblar owner o pet para el log.");
  } else {
    console.log(`[ADOPTION SUCCESS] 🐾 ${populatedOwner.name} (${populatedOwner.email}) adoptó a ${populatedPet.name}`);
  }

  res.send({ status: "success", message: "pet adopted and registered" });
};

const deletePet = async(req,res)=> {
    const petId = req.params.pid;
    const result = await petsService.delete(petId);
    res.send({status:"success",message:"pet deleted"});
}

const createPetWithImage = async(req,res) =>{
    const file = req.file;
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    console.log(file);
    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image:`${__dirname}/../public/img/${file.filename}`
    });
    console.log(pet);
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}
const adoptPet = async (req, res, next) => {
  try {
    const petId = req.params.pid;
    const userId = req.user?._id || req.body.owner;

    const pet = await petsService.getBy({ _id: petId });
    if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });
    if (pet.adopted) return res.status(400).send({ status: "error", error: "Pet already adopted" });

    await petsService.update(petId, {
      adopted: true,
      owner: userId
    });

    await adoptionsService.create({
      owner: userId,
      pet: petId
    });

    res.send({ status: "success", message: "Pet adopted successfully" });
  } catch (err) {
    next(err);
  }
};


const getAvailablePets = async (req, res) => {
  const pets = await petsService.getAll({ adopted: false });
  res.send({ status: "success", payload: pets });
};
const getPetsByOwner = async (req, res) => {
  const ownerId = req.params.uid;
  const pets = await petsService.get({ owner: ownerId });
  res.send({ status: "success", payload: pets });
};
export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
  adoptPet,
  getAvailablePets,
  getPetsByOwner
};
