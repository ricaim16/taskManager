import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Create() {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:3002/Create", {
      title,
      note
    });
    console.log("Successful submission:", res.data);
    setMessage("Task added successfully!");
    setTitle(""); // Clear form fields
    setNote("");
    navigate("/Home"); // Redirect on success
  } catch (err) {
    console.error("Submission error:", err);
    setMessage("Failed to add task. Please try again.");
  }
};

  return (
    <div>
      <div className="d-flex vh-100 bg-success justify-content-center align-items-center">
        <div className="w-50 bg-white rounded p-3">
          <form onSubmit={handleSubmit}>
            <h2>Add Task</h2>
            <div className="mb-2">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                placeholder="Enter title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="note">Note</label>
              <input
                type="text"
                id="note"
                placeholder="Enter note"
                className="form-control"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            {message && <p className="mt-3">{message}</p>}
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Create;
