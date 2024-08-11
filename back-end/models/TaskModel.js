const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  note: { type: String, required: true },
  status: { type: Number, default: 0 },
  owner: { type: String, required: true}
});

const TaskModel = mongoose.model("tasks", TaskSchema);
module.exports = TaskModel;
