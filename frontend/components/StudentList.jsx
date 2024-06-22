import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Pagination } from "react-bootstrap";
import apiService from "../actions/apiService";
import { BiBookContent, BiEdit, BiTrash } from "react-icons/bi";
import MarksForm from "./MarksForm";
import StudentForm from "./StudentForm";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [showAddMarksModal, setShowAddMarksModal] = useState(false);
  const [showStudentFormModal, setShowStudentFormModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingMark, setEditingMark] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const limit = 10;

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, refresh]);

  const fetchData = async (page) => {
    try {
      const data = await apiService.getStudents(page, limit);
      setStudents(data.students);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentFormModal(true);
  };

  const handleDeleteStudent = async (studentId) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this student!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deletedStudent = await apiService.deleteStudent(studentId);
          console.log("Deleted student:", deletedStudent);
          setRefresh(!refresh);
          MySwal.fire("Deleted!", "The student has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting student:", error);
          MySwal.fire("Error!", "Failed to delete the student.", "error");
        }
      }
    });
  };

  const handleShowMarks = async (studentId) => {
    try {
      const marks = await apiService.getMarks(studentId);
      setSelectedStudent({
        ...students.find((student) => student.student_id === studentId),
        marks,
      });
      setShowMarksModal(true);
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  const handleCloseMarksModal = () => {
    setShowMarksModal(false);
    setSelectedStudent(null);
    setEditingMark(null);
  };

  const handleShowAddMarksModal = () => {
    setShowAddMarksModal(true);
  };

  const handleCloseAddMarksModal = () => {
    setShowAddMarksModal(false);
  };

  const handleEditMarks = (mark) => {
    setEditingMark(mark);
    setShowAddMarksModal(true);
  };

  const handleDeleteMarks = async (markId) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this mark!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiService.deleteMark(markId);
          handleShowMarks(selectedStudent.student_id);
          MySwal.fire("Deleted!", "The mark has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting mark:", error);
          MySwal.fire("Error!", "Failed to delete the mark.", "error");
        }
      }
    });
  };

  const refreshStudents = () => {
    setRefresh(!refresh);
  };

  if (students.length === 0) {
    return <p>No students found.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Students List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.student_id}>
              <td>{(currentPage - 1) * limit + index + 1}</td>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.date_of_birth}</td>
              <td>{student.email}</td>
              <td className="d-flex justify-content-end">
                <Button
                  variant="info"
                  onClick={() => handleEditStudent(student)}
                  className="me-2"
                >
                  <BiEdit />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteStudent(student.student_id)}
                  className="me-2"
                >
                  <BiTrash />
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleShowMarks(student.student_id)}
                >
                  <BiBookContent />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showMarksModal} onHide={handleCloseMarksModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Student Marks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div>
              <h4>{`${selectedStudent.first_name} ${selectedStudent.last_name}'s Marks`}</h4>
              {selectedStudent.marks && selectedStudent.marks.length > 0 ? (
                <ul className="list-group">
                  {selectedStudent.marks.map((mark) => (
                    <li
                      key={mark.mark_id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        <strong>Subject:</strong> {mark.subject},{" "}
                        <strong>Mark:</strong> {mark.mark},{" "}
                        <strong>Exam Date:</strong>{" "}
                        {new Date(mark.exam_date).toLocaleDateString()}
                      </span>
                      <span>
                        <Button
                          variant="outline"
                          onClick={() => handleEditMarks(mark)}
                          className=""
                        >
                          <BiEdit />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDeleteMarks(mark.mark_id)}
                        >
                          <BiTrash />
                        </Button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No marks found for this student.</p>
              )}
              <Button
                variant="success"
                onClick={handleShowAddMarksModal}
                className="mt-3"
              >
                Add Marks
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMarksModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <MarksForm
        show={showAddMarksModal}
        handleClose={handleCloseAddMarksModal}
        studentId={selectedStudent ? selectedStudent.student_id : null}
        refreshMarks={() => {
          handleCloseAddMarksModal();
          handleShowMarks(selectedStudent.student_id);
        }}
        marks={editingMark}
      />

      <StudentForm
        show={showStudentFormModal}
        handleClose={() => setShowStudentFormModal(false)}
        student={selectedStudent}
        refreshStudents={refreshStudents}
      />

      <Pagination className="mt-3">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default StudentList;
