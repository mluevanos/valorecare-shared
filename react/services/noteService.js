import axios from "axios";
import {
  onGlobalSuccess,
  onGlobalError,
  API_HOST_PREFIX,
} from "../services/serviceHelpers";

const baseUrl = API_HOST_PREFIX + "/api/notes";

//Search
const searchNotesBySeeker = (searchQuery, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      baseUrl +
      `/bysearchingseeker?searchQuery=${searchQuery}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const searchNotesByProvider = (searchQuery, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      baseUrl +
      `/bysearchingprovider?searchQuery=${searchQuery}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const searchBySeeker = (searchQuery) => {
  const config = {
    method: "GET",
    url: baseUrl + `/search?searchQuery=${searchQuery}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

//Select
const getNotesBySeekerId = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: baseUrl + `/seeker?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getById = (id) => {
  const config = {
    method: "GET",
    url: baseUrl + `/${id}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: baseUrl + `?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getCreatedBy = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: baseUrl + `/createdby?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getListOfSeekerNames = () => {
  const config = {
    method: "GET",
    url: baseUrl + `/listofseekers`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

//Insert
const add = (payload) => {
  const config = {
    method: "POST",
    url: baseUrl,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

//Update
const updateById = (payload, id) => {
  const config = {
    method: "PUT",
    url: baseUrl + `/${id}`,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

//Delete
const deleteById = (id) => {
  const config = {
    method: "DELETE",
    url: baseUrl + `/${id}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
  getAll,
  getById,
  getCreatedBy,
  add,
  updateById,
  deleteById,
  searchBySeeker,
  searchNotesBySeeker,
  searchNotesByProvider,
  getNotesBySeekerId,
  getListOfSeekerNames,
};
