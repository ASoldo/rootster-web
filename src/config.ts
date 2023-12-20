import { EnvironmentConfig } from "@/internals/types";

const config: EnvironmentConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5173",
};

export default config;
