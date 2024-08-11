import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Make sure you import axios


function Edit() {
  const { id } = useParams();

  const [title, setTitle] = useState();
  const [note, setNote] = useState();
  const navigate = useNavigate();



    useEffect(() => {
      axios
        .get(`http://localhost:3002/getTask/${id}`)
        .then((result) => {     
              
          setTitle(result.data.title);

          setNote(result.data.note);
        })
        .catch((err) => console.log(err));
    }, []);



    const Update = (e) => {
      e.preventDefault();
      axios
        .put("http://localhost:3002/Edit/" + id, { title ,note  })
        .then((result) => {
          console.log("successful update" + result);
          navigate("/home");
        })
        .catch((err) => console.log(err));
    };






  return (
    <div>
      <div className="d-flex vh-100 bg-success justify-content-center align-items-center">
        <div className="w-50 bg-white rounded p-3">
          <form onSubmit={Update}>
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
            
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Edit
