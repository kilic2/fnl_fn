// src/helper/api.ts dosyanın içi muhtemelen şöyle olmalı:

import axios from "axios";

export const api = axios.create({
  // VITE_API_URL tanımlıysa onu kullan, yoksa localhost'u (geliştirme ortamı için) kullan
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});