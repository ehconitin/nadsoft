import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import StudentForm from "../components/StudentForm";
import StudentList from "../components/StudentList";

function App() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container p-5">
      <div className="d-flex justify-content-between align-items-center mb-4 w-100">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div></div>
          <button
            className="btn btn-primary"
            style={{ height: "40px", minWidth: "150px" }}
            onClick={handleShowModal}
          >
            Add New Student
          </button>
        </div>
      </div>
      <StudentList />

      <StudentForm show={showModal} handleClose={handleCloseModal} />
    </div>
  );
}

export default App;
