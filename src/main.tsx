import { QueryClient } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./app";
import Provider from "./context/provider";
import "./index.css";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider client={queryClient}>
    <App />
  </Provider>
);
