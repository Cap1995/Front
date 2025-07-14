import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

// ✅ Interceptor para agregar token JWT automáticamente a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Api de consulta y evaluacion general
export const evaluarEstudianteGlobal = (rut, anio) =>
  api.get(`/evaluacion/global/${rut}`, {
    params: { anio },
  });

//Para mostrar las notas en el modal
export const obtenerNotasPorRut = (rut) => api.get(`/notas/${rut}`);

//Guardar facotres psicologicos
export const registrarFactoresPsicologicos = (payload) => api.post("/factores/registrar_psicologicos", payload);

//Descargar reporte
export const generarReportePDF = async (rut) => {
  const response = await api.get(`/reporte/${rut}`, {
    responseType: "blob",
    headers: {
      Accept: "application/pdf",
    },
  });

  //crea y descarga el blob
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `reporte_${rut}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

//Registro de los apoyos
export const registrarFactoresAcademicos = (data) => api.post("/api/factores-academicos/registrar", data);

export default api;

//Trae resultados de manera general
export const obtenerEstudiantesResumen = () => api.get("/riesgos_calculados");

//Descarga de PDF general
export const descargarReporteFiltrado = async (filtros) => {
  const response = await api.post("/api/reportes/descargar", filtros, {
    responseType: "blob",
  });
  return response;
};

//Descargar en formato excel
export const descargarReporteExcel = async (filtros) => {
  return await api.post("/api/reportes/descargar-excel", filtros, {
    responseType: "blob",
  });
};

//Actualiza la tabla del dashboard principal
export const actualizarEvaluacionGeneral = () => api.post("/evaluacion-general/actualizar");
