const express = require("express");
const pool = require("../db");
const router = express.Router();

// CREATE a new student
router.post("/", async (req, res) => {
  const { first_name, last_name, date_of_birth, email } = req.body;

  try {
    const newStudent = await pool.query(
      "INSERT INTO students (first_name, last_name, date_of_birth, email) VALUES ($1, $2, TO_DATE($3, 'YYYY-MM-DD'), $4) RETURNING student_id, first_name, last_name, TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth, email",
      [first_name, last_name, date_of_birth, email]
    );

    res.json(newStudent.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all students with pagination
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const studentsQuery = await pool.query(
      "SELECT student_id, first_name, last_name, TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth, email FROM students ORDER BY student_id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const totalCountQuery = await pool.query("SELECT COUNT(*) FROM students");

    const totalCount = parseInt(totalCountQuery.rows[0].count);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      students: studentsQuery.rows,
      meta: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: totalPages,
      },
    });
  } catch (err) {
    console.error("Error fetching students:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// READ a single student by ID with marks
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const student = await pool.query(
      "SELECT student_id, first_name, last_name, TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth, email FROM students WHERE student_id = $1",
      [id]
    );
    const marks = await pool.query(
      "SELECT mark_id, subject, mark, TO_CHAR(exam_date, 'YYYY-MM-DD') AS exam_date FROM marks WHERE student_id = $1",
      [id]
    );

    if (student.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ ...student.rows[0], marks: marks.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a student's information
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, date_of_birth, email } = req.body;
  try {
    const updatedStudent = await pool.query(
      "UPDATE students SET first_name = $1, last_name = $2, date_of_birth = TO_DATE($3, 'YYYY-MM-DD'), email = $4 WHERE student_id = $5 RETURNING student_id, first_name, last_name, TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth, email",
      [first_name, last_name, date_of_birth, email, id]
    );

    if (updatedStudent.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(updatedStudent.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a student
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStudent = await pool.query(
      "DELETE FROM students WHERE student_id = $1 RETURNING student_id, first_name, last_name, TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth, email",
      [id]
    );

    if (deletedStudent.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(deletedStudent.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
