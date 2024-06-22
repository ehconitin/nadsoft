import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import apiService from "../actions/apiService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const MarksForm = ({ show, handleClose, studentId, refreshMarks, marks }) => {
  const [formData, setFormData] = useState({
    subject: "",
    mark: "",
    examDate: "",
  });

  useEffect(() => {
    if (marks) {
      setFormData({
        subject: marks.subject,
        mark: marks.mark,
        examDate: marks.exam_date,
      });
    }
  }, [marks]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const markData = {
      subject: formData.subject,
      mark: formData.mark,
      exam_date: formData.examDate,
      student_id: studentId,
    };

    try {
      if (marks) {
        MySwal.fire({
          title: "Update Mark",
          text: "Are you sure you want to update this mark?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await apiService.updateMark(marks.mark_id, markData);
            refreshMarks();
            setFormData({
              subject: "",
              mark: "",
              examDate: "",
            });
            handleClose();
            MySwal.fire(
              "Updated!",
              "Mark details have been updated.",
              "success"
            );
          }
        });
      } else {
        MySwal.fire({
          title: "Add Mark",
          text: "Are you sure you want to add this mark?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, add it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await apiService.addMark(markData);
            refreshMarks();
            setFormData({
              subject: "",
              mark: "",
              examDate: "",
            });
            handleClose();
            MySwal.fire("Added!", "New mark has been added.", "success");
          }
        });
      }
    } catch (error) {
      console.error("Error submitting mark data:", error);
      MySwal.fire("Error!", "Failed to submit mark data.", "error");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} style={{ maxWidth: "90vw" }}>
      <Modal.Header closeButton>
        <Modal.Title>{marks ? "Update Marks" : "Add Marks"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="subject">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="mark">
            <Form.Label>Mark</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter mark"
              name="mark"
              value={formData.mark}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="examDate">
            <Form.Label>Exam Date</Form.Label>
            <Form.Control
              type="date"
              name="examDate"
              value={formData.examDate}
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

export default MarksForm;
