export default class funcionesAxios {
  async get(url) {
    const response = await axios.get(url).catch((err) => console.log(err));
    const resData = await response.res;
    return resData;
  }

  async post(url, data) {
    const response = await axios(url, { method: "POST", data: data }).catch((err) => console.log(err));
    const resData = await response.res;
    return resData;
  }
  async put(url, data) {
    const response = await axios(url, { method: "PUT", data: data }).catch((err) => console.log(err));
    const resData = await response.res;
    return resData;
  }
  async delete(url) {
    const response = await axios(url, { method: "DELETE" }).catch((err) => console.log(err));
    console.log(response);
    const resData = await response.res;
    return resData;
  }
}
