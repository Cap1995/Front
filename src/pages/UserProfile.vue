<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <md-card class="rounded-xl overflow-hidden shadow-lg">
          <md-card-header data-background-color="blue">
            <h4 class="title text-2xl font-bold text-white">🔎 Buscar estudiante por RUT</h4>
            <p class="category text-white">Consulta de información de riesgo individual</p>
          </md-card-header>
          <md-card-content>
            <div class="flex flex-col sm:flex-row gap-4 items-center mb-4">
              <md-field class="flex-1">
                <label for="rut">Ingrese RUT</label>
                <md-input v-model="rut" id="rut" type="text" placeholder="Ej: 12345678" />
              </md-field>
              <md-field class="w-40">
                <label for="anio">Año</label>
                <md-input v-model="anio" id="anio" type="number" placeholder="Ej: 2025" />
              </md-field>
              <md-button class="md-raised md-primary" @click="buscarEstudiante">Buscar</md-button>
            </div>

            <div v-if="resultado" class="bg-gray-50 p-6 rounded-xl shadow border border-gray-200 mt-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">🎓 Información del Estudiante</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>Nombre:</strong>
                  {{ resultado.nombre_completo }}
                </div>
                <div>
                  <strong>Carrera:</strong>
                  {{ resultado.carrera }}
                </div>
                <div>
                  <strong>RUT:</strong>
                  {{ resultado.rut }}
                </div>
                <div>
                  <strong>Riesgo Global:</strong>
                  <span :class="colorRiesgo(resultado.riesgo_global)" class="font-bold">
                    {{ resultado.riesgo_global }} {{ iconoRiesgo(resultado.riesgo_global) }}
                  </span>
                </div>
              </div>

              <div class="mt-4">
                <md-button class="md-raised md-primary" @click="descargarReporte(resultado.rut)">
                  Descargar PDF
                </md-button>
              </div>

              <!-- Riesgos por Área  -->
              <div class="mt-6">
                <h4 class="text-md font-semibold text-gray-700 mb-4">📊 Riesgos por Área</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Académico -->
                  <div
                    class="flex flex-col justify-between bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition"
                  >
                    <div>
                      <h5 class="text-xs font-semibold text-gray-500 uppercase">Factores Académico</h5>
                      <p :class="['text-lg font-bold mt-1', colorRiesgo(resultado.riesgos.academico.nivel)]">
                        {{ iconoRiesgo(resultado.riesgos.academico.nivel) }} {{ resultado.riesgos.academico.nivel }}
                      </p>
                      <!-- <p class="text-xs text-gray-500 italic mt-1">{{ resultado.riesgos.academico.motivo }}</p> -->
                      <div class="bg-gray-100 p-2 rounded text-xs text-gray-700 mt-2">
                        <strong>Recomendación:</strong>
                        <br />
                        {{ resultado.riesgos.academico.recomendacion }}
                      </div>
                    </div>
                    <md-button
                      class="md-accent md-dense mt-4 text-xs font-medium text-blue-700 hover:text-blue-900 transition"
                      @click="verNotas"
                    >
                      📄 Ver notas
                    </md-button>
                    <md-button
                      class="md-accent md-dense mt-4 text-xs font-medium text-purple-700 hover:text-purple-900 transition"
                      @click="mostrarModalApoyoAcademico = true"
                    >
                      📄 Ver Apoyos Academicos
                    </md-button>
                  </div>

                  <!-- Psicológico -->
                  <div
                    class="flex flex-col justify-between bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition"
                  >
                    <div>
                      <h5 class="text-xs font-semibold text-gray-500 uppercase">Factores Psicoeducativo</h5>
                      <p :class="['text-lg font-bold mt-1', colorRiesgo(resultado.riesgos.psicologico.nivel)]">
                        {{ iconoRiesgo(resultado.riesgos.psicologico.nivel) }} {{ resultado.riesgos.psicologico.nivel }}
                      </p>
                      <!-- <p class="text-xs text-gray-500 italic mt-1">{{ resultado.riesgos.psicologico.motivos }}</p> -->
                      <div class="bg-gray-100 p-2 rounded text-xs text-gray-700 mt-2">
                        <strong>Recomendación:</strong>
                        <br />
                        {{ resultado.riesgos.psicologico.recomendacion }}
                      </div>
                    </div>
                    <md-button
                      class="md-accent md-dense mt-4 text-xs font-medium text-purple-700 hover:text-purple-900 transition"
                      @click="verFactoresPsicologicos"
                    >
                      🧠 Ver factores
                    </md-button>
                    <md-button
                      class="md-accent md-dense mt-4 text-xs font-medium text-purple-700 hover:text-purple-900 transition"
                      @click="mostrarModalFactoresPsico = true"
                    >
                      🧠 Ver Atenciones Psicoeducativas
                    </md-button>
                  </div>

                  <!-- Interseccional -->
                  <div
                    class="flex flex-col justify-between bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition"
                  >
                    <div>
                      <h5 class="text-xs font-semibold text-gray-500 uppercase">Interseccional</h5>
                      <p :class="['text-lg font-bold mt-1', colorRiesgo(resultado.riesgos.interseccional.nivel)]">
                        {{ iconoRiesgo(resultado.riesgos.interseccional.nivel) }}
                        {{ resultado.riesgos.interseccional.nivel }}
                      </p>
                      <p class="text-xs text-gray-500 italic mt-1">{{ resultado.riesgos.interseccional.detalle }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="resultado.historial && resultado.historial.length" class="mt-6">
                <md-button class="md-primary md-raised" @click="mostrarModal = true">
                  Ver historial de evaluaciones
                </md-button>
              </div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>

    <!-- Modal historial -->
    <md-dialog :md-active="mostrarModal" @md-closed="mostrarModal = false">
      <md-dialog-title>📅 Historial de evaluaciones</md-dialog-title>
      <md-dialog-content>
        <ul class="list-disc ml-6 text-sm">
          <li v-for="(item, index) in (resultado && resultado.historial) || []" :key="index">
            {{ item.fecha }} - Riesgo:
            <span :class="colorRiesgo(item.nivel)" class="font-bold">
              {{ iconoRiesgo(item.nivel) }} {{ item.nivel }}
            </span>
          </li>
        </ul>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="mostrarModal = false">Cerrar</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Modal notas -->
    <!-- <md-dialog :md-active="mostrarNotas" @md-closed="mostrarNotas = false">
      <md-dialog-title class="bg-blue-600 text-white font-bold py-2 px-4 rounded-t-xl">
        📚 Notas del estudiante
      </md-dialog-title>

      <md-dialog-content class="custom-modal-content-notas">
        <div v-if="notas.length">
          <table>
            <thead>
              <tr>
                <th>Actividad</th>
                <th v-for="i in 6" :key="i">Nota {{ i }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fila, index) in notas" :key="index">
                <td>{{ fila["Denominación Actividad Curricular"] }}</td>
                <td v-for="i in 6" :key="i">{{ fila["Nota_" + i] || "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="mensaje-vacio">No se encontraron notas para este estudiante.</p>
      </md-dialog-content>

      <md-dialog-actions style="padding: 16px; display: flex; justify-content: flex-end; background-color: #f9fafb">
        <md-button
          class="md-raised"
          style="background-color: #e5e7eb; color: #374151; font-weight: 500; border-radius: 6px"
          @click="mostrarNotas = false"
        >
          Cerrar
        </md-button>
      </md-dialog-actions>
    </md-dialog> -->
    <md-dialog :md-active="mostrarNotas" @md-closed="mostrarNotas = false">
      <md-dialog-title class="bg-blue-600 text-white font-bold py-2 px-4 rounded-t-xl">
        📚 Notas del estudiante
      </md-dialog-title>

      <md-dialog-content class="custom-modal-content-notas">
        <div v-if="notas.length">
          <table class="min-w-full border-collapse border border-gray-300 text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-2">Año</th>
                <th class="border p-2">Periodo</th>
                <th class="border p-2">Actividad Curricular</th>
                <th class="border p-2">Nota Final</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fila, index) in notas" :key="index">
                <td class="border p-2">{{ fila.Año }}</td>
                <td class="border p-2">{{ fila.Periodo }}</td>
                <td class="border p-2">{{ fila.Asignatura }}</td>
                <td
                  class="border p-2 font-semibold text-center"
                  :class="{
                    'text-green-600': parseFloat(fila.NotaFinal) >= 4.0,
                    'text-red-600': parseFloat(fila.NotaFinal) < 4.0,
                  }"
                >
                  {{ fila.NotaFinal || "-" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="mensaje-vacio text-gray-500 italic mt-2">No se encontraron notas para este estudiante.</p>
      </md-dialog-content>

      <md-dialog-actions style="padding: 16px; display: flex; justify-content: flex-end; background-color: #f9fafb">
        <md-button
          class="md-raised"
          style="background-color: #e5e7eb; color: #374151; font-weight: 500; border-radius: 6px"
          @click="mostrarNotas = false"
        >
          Cerrar
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog
      :md-active="mostrarModalApoyoAcademico"
      @md-closed="mostrarModalApoyoAcademico = false"
      class="rounded-xl overflow-hidden shadow-2xl"
    >
      <!-- Título -->
      <md-dialog-title
        class="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-4 flex items-center gap-2"
      >
        📚 Información de Apoyo Académico
      </md-dialog-title>

      <!-- Contenido del modal -->
      <md-dialog-content class="custom-modal-content-academico">
        <div>
          <label>¿Está recibiendo apoyo?</label>
          <select v-model="formAcademico.estaRecibiendoApoyo">
            <option :value="1">Sí</option>
            <option :value="0">No</option>
          </select>
        </div>

        <div>
          <label>Nombre del profesional</label>
          <input type="text" v-model="formAcademico.nombreProfesional" placeholder="Ej: Prof. Juan Pérez" />
        </div>

        <div>
          <label>Contenido apoyado</label>
          <textarea
            v-model="formAcademico.observaciones"
            rows="3"
            placeholder="Ingresa tus observaciones aquí"
          ></textarea>
        </div>
      </md-dialog-content>

      <!-- Acciones -->
      <md-dialog-actions class="flex justify-end gap-2 p-4 bg-gray-50">
        <md-button
          class="md-primary md-raised text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition"
          @click="guardarFactoresAcademicos"
        >
          💾 Guardar
        </md-button>
        <md-button
          class="md-accent md-dense text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          @click="mostrarModalApoyoAcademico = false"
        >
          ❌ Cancelar
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Modal factores psicológicos bajos -->
    <md-dialog
      :md-active="mostrarFactoresPsicologicos"
      @md-closed="mostrarFactoresPsicologicos = false"
      class="rounded-xl overflow-hidden shadow-2xl"
    >
      <!-- Título del modal -->
      <md-dialog-title
        class="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-3 px-4 flex items-center gap-2"
      >
        🧠 Factores psicológicos bajos
      </md-dialog-title>

      <!-- Contenido -->
      <md-dialog-content class="custom-modal-table">
        <table>
          <thead>
            <tr>
              <th>Área Psicológica</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(factor, index) in factoresPsicologicosBajos" :key="index">
              <td>{{ factor }}</td>
            </tr>
          </tbody>
        </table>
      </md-dialog-content>

      <!-- Acciones -->
      <md-dialog-actions class="flex justify-end gap-2 p-4 bg-gray-50">
        <md-button
          class="md-raised text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          @click="mostrarFactoresPsicologicos = false"
        >
          Cerrar
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog
      :md-active="mostrarModalFactoresPsico"
      @md-closed="mostrarModalFactoresPsico = false"
      class="rounded-xl overflow-hidden shadow-2xl"
    >
      <!-- Título -->
      <md-dialog-title
        class="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-3 px-4 flex items-center gap-2"
      >
        🧠 Información de Apoyo Psicológico
      </md-dialog-title>

      <!-- Contenido del modal -->
      <md-dialog-content class="custom-modal-content">
        <div>
          <label>¿Está recibiendo apoyo?</label>
          <select v-model="formPsico.estaRecibiendoApoyo">
            <option :value="1">Sí</option>
            <option :value="0">No</option>
          </select>
        </div>

        <div>
          <label>Nombre del profesional</label>
          <input type="text" v-model="formPsico.nombreProfesional" placeholder="Ej: Dra. María Pérez" />
        </div>

        <div>
          <label>Observaciones</label>
          <textarea v-model="formPsico.observaciones" rows="3" placeholder="Ingresa tus observaciones aquí"></textarea>
        </div>
      </md-dialog-content>

      <!-- Acciones -->
      <md-dialog-actions class="flex justify-end gap-2 p-4 bg-gray-50">
        <md-button
          class="md-primary md-raised text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white transition"
          @click="guardarFactoresPsico"
        >
          💾 Guardar
        </md-button>
        <md-button
          class="md-accent md-dense text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          @click="mostrarModalFactoresPsico = false"
        >
          ❌ Cancelar
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import {
  evaluarEstudianteGlobal,
  obtenerNotasPorRut,
  registrarFactoresPsicologicos,
  generarReportePDF,
  registrarFactoresAcedmicos,
} from "@/api/api";
export default {
  data() {
    return {
      rut: "",
      resultado: null,
      mostrarModal: false,
      mostrarNotas: false,
      notas: [],
      mostrarFactoresPsicologicos: false,
      factoresPsicologicosBajos: [],
      anio: new Date().getFullYear(),

      //modal de registro apoyo psico
      mostrarModalFactoresPsico: false,
      formPsico: {
        estaRecibiendoApoyo: 0,
        nombreProfesional: "",
        observaciones: "",
      },
      nivelRiesgoPsico: "",

      //modal de apoyo academico
      mostrarModalApoyoAcademico: false,
      formAcademico: {
        estaRecibiendoApoyo: 0,
        nombreProfesional: "",
        observaciones: "",
      },
      nivelRiesgoAcademico: "",
    };
  },
  methods: {
    async buscarEstudiante() {
      try {
        const { data } = await evaluarEstudianteGlobal(this.rut, this.anio);
        this.resultado = data;
        this.nivelRiesgoPsico = data.riesgos.psicologico.nivel;
        this.formPsico.estaRecibiendoApoyo = data.factores_psicologicos.esta_recibiendo_apoyo || 0;
        this.formPsico.nombreProfesional = data.factores_psicologicos.nombre_profesional || "";
        this.formPsico.observaciones = data.factores_psicologicos.observaciones || "";
      } catch (error) {
        console.error("❌ Error al buscar estudiante:", error);
      }
    },
    async verNotas() {
      try {
        const res = await obtenerNotasPorRut(this.rut);
        this.notas = res.data;
        this.mostrarNotas = true;
      } catch (error) {
        console.error("❌ Error al obtener notas:", error);
        this.notas = [];
        this.mostrarNotas = true;
      }
    },
    verFactoresPsicologicos() {
      // Procesar el string de motivos para crear un array
      this.factoresPsicologicosBajos = this.resultado.riesgos.psicologico.motivos
        .split(", ")
        .map((motivo) => motivo.replace(" baja", ""));
      this.mostrarFactoresPsicologicos = true;
    },
    colorRiesgo(nivel) {
      const limpio = (nivel || "").toString().trim().toLowerCase();
      return {
        "text-green-600": limpio === "bajo",
        "text-yellow-600": limpio === "medio",
        "text-red-600": limpio === "alto",
        "text-gray-600": !limpio || limpio === "-" || limpio === "no clasificado" || limpio === "pendiente",
      };
    },
    iconoRiesgo(nivel) {
      const limpio = (nivel || "").toString().trim().toLowerCase();

      if (limpio === "bajo") return "🟢";
      if (limpio === "medio") return "🟡";
      if (limpio === "alto") return "🔴";
      if (limpio === "no clasificado" || limpio === "pendiente") return "⚠️";
      return "⚪";
    },

    async guardarFactoresPsico() {
      try {
        const payload = {
          rut: this.rut,
          nivel_riesgo: this.nivelRiesgoPsico,
          esta_apoyo: this.formPsico.estaRecibiendoApoyo,
          profesional: this.formPsico.nombreProfesional,
          observaciones: this.formPsico.observaciones,
        };

        await registrarFactoresPsicologicos(payload);

        this.mostrarModalFactoresPsico = false;
        alert("✅ Información registrada correctamente.");
      } catch (error) {
        console.error("❌ Error al guardar información:", error);
        alert("❌ Error al guardar información.");
      }
    },

    async descargarReporte(rut) {
      try {
        const response = await generarReportePDF(rut);
        const blob = new Blob([response.data], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `reporte_${rut}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("❌ Error al descargar el reporte:", error);
      }
    },

    async guardarFactoresAcademicos() {
      try {
        const payload = {
          rut: this.rut,
          nivel_riesgo: this.nivelRiesgoAcademico,
          esta_apoyo: this.formAcademico.estaRecibiendoApoyo,
          profesional: this.formAcademico.nombreProfesional,
          observaciones: this.formAcademico.observaciones,
        };

        await registrarFactoresAcedmicos(payload);
        alert("✅ Apoyo académico registrado correctamente.");
      } catch (error) {
        console.error("❌ Error al registrar apoyo académico:", error);
        alert("❌ Error al registrar apoyo académico.");
      }
    },
  },
};
</script>
<style scope>
.custom-modal-content {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  font-family: "Segoe UI", sans-serif;
}

.custom-modal-content label {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
}

.custom-modal-content select,
.custom-modal-content input,
.custom-modal-content textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
  transition: border 0.3s, box-shadow 0.3s;
  margin-bottom: 16px;
}

.custom-modal-content select:focus,
.custom-modal-content input:focus,
.custom-modal-content textarea:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
  outline: none;
}

.custom-modal-content textarea {
  resize: none;
}

.custom-modal-content-academico {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  font-family: "Segoe UI", sans-serif;
}

.custom-modal-content-academico label {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
}

.custom-modal-content-academico select,
.custom-modal-content-academico input,
.custom-modal-content-academico textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
  transition: border 0.3s, box-shadow 0.3s;
  margin-bottom: 16px;
}

.custom-modal-content-academico select:focus,
.custom-modal-content-academico input:focus,
.custom-modal-content-academico textarea:focus {
  border-color: #3b82f6; /* azul */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  outline: none;
}

.custom-modal-content-academico textarea {
  resize: none;
}

.custom-modal-content-notas {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  font-family: "Segoe UI", sans-serif;
  overflow-x: auto;
}

.custom-modal-content-notas table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 10px;
}

.custom-modal-content-notas thead {
  background-color: #f3f4f6;
  color: #374151;
  font-weight: 600;
}

.custom-modal-content-notas th,
.custom-modal-content-notas td {
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.custom-modal-content-notas tr:hover {
  background-color: #f9fafb;
  transition: background-color 0.2s ease;
}

.custom-modal-content-notas .mensaje-vacio {
  color: #6b7280;
  font-style: italic;
  margin-top: 10px;
}

.custom-modal-table {
  background-color: #ffffff;
  padding: 24px;
  font-family: "Segoe UI", sans-serif;
  border-radius: 0 0 16px 16px;
}

.custom-modal-table table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  font-size: 14px;
}

.custom-modal-table thead {
  background-color: #f9fafb;
}

.custom-modal-table th {
  text-align: left;
  padding: 12px;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}

.custom-modal-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  color: #374151;
  background-color: #fff;
}

.custom-modal-table tr:hover td {
  background-color: #f9f9ff;
}
</style>
