import axios from "axios";

const API_URL = "http://localhost:5000/api";
const apiService = {
  async createStudent(studentData) {
    try {
      const response = await axios.post(`${API_URL}/students`, studentData);
      return response.data;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  },

  async getStudents(page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/students`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },

  async getStudentById(studentId) {
    try {
      const response = await axios.get(`${API_URL}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student with ID ${studentId}:`, error);
      throw error;
    }
  },

  async updateStudent(studentId, updatedStudentData) {
    try {
      const response = await axios.put(
        `${API_URL}/students/${studentId}`,
        updatedStudentData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating student with ID ${studentId}:`, error);
      throw error;
    }
  },

  async deleteStudent(studentId) {
    try {
      const response = await axios.delete(`${API_URL}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting student with ID ${studentId}:`, error);
      throw error;
    }
  },

  async addMark(markData) {
    try {
      const response = await axios.post(`${API_URL}/marks`, markData);
      return response.data;
    } catch (error) {
      console.error("Error creating mark:", error);
      throw error;
    }
  },

  async getMarks(studentId) {
    try {
      const response = await axios.get(`${API_URL}/marks/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching marks for student with ID ${studentId}:`,
        error
      );
      throw error;
    }
  },

  async updateMark(markId, updatedMarkData) {
    try {
      const response = await axios.put(
        `${API_URL}/marks/${markId}`,
        updatedMarkData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating mark with ID ${markId}:`, error);
      throw error;
    }
  },

  async deleteMark(markId) {
    try {
      const response = await axios.delete(`${API_URL}/marks/${markId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting mark with ID ${markId}:`, error);
      throw error;
    }
  },
};

export default apiService;
