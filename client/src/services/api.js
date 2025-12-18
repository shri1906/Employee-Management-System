import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// login api function
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    if (!response?.data?.user || !response?.data?.token) {
      throw new Error("Invalid login response from server");
    }
    return {
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// DEPARTMENT_API_FUNCTION

export const createDepartment = async (name, code) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("code", code); 

    const response = await api.post("/departments", formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Create department failed");
  }
};

export const getDepartments = async () => {
  try {
    const response = await api.get("/departments");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Fetch departments failed");
  }
};

export const updateDepartment = async (id, name, code) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("code", code);  
    const response = await api.put(`/departments/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Update department failed");
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Delete department failed");
  }
};

export const createUser = async (userData) => {
  try {
     const response = await api.post("/users", userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Create user failed");
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Fetch users failed");
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await api.put(`/users/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Update user failed");
  }
};


export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Delete user failed");
  }
};


// =========================
// ATTENDANCE API FUNCTIONS
// =========================

// ADMIN: Get today's attendance
export const getTodayAttendance = async () => {
  try {
    const response = await api.get("/attendance/today");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Fetch today's attendance failed"
    );
  }
};

// ADMIN: Mark / update attendance
export const markAttendance = async (data) => {
  try {
    const response = await api.post("/attendance/mark", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Mark attendance failed"
    );
  }
};

// USER: Get own attendance
export const myAttendance = async () => {
  try {
    const response = await api.get("/attendance/me");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Fetch attendance failed"
    );
  }
};

// ADMIN: Monthly attendance report
export const monthlyAttendanceReport = async (month, year) => {
  try {
    const response = await api.get(
      `/attendance/monthly-report?month=${month}&year=${year}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Fetch monthly report failed"
    );
  }
};

// =========================
// LEAVE API FUNCTIONS
// =========================

// USER: Apply leave
export const applyLeave = async (data) => {
  try {
    const response = await api.post("/leave", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Apply leave failed"
    );
  }
};

// USER: My leaves
export const myLeaves = async () => {
  try {
    const response = await api.get("/leave/me");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Fetch my leaves failed"
    );
  }
};

// ADMIN: Get all leaves
export const getAllLeaves = async () => {
  try {
    const response = await api.get("/leave");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Fetch all leaves failed"
    );
  }
};

// ADMIN: Approve / reject leave
export const updateLeaveStatus = async (id, status) => {
  try {
    const response = await api.put(`/leave/${id}`, { status });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Update leave status failed"
    );
  }
};



export default api;
