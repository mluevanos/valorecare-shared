import axios from 'axios';
import {
  onGlobalSuccess,
  onGlobalError,
  API_HOST_PREFIX,
} from '../services/serviceHelpers';
import "react-toastify/dist/ReactToastify.css";

const baseUrl = API_HOST_PREFIX + '/api/userprofiles';

const getAll = (pageIndex, pageSize) => {
  const endpoint = `?pageIndex=${pageIndex}&pageSize=${pageSize}`;

  const config = {
    method: 'GET',
    url: baseUrl + endpoint,
    crossdomain: true,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getById = (id) => {
  const config = {
    method: 'GET',
    url: baseUrl + `/${id}`,
    crossdomain: true,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const searchUserProfile = (pageIndex, pageSize, searchString) => {
  const endpoint = `/search?pageIndex=${pageIndex}&pageSize=${pageSize}&searchString=${searchString}`;

  const config = {
    method: 'GET',
    url: baseUrl + endpoint,
    crossdomain: true,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addProfile = (payload) => {
  const config = {
    method: 'POST',
    url: baseUrl,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateById = (payload) => {
  const config = {
    method: 'PUT',
    url: baseUrl + `/${payload.id}`,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const activateUser = (id, statusId) => {
  const endpoint = `/user/${id}/status/${statusId}`;

  const config = {
    method: 'PUT',
    url: baseUrl + endpoint,
    crossdomain: true,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const deleteById = (id) => {
  const config = {
    method: 'DELETE',
    url: baseUrl + `/${id}`,
    crossdomain: true,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
  getAll,
  getById,
  searchUserProfile,
  addProfile,
  updateById,
  activateUser,
  deleteById,
};