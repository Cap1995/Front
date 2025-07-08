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
    <md-dialog :md-active="mostrarNotas" @md-closed="mostrarNotas = false">
      <md-dialog-title class="bg-blue-600 text-white font-bold py-2 px-4 rounded-t-xl">
        📚 Notas del estudiante
      </md-dialog-title>
      <md-dialog-content>
        <div v-if="notas.length">
          <table class="min-w-full border rounded-lg overflow-hidden text-sm text-left">
            <thead class="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th class="py-2 px-3 border-b">Actividad</th>
                <th v-for="i in 6" :key="i" class="py-2 px-3 border-b">Nota {{ i }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fila, index) in notas" :key="index" class="hover:bg-gray-50 transition">
                <td class="py-2 px-3 border-b">{{ fila["Denominación Actividad Curricular"] }}</td>
                <td v-for="i in 6" :key="i" class="py-2 px-3 border-b">{{ fila["Nota_" + i] || "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-gray-500">No se encontraron notas para este estudiante.</p>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button
          class="md-raised text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          @click="mostrarNotas = false"
        >
          Cerrar
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Modal apoyos academicos -->
    <md-dialog
      :md-active="mostrarModalApoyoAcademico"
      @md-closed="mostrarModalApoyoAcademico = false"
      class="rounded-xl overflow-hidden shadow-2xl"
    >
      <md-dialog-title
        class="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-4 flex items-center gap-2"
      >
        📚 Información de Apoyo Académico
      </md-dialog-title>

      <md-dialog-content class="bg-white px-4 py-3">
        <div class="mb-4">
          <label class="block text-xs font-semibold text-gray-700 mb-1">¿Está recibiendo apoyo?</label>
          <select
            v-model="formAcademico.estaRecibiendoApoyo"
            class="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:ring focus:border-blue-400 transition"
          >
            <option :value="1">Sí</option>
            <option :value="0">No</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Nombre del profesional</label>
          <input
            type="text"
            v-model="formAcademico.nombreProfesional"
            placeholder="Ej: Prof. Juan Pérez"
            class="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:ring focus:border-blue-400 transition"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Cantenido Apoyado</label>
          <textarea
            v-model="formAcademico.observaciones"
            rows="3"
            placeholder="Ingresa tus observaciones aquí"
            class="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:ring focus:border-blue-400 transition resize-none"
          ></textarea>
        </div>
      </md-dialog-content>

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
    <md-dialog :md-active="mostrarFactoresPsicologicos" @md-closed="mostrarFactoresPsicologicos = false">
      <md-dialog-title class="bg-purple-600 text-white font-bold py-2 px-4 rounded-t-xl">
        🧠 Factores psicológicos bajos
      </md-dialog-title>
      <md-dialog-content>
        <table class="min-w-full text-sm border-collapse border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border p-2">Área Psicológica</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(factor, index) in factoresPsicologicosBajos" :key="index">
              <td class="border p-2">{{ factor }}</td>
            </tr>
          </tbody>
        </table>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button
          class="md-raised text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          @click="mostrarFactoresPsicologicos = false"
        >
          Cerrar
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Modal factores de atención psicológica -->
    <md-dialog
      :md-active="mostrarModalFactoresPsico"
      @md-closed="mostrarModalFactoresPsico = false"
      class="rounded-xl overflow-hidden shadow-2xl"
    >
      <!-- Cabecera del modal -->
      <md-dialog-title
        class="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-3 px-4 flex items-center gap-2"
      >
        🧠 Información de Apoyo Psicológico
      </md-dialog-title>

      <!-- Contenido del modal -->
      <md-dialog-content class="bg-white px-4 py-3">
        <div class="mb-4">
          <label class="block text-xs font-semibold text-gray-700 mb-1">¿Está recibiendo apoyo?</label>
          <select
            v-model="formPsico.estaRecibiendoApoyo"
            class="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:ring focus:border-purple-400 transition"
          >
            <option :value="1">Sí</option>
            <option :value="0">No</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Nombre del profesional</label>
          <input
            type="text"
            v-model="formPsico.nombreProfesional"
            placeholder="Ej: Dra. María Pérez"
            class="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:ring focus:border-purple-400 transition"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Observaciones</label>
          <textarea
            v-model="formPsico.observaciones"
            rows="3"
            placeholder="Ingresa tus observaciones aquí"
            class="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:ring focus:border-purple-400 transition resize-none"
          ></textarea>
        </div>
      </md-dialog-content>

      <!-- Acciones del modal -->
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
      // try {
      //   const res = await fetch(`http://localhost:8000/notas/${this.rut}`);
      //   this.notas = await res.json();
      //   this.mostrarNotas = true;
      // } catch (error) {
      //   console.error('❌ Error al obtener notas:', error);
      //   this.notas = [];
      //   this.mostrarNotas = true;
      // }
    },
    verFactoresPsicologicos() {
      // Procesar el string de motivos para crear un array
      this.factoresPsicologicosBajos = this.resultado.riesgos.psicologico.motivos
        .split(", ")
        .map((motivo) => motivo.replace(" baja", ""));
      this.mostrarFactoresPsicologicos = true;
    },
    colorRiesgo(nivel) {
      return {
        "text-green-600": nivel === "Bajo",
        "text-yellow-600": nivel === "Medio",
        "text-red-600": nivel === "Alto",
        "text-gray-600": !nivel || nivel === "-",
      };
    },
    iconoRiesgo(nivel) {
      if (nivel === "Bajo") return "🟢";
      if (nivel === "Medio") return "🟡";
      if (nivel === "Alto") return "🔴";
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
      // try{
      //   const payload = {
      //     rut: this.rut,
      //     nivel_riesgo: this.nivelRiesgoPsico,
      //     esta_apoyo: this.formPsico.estaRecibiendoApoyo,
      //     profesional: this.formPsico.nombreProfesional,
      //     observaciones: this.formPsico.observaciones
      //   };

      //   await fetch('http://localhost:8000/registrar_factores_psicologicos/',{
      //     method: 'POST',
      //     headers: {'Content-Type': 'application/json'},
      //     body: JSON.stringify(payload)
      //   });

      //   this.mostrarModalFactoresPsico = false;
      //   alert('✅ Información registrada correctamente.');
      // }catch(error){
      //   console.error('❌ Error al guardar información:', error);
      //   alert('❌ Error al guardar información.');
      // }
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
      // try{
      //   const payload = {
      //     rut: this.rut,
      //     nivel_riesgo: this.nivelRiesgoAcademico,
      //     esta_apoyo: this.formAcademico.estaRecibiendoApoyo,
      //     profesional: this.formAcademico.nombreProfesional,
      //     observaciones: this.formAcademico.observaciones
      //   };

      //   await fetch('http://localhost:8000/registrar_factores_academicos/', {
      //     method: 'POST',
      //     headers: {'Content-Type': 'application/json'},
      //     body: JSON.stringify(payload)
      //   });

      //   this.mostrarModalFactoresAcademicos = false;
      //   alert('✅ Apoyo académico registrado correctamente.');

      // }catch(error){
      //   console.error('❌ Error al registrar apoyo académico:', error);
      //   alert('❌ Error al registrar apoyo académico.');
      // }
    },
  },
};
</script>
