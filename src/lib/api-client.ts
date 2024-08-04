import Axios from "axios";

export const api = Axios.create({
  headers: {
    "web-app-source": true,
  },
});
