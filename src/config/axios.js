import axios from "axios";

axios.defaults.timeout = 8000;
axios.defaults.headers.common["User-Agent"] = "Mozilla/5.0 Favicon-Bot";

export default axios;
