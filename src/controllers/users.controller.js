import { usersService } from "../services/index.js";
import { createHash, passwordValidation, generateToken } from "../utils/index.js";

const createUser = async (req, res) => {
  try {
    const userData = { ...req.body };

    if (userData.password) {
      userData.password = await createHash(userData.password);
    }

    const newUser = await usersService.create(userData);

    console.log("🧪 Usuario creado:", newUser);
    res.status(201).send({ status: "success", payload: newUser });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);

    if (error.code === 11000) {
      return res.status(400).send({
        status: "error",
        message: "El email ya está registrado"
      });
    }

    res.status(500).send({
      status: "error",
      message: "Error al crear el usuario",
      details: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersService.getUserByEmail(email);
    if (!user) {
      return res.status(401).send({ status: "error", message: "Credenciales inválidas" });
    }

    const isValid = await passwordValidation(user, password);
    if (!isValid) {
      return res.status(401).send({ status: "error", message: "Credenciales inválidas" });
    }

    const token = generateToken(user);
    res.send({ status: "success", token });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).send({ status: "error", message: "Error al iniciar sesión", details: error.message });
  }
};

const getAllUsers = async (req, res) => {
  const users = await usersService.getAll();
  res.send({ status: "success", payload: users });
};

const getUser = async (req, res) => {
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user) return res.status(404).send({ status: "error", error: "User not found" });
  res.send({ status: "success", payload: user });
};

const updateUser = async (req, res) => {
  const updateBody = req.body;
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user) return res.status(404).send({ status: "error", error: "User not found" });
  const result = await usersService.update(userId, updateBody);
  res.send({ status: "success", message: "User updated" });
};

const deleteUser = async (req, res) => {
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user) return res.status(404).send({ status: "error", error: "User not found" });

  await usersService.delete(userId);
  res.send({ status: "success", message: "User deleted" });
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  loginUser
};