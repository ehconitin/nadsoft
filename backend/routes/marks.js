const express = require("express");
const pool = require("../db");
const router = express.Router();

// CREATE a new mark for a student
router.post("/", async (req, res) => {
  const { student_id, subject, mark, exam_date } = req.body;

  try {
    const newMark = await pool.query(
      "INSERT INTO marks (student_id, subject, mark, exam_date) VALUES ($1, $2, $3, TO_DATE($4, 'YYYY-MM-DD')) RETURNING mark_id, student_id, subject, mark, TO_CHAR(exam_date, 'YYYY-MM-DD') AS exam_date",
      [student_id, subject, mark, exam_date]
    );

    res.json(newMark.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all marks for all students (not typically used directly without a specific student context)
router.get("/", async (req, res) => {
  try {
    const marks = await pool.query(
      "SELECT mark_id, student_id, subject, mark, TO_CHAR(exam_date, 'YYYY-MM-DD') AS exam_date FROM marks"
    );

    res.json(marks.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ marks for a specific student by student_id
router.get("/:student_id", async (req, res) => {
  const { student_id } = req.params;

  try {
    const studentMarks = await pool.query(
      "SELECT mark_id, student_id, subject, mark, TO_CHAR(exam_date, 'YYYY-MM-DD') AS exam_date FROM marks WHERE student_id = $1",
      [student_id]
    );

    res.json(studentMarks.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a mark by mark_id
router.put("/:mark_id", async (req, res) => {
  const { mark_id } = req.params;
  const { subject, mark, exam_date } = req.body;

  try {
    const updatedMark = await pool.query(
      "UPDATE marks SET subject = $1, mark = $2, exam_date = TO_DATE($3, 'YYYY-MM-DD') WHERE mark_id = $4 RETURNING mark_id, student_id, subject, mark, TO_CHAR(exam_date, 'YYYY-MM-DD') AS exam_date",
      [subject, mark, exam_date, mark_id]
    );

    res.json(updatedMark.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a mark by mark_id
router.delete("/:mark_id", async (req, res) => {
  const { mark_id } = req.params;

  try {
    const deletedMark = await pool.query(
      "DELETE FROM marks WHERE mark_id = $1 RETURNING mark_id, student_id, subject, mark, TO_CHAR(exam_date, 'YYYY-MM-DD') AS exam_date",
      [mark_id]
    );

    res.json(deletedMark.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
