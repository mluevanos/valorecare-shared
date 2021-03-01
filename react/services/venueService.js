import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "../services/serviceHelpers";

const endpointUrl = `${API_HOST_PREFIX}/api/venues`;

const getById = (id) => {
  const config = {
    method: "GET",
    url: endpointUrl + `/${id}`,
    crossdomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAllPaginated = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: endpointUrl + `/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios(config);
};

const getAllPaginatedV2 = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      endpointUrl + `/paginateV2?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios(config);
};

const searchV2 = (pageIndex, pageSize, query) => {
  const config = {
    method: "GET",
    url:
      endpointUrl +
      `/searchv2?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const add = (payload) => {
  const config = {
    method: "POST",
    url: endpointUrl,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const update = (payload) => {
  const config = {
    method: "PUT",
    url: endpointUrl + `/${payload.id}`,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const remove = (id) => {
  const config = {
    method: "DELETE",
    url: endpointUrl + `/${id}`,
    crossdomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const searchByVenue = (query) => {
  const config = {
    method: "GET",
    url: endpointUrl + `/search?name=${query}`,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
  searchByVenue,
  getById,
  getAllPaginated,
  getAllPaginatedV2,
  add,
  update,
  remove,
  searchV2,
};
