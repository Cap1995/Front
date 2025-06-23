import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

//Api de consulta y evaluacion general
export const evaluarEstudianteGlobal = (rut) => api.get(`/evaluacion/global/${rut}`);

//Para mostrar las notas en el modal
export const obtenerNotasPorRut = (rut) => api.get(`/notas/${rut}`);

//Guardar facotres psicologicos
export const registrarFactoresPsicologicos = (payload) =>
    api.post("/factores/registrar_psicologicos", payload);

//Descargar reporte 
export const generarReportePDF = async (rut) => {
    const response = await api.get(`/reporte/${rut}`,{
        responseType: "blob",
        headers:{
            Accept: "application/pdf",
        },
    });

    //crea y descarga el blob 
    const blob = new Blob([response.data], { type: "application/pdf"});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reporte_${rut}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

//Registro de los apoyos
export const registrarFactoresAcademicos = (data) =>
    api.post('/api/factores-academicos/registrar', data);

export default api;

//Trae resultados de manera general 
export const obtenerEstudiantesResumen = () =>
    api.get('/riesgos_calculados');
