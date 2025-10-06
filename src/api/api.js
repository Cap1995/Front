// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.VUE_APP_API_URL,
// });

// // ✅ Interceptor para agregar token JWT automáticamente a cada petición
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// //Api de consulta y evaluacion general
// export const evaluarEstudianteGlobal = (rut, anio) =>
//   api.get(`/evaluacion/global/${rut}`, {
//     params: { anio },
//   });

// //Para mostrar las notas en el modal
// export const obtenerNotasPorRut = (rut) => api.get(`/notas/${rut}`);

// //Guardar facotres psicologicos
// export const registrarFactoresPsicologicos = (payload) => api.post("/factores/registrar_psicologicos", payload);

// //Descargar reporte
// export const generarReportePDF = async (rut) => {
//   const response = await api.get(`/reporte/${rut}`, {
//     responseType: "blob",
//     headers: {
//       Accept: "application/pdf",
//     },
//   });

//   //crea y descarga el blob
//   const blob = new Blob([response.data], { type: "application/pdf" });
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", `reporte_${rut}.pdf`);
//   document.body.appendChild(link);
//   link.click();
//   link.remove();
//   window.URL.revokeObjectURL(url);
// };

// //Registro de los apoyos
// export const registrarFactoresAcademicos = (data) => api.post("/api/factores-academicos/registrar", data);

// export default api;

// //Trae resultados de manera general
// export const obtenerEstudiantesResumen = () => api.get("/riesgos_calculados");

// //Descarga de PDF general
// export const descargarReporteFiltrado = async (filtros) => {
//   const response = await api.post("/api/reportes/descargar", filtros, {
//     responseType: "blob",
//   });
//   return response;
// };

// //Descargar en formato excel
// export const descargarReporteExcel = async (filtros) => {
//   return await api.post("/api/reportes/descargar-excel", filtros, {
//     responseType: "blob",
//   });
// };

// //Actualiza la tabla del dashboard principal
// export const actualizarEvaluacionGeneral = () => api.post("/evaluacion-general/actualizar");
import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // .env / .env.production
  timeout: 20000,
});

// ✅ Agrega JWT a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Manejo básico de 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;

/* ======================
   Helpers descarga blob
   ====================== */
async function downloadBlobFromResponse(response, filenameFallback) {
  // Intenta usar el nombre del Content-Disposition si viene
  const cd = response.headers?.["content-disposition"] || "";
  const match = cd.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] || filenameFallback;

  const blob = new Blob([response.data], { type: response.headers?.["content-type"] || "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/* ======================
   Endpoints (SIN /api)
   ====================== */

// Consulta y evaluación general
export const evaluarEstudianteGlobal = (rut, anio) => api.get(`/evaluacion/global/${rut}`, { params: { anio } });

// Notas por RUT (modal)
export const obtenerNotasPorRut = (rut) => api.get(`/notas/${rut}`);

// Guardar factores psicológicos
export const registrarFactoresPsicologicos = (payload) => api.post(`/factores/registrar_psicologicos`, payload);

// Descargar reporte individual en PDF
export const generarReportePDF = async (rut) => {
  const response = await api.get(`/reporte/${rut}`, {
    responseType: "blob",
    headers: { Accept: "application/pdf" },
  });
  await downloadBlobFromResponse(response, `reporte_${rut}.pdf`);
};

// Registrar factores académicos (QUITAMOS /api/)
export const registrarFactoresAcademicos = (data) => api.post(`/factores-academicos/registrar`, data);

// Trae resultados de manera general
export const obtenerEstudiantesResumen = () => api.get(`/riesgos_calculados`);

// Descargar reporte filtrado (PDF) (QUITAMOS /api/)
export const descargarReporteFiltrado = async (filtros) => {
  const response = await api.post(`/reportes/descargar`, filtros, {
    responseType: "blob",
  });
  await downloadBlobFromResponse(response, `reporte_filtrado.pdf`);
};

// Descargar en formato Excel (QUITAMOS /api/)
export const descargarReporteExcel = async (filtros) => {
  const response = await api.post(`/reportes/descargar-excel`, filtros, {
    responseType: "blob",
  });
  await downloadBlobFromResponse(response, `reporte_filtrado.xlsx`);
};

// Actualiza la tabla del dashboard principal
export const actualizarEvaluacionGeneral = () => api.post("/evaluacion-general/actualizar", null, { timeout: 200000 });
