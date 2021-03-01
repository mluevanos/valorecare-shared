import axios from 'axios';
import {
  onGlobalSuccess,
  onGlobalError,
  API_HOST_PREFIX,
} from './serviceHelpers';

const endpoint = `${API_HOST_PREFIX}/api/event`;

const allEvents = (pageIndex, pageSize) => {
  const config = {
    method: 'GET',
    url: endpoint + `/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const updateEvent = (payload) => {
  const config = {
    method: 'PUT',
    url: endpoint + '/' + payload.id,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config).then(() => {});
};

const addEvent = (payload) => {
  const config = {
    method: 'POST',
    url: endpoint,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: {},
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addEventParticipant = (payload) => {
  const config = {
    method: 'POST',
    url: `${endpoint}/eventparticipants`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const removeEventParticipant = (payload) => {
  const config = {
    method: 'POST',
    url: `${endpoint}/eventparticipantsremove`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addEventWizard = (payload) => {
  const config = {
    method: 'POST',
    url: `${endpoint}/wizard`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteEvent = (EventId) => {
  const config = {
    method: 'DELETE',
    url: endpoint + '/' + EventId,
    withCredentials: true,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config)
    .then(onGlobalSuccess)
    .then(() => EventId)
    .catch(onGlobalError);
};
const getById = (jobId) => {
  const config = {
    method: 'GET',
    url: endpoint + '/' + jobId,
    withCredentials: true,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getDetailsById = (eventId) => {
  const config = {
    method: 'GET',
    url: endpoint + '/details/' + eventId,
    withCredentials: true,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getByType = (type) => {
  const config = {
    method: 'GET',
    url: endpoint + `/${type}`,
    withCredentials: true,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getByStatus = (status) => {
  const config = {
    method: 'GET',
    url: endpoint + `/${status}`,
    withCredentials: true,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getSearch = (query, pageIndex, pageSize) => {
  const config = {
    method: 'GET',
    url:
      endpoint +
      `/search?query=${query}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const searchv2 = (pageIndex, pageSize, query) => {
  const config = {
    method: 'GET',
    url: `${endpoint}/searchv2?&pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    withCredentials: true,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
  getSearch,
  getByStatus,
  getByType,
  allEvents,
  deleteEvent,
  updateEvent,
  addEvent,
  getById,
  addEventWizard,
  searchv2,
  addEventParticipant,
  removeEventParticipant,
  getDetailsById,
};
