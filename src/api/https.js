import axios from "axios";
import { toLogin, to404Page, setRefreshToken, tokenExpire } from "./utils";

export const saveRefreshtime = (params) => {};

// 錯誤捕捉
const errorHandle = (status, msg, response) => {
  switch (status) {
    case 400:
      to404Page();
      break;

    case 401:
      toLogin()
      break;

    case 403:
      to404Page();
      break;

    case 404:
      to404Page();
      break;

    case 500:
      to404Page();
      break;

    default:
      to404Page();
      break;
  }
};

let url = process.env.VUE_APP_BASE_URL;

// 設定 baseURL
let instance = axios.create({
  // baseURL: url,
  // baseURL: "http://msapi.autoware.com.tw/api",
  baseURL: "/api",
});

// request 攔截
instance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("driverToken");
    token && (config.headers["X-Token"] = `${token}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response 攔截
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      errorHandle(response.status, response.data.error, response);
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);

export default function(method, url, data = null) {
  method = method.toLowerCase();
  if (method == "post") {
    return instance.post(url, data);
  } else if (method == "get") {
    return instance.get(url, { params: data });
  } else if (method == "delete") {
    return instance.delete(url, { params: data });
  } else if (method == "put") {
    return instance.put(url, data);
  } else {
    console.log("未知的 method");
    return false;
  }
}
