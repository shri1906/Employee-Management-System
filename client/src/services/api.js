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

// USER_api_FUNCTIONS

// const toFormData = (data) => {
//   const formData = new FormData();
//   Object.keys(data).forEach((key) => {
//     if (data[key] !== undefined && data[key] !== "") {
//       formData.append(key, data[key]);
//     }
//   });
//   return formData;
// };

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



export default api;
