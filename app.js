import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv"
dotenv.config()

const app = express();
const Port=process.env.PORT
app.use(express.json())

const users = [];

app.get("/", (req, res) => {
  res.status(200).send("auth system");
});

app.post("/registartion", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "all fildes required",
    });
  }

  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return res.status(409).json({
      message: "username already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    username: username,
    email: email,
    password: hash,
  };

  users.push(newUser);

  res.status(201).json({
    message: "user created successfully",
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    },
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "all fildes required",
    });
  }

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({
      message: "user not found",
    });
  }

  const isPassCorrect = await bcrypt.compare(password, user.password);

  if(!isPassCorrect){
    return res.status(400).json({
        message: "password is incorrect",
    })
  }

  res.status(200).json({
    message: "login success",
    user: {
        id: user.id,
        username: user.username,
        email: user.email
    }
  })
});

app.listen(Port, () => {
  console.log("server is runnig!");
});
