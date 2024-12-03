import "antd/dist/reset.css";
import { createApp } from "vue";
import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Antd);
app.mount("#app");
