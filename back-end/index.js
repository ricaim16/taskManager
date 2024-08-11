const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const UserModel = require("./models/Users");
const TaskModel = require("./models/TaskModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken package
const app = express();
const SECRET_KEY = "secretkey";

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/auth")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));



// Route to get all users (use with caution in production)
app.get("/signup", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});



// Route to create a new user (signup)
app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Signup error:", err.message); // Log detailed error message
    res
      .status(500)
      .json({
        error: "An error occurred during signup.",
        details: err.message,
      });
  }
});



// Route to handle user login and generate JWT token
app.post("/login", async (req, res) => {
  
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }


    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: "1hr" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during login." });
  }
});

//Call sendMail() with the receiver email and message as parameters
// sendMail("emu@mail.com", "hello world");


app.get("/", (req, res) => {
  TaskModel.find({})
    .then((tasks) => res.json(tasks))
    .catch((err) => res.json(err));
});


// Route to create a new task
app.post("/Create", (req, res) => {
  TaskModel.create(req.body)
  
    .then((tasks) => res.json(tasks))
    .catch((err) => {
      console.error("Error creating task:", err); // Log error details
      res.status(500).json({ error: "Failed to create task", details: err });
    });
});



app.get("/tasks", (req, res) => {
  TaskModel.find({})
    .then((tasks) => res.json(tasks))
    .catch((err) =>
      res.status(500).json({ error: "Failed to fetch tasks", details: err })
    );
});


app.get("/getTask/:id", (req, res) => {
  const id = req.params.id;
  TaskModel.findById({ _id: id })
    .then((tasks) => res.json(tasks))
    .catch((err) => res.json(err));
});


    app.put("/Edit/:id", (req, res) => {
      const id = req.params.id;
      TaskModel.findByIdAndUpdate(
        { _id: id },

        {
          title: req.body.title,
          note: req.body.note,
        }
      )
        .then((tasks) => res.json(tasks))
        .catch((err) => res.json(err));
    });



app.put("/Pin/:id", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  TaskModel.findByIdAndUpdate(
    id, 
    { status },
    { new: true } 
  )
    .then((task) => {
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});



    app.delete("/delete/:id", (req, res) => {
      const id = req.params.id;
      TaskModel.findByIdAndDelete({ _id: id })
        .then((res) => res.json(res)) //  users collection name
        .catch((err) => res.json(err));
    });


//sending mail functionality
function sendMail(email, message)
{

  let mailDetails = {
      from: {
          name: "Kaleb M.",
          email: "no-reply@kalebmelaku97@gmail.com"
      },
      to: email,
      subject: 'Subject of the  ail',
      text: message
  };

  mailTransporter.sendMail(mailDetails, function (err, data)
  {
      if (err) {
          console.log(err);
      } else {
          console.log('Email sent successfully');
      }
  });

}


// Start server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
