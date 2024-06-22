import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import apiService from "../actions/apiService";
import { formatDate } from "../utils/formatDate";

const StudentForm = ({ show, handleClose, student, refreshStudents }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.first_name,
        lastName: student.last_name,
        email: student.email,
        dateOfBirth: student.date_of_birth,
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDateOfBirth = formatDate(formData.dateOfBirth);

    const studentData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      date_of_birth: formattedDateOfBirth,
      email: formData.email,
    };

    try {
      if (student) {
        await apiService.updateStudent(student.student_id, studentData);
      } else {
        await apiService.createStudent(studentData);
      }

      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting student data:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{student ? "Edit Student" : "Add Student"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="dateOfBirth">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StudentForm;