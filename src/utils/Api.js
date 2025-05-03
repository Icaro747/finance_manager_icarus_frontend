import axios from "axios";

class Api {
  constructor(Logoff, notify) {
    this.logout = Logoff !== undefined ? Logoff : () => { };
    this.baseURL = process.env.REACT_APP_API_URL;
    this.notify = notify !== undefined ? notify : () => { };
  }

  async Get({ url, endpoint, params, config }) {
    try {
      if (url != null) {
        const response = await axios.get(url);
        return response.data;
      }
      if (params != null) {
        const query = `?${new URLSearchParams(params).toString()}`;

        const response = await axios.get(
          `${this.baseURL}${endpoint}${query}`,
          config,
        );
        return response.data;
      }

      const response = await axios.get(`${this.baseURL}${endpoint}`, config);
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        this.logout();
        throw new Error("Não autorizado")
      }

      throw error;
    }
  }

  async Post({ endpoint, data, config }) {
    try {
      const response = await axios.post(
        `${this.baseURL}${endpoint}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        this.logout();
        throw new Error("Não autorizado")
      } else if (error.status === 422)
        this.notify({
          type: "erro",
          message: error.response.data.mensagem
        });
      else if (error.status === 409 && typeof error?.response?.data === "string")
        this.notify({
          type: "erro",
          message: error.response.data
        });
      throw error;
    }
  }

  async Put({ endpoint, data, config }) {
    try {
      const response = await axios.put(
        `${this.baseURL}${endpoint}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        this.logout();
        throw new Error("Não autorizado")
      } else if (error.status === 422)
        this.notify({
          type: "erro",
          message: error.response.data.mensagem
        });
      throw error;
    }
  }

  async Patch({ endpoint, data, config }) {
    try {
      const response = await axios.patch(
        `${this.baseURL}${endpoint}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        this.logout();
        throw new Error("Não autorizado")
      } else if (error.status === 422)
        this.notify({
          type: "erro",
          message: error.response.data.mensagem
        });
      throw error;
    }
  }

  async Delete({ endpoint, params, config }) {
    try {
      if (params != null) {
        const query = `?${new URLSearchParams(params).toString()}`;

        const response = await axios.delete(
          `${this.baseURL}${endpoint}${query}`,
          config
        );
        return response.data;
      }
      const response = await axios.delete(`${this.baseURL}${endpoint}`, config);
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        this.logout();
        throw new Error("Não autorizado")
      }
      throw error;
    }
  }
}

export default Api;
