import axios from 'axios'

export const BASE_URLs = "http://127.0.0.1:8000"; 


const authHeader = () => {
  const token = localStorage.getItem("access");   
  return {
    Authorization: `Bearer ${token}`,             
  };
};


export const getAllEvent = () => {
    return axios.get(`${BASE_URLs}/eventview/`,{
        headers: authHeader()
    })
}


export const addEvent = (data) => {
    return axios.post(`${BASE_URLs}/eventadd/`, data, {
        headers: {
            ...authHeader(),
            'Content-Type': 'multipart/form-data'
        }
    })
}


export const editEvent = (id, data) => {
    return axios.put(`${BASE_URLs}/event_edit/${id}/`, data, {
        headers: {
            ...authHeader(),
            'Content-Type': 'multipart/form-data'
        }
    })
}


export const removeEvent = (id) => {
    return axios.delete(`${BASE_URLs}/event_edit/${id}/`, {
        headers: authHeader()
    })
}


export const getFavEvent = () => {
    return axios.get(`${BASE_URLs}/allfav/`, {
        headers: authHeader()
    })
}


export const addFavEvent = (data, id) => {
    return axios.post(`${BASE_URLs}/fav/${id}/`, data, {
        headers: {
            ...authHeader(),
            "Content-Type": "application/json"
        }
    })
}


export const removeFavEvent = (id) => {
    return axios.delete(`${BASE_URLs}/removefav/${id}/`, {
        headers: authHeader()
    })
}


export const getAllBoking = () => {
    return axios.get(`${BASE_URLs}/booking/`, {
        headers: authHeader()
    })
}


export const eventBooking = (data) => {
    return axios.post(`${BASE_URLs}/booking/`, data, {
        headers: {
            ...authHeader(),
            "Content-Type": "application/json"
        }
    })
}


export const eventBookingList = (id) => {
    return axios.get(`${BASE_URLs}/event/${id}/`);
};


export const custRegistration = (data) => {
    return axios.post(`${BASE_URLs}/register/`,data)
}


export const custLogin = async (data) => {
    const res = await axios.post(`${BASE_URLs}/login/`, data);
    if (res.data.access) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
    }
    return res;
};


export const getAllUser = () => {
    const token = localStorage.getItem("access");

    return axios.get(`${BASE_URLs}/alluser/`, {
        headers: authHeader()
    });
};


export const curretUser = () => {
    return axios.get(`${BASE_URLs}/current-user/`, {
        headers: authHeader()
    })
}


export const userEdit = (id, data) => {
    const token = localStorage.getItem('access');

    return axios.put(`${BASE_URLs}/useredit/${id}/`, data, {
        headers: authHeader()
    })
}


export const sendOTP = (data) => {
  return axios.post(`${BASE_URLs}/password-reset/send-otp/`, data);
};


export const verifyOTP = (data) => {
  return axios.post(`${BASE_URLs}/password-reset/confirm/`, data);
};


export const resetPassword = (data) => {
  return axios.post(`${BASE_URLs}/password-reset/reset/`, data);
};


export const downloadTicket = (id) => {
    return axios.get(`${BASE_URLs}/ticket/${id}`,{
        headers: authHeader(),
        responseType : 'blob'
    })
}
