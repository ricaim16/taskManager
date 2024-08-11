const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  note: { type: String, required: true },
  status: { type: Number, default: 0 }
});

const TaskModel = mongoose.model("tasks", TaskSchema);
module.exports = TaskModel;
