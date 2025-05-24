import CONFIG from "../config";
import { getToken } from "../utils/auth";

const ENDPOINTS = {
  // AUTH
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  // STORY
  STORY_DATA: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  ADD_NEW_STORY: `${CONFIG.BASE_URL}/stories`,
};

// REGISTER FUNCTION
export async function registerUser({ name, email, password }) {
  const user = {
    name,
    email,
    password,
  };
  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// LOGIN FUNCTION
export async function loginUser({ email, password }) {
  const user = {
    email,
    password,
  };
  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// STORY FUNCTION
export async function getStory() {
  const token = getToken();

  const fetchResponse = await fetch(ENDPOINTS.STORY_DATA, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// STORY DETAIL FUNCTION
export async function getStoryDetail(id) {
  const token = getToken();

  const fetchResponse = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// STORE STORY FUNCTION
export async function addNewStory({ description, lat, lon, photos }) {
  const token = getToken();
  const formData = new FormData();
  // formData.append("name", name);
  formData.append("description", description);
  photos.forEach((photo) => {
    formData.append("photo", photo);
  });
  formData.append("lat", lat);
  formData.append("lon", lon);

  // const story = {
  //   name,
  //   description,
  //   lat,
  //   lon,
  //   photoUrl,
  // };
  const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
