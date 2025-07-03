<template>
  <div class="content bg-[#f9fafb] py-6 px-4 rounded-xl">
    <div class="md-layout">

      <!-- Tarjetas de estadísticas -->
      <div
        v-for="(card, i) in statsCardsDinamicas"
        :key="i"
        class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-33"
      >
        <stats-card :data-background-color="card.color" class="rounded-2xl shadow-lg">
          <template #header>
            <md-icon v-if="card.iconType === 'material'">{{ card.icon }}</md-icon>
          </template>
          <template #content>
            <p class="category font-semibold text-sm text-white/90">{{ card.title }}</p>
            <h3 class="title text-white text-3xl font-bold" v-html="card.value"></h3>
          </template>
          <template #footer>
            <div class="stats text-white/80">
              <md-icon>{{ card.footerIcon }}</md-icon>
              {{ card.footerText }}
            </div>
          </template>
        </stats-card>
      </div>

      <!-- Filtros -->
      <div class="md-layout-item md-size-100">
        <md-card class="mb-6 rounded-xl shadow bg-white">
          <md-card-content class="flex flex-wrap gap-6">
            <md-field class="w-full md:w-1/3">
              <label for="filtroAnio">Año</label>
              <md-select v-model="filtroAnio">
                <md-option value="">Todos</md-option>
                <md-option v-for="anio in aniosDisponibles" :key="anio" :value="anio">{{ anio }}</md-option>
              </md-select>
            </md-field>

            <md-field class="w-full md:w-1/3">
              <label for="filtroCarrera">Carrera</label>
              <md-select v-model="filtroCarrera">
                <md-option value="">Todas</md-option>
                <md-option v-for="carrera in carrerasDisponibles" :key="carrera" :value="carrera">{{ carrera }}</md-option>
              </md-select>
            </md-field>

            <md-field class="w-full md:w-1/3">
              <label for="filtroRiesgo">Nivel de Riesgo</label>
              <md-select v-model="filtroRiesgo">
                <md-option value="">Todos</md-option>
                <md-option value="Alto">🔴 Alto</md-option>
                <md-option value="Medio">🟠 Medio</md-option>
                <md-option value="Bajo">🟢 Bajo</md-option>
              </md-select>
            </md-field>
          </md-card-content>
        </md-card>
      </div>

    <!-- Boton de descarga PDF -->
    <md-button
      class="md-raised md-primary"
      :disabled="descargandoPDF"
      @click="descargarPDF"
    >
      {{ descargandoPDF ? 'Generando PDF...' : 'Descargar PDF' }}
    </md-button>

     <!-- Boton de descarga EXCEL -->
    <md-button
      class="md-raised text-white bg-green-600 hover:bg-green-700"
      :disabled="descargandoExcel"
      @click="descargarExcel"
    >
      {{ descargandoExcel ? 'Generando Excel...' : 'Descargar Excel' }}
    </md-button>

      <!-- Tabla de estudiantes con paginación -->
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card class="rounded-xl shadow bg-white">
          <md-card-header data-background-color="blue">
            <div class="flex justify-between items-center w-full">
              <div>
                <h4 class="title text-white text-lg">Estudiantes</h4>
                <p class="category text-white/90">Mostrando página {{ paginaActual }} de {{ totalPaginas }}</p>
              </div>
              <md-button class="md-raised md-accent" @click="actualizarEvaluacion" :disabled="cargando">
                <span v-if="!cargando">🔄 Actualizar Evaluación</span>
                <span v-else>Cargando...</span>
              </md-button>
            </div>
          </md-card-header>
          <md-card-content>
            <md-table :value="estudiantesFiltradosPaginados" table-header-color="orange">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="RUN">{{ item.rut }}</md-table-cell>
                <md-table-cell md-label="Año de ingreso">{{ item.anioIngreso }}</md-table-cell>
                <md-table-cell md-label="Nombre">{{ item.nombre }}</md-table-cell>
                <md-table-cell md-label="Carrera">{{ item.carrera }}</md-table-cell>
                <md-table-cell md-label="Nivel Riesgo">
                  <span :class="colorRiesgo(item.riesgo)" class="font-semibold">{{ item.riesgo }}</span>
                </md-table-cell>
              </md-table-row>
            </md-table>

            <div class="pagination mt-6 flex justify-between">
              <md-button class="md-raised" @click="paginaActual--" :disabled="paginaActual === 1">Anterior</md-button>
              <md-button class="md-raised md-primary" @click="paginaActual++" :disabled="paginaActual === totalPaginas">Siguiente</md-button>
            </div>
          </md-card-content>
        </md-card>
      </div>

    </div>
  </div>
</template>

<script>
import { StatsCard } from '@/components'
import { obtenerEstudiantesResumen, 
         descargarReporteFiltrado, 
         descargarReporteExcel,
        actualizarEvaluacionGeneral } from '../api/api';

export default {
  components: {
    StatsCard,
  },
  data() {
    return {
      statsCards: [],
      estudiantes: [],
      paginaActual: 1,
      porPagina: 10,
      filtroAnio: '',
      filtroCarrera: '',
      filtroRiesgo: '',
      descargandoPDF: false,
      descargandoExcel: false,
      cargando: false,
    }
  },
  computed: {
    aniosDisponibles() {
      const anios = [...new Set(this.estudiantes.map(e => e.anioIngreso))];
      return anios.sort();
    },
    carrerasDisponibles() {
      const carreras = [...new Set(this.estudiantes.map(e => e.carrera))];
      return carreras.sort();
    },
    estudiantesFiltrados() {
      return this.estudiantes.filter(e => {
        return (!this.filtroAnio || String(e.anioIngreso) === String(this.filtroAnio)) &&
              (!this.filtroCarrera || e.carrera === this.filtroCarrera) &&
              (!this.filtroRiesgo || e.riesgo?.toLowerCase() === this.filtroRiesgo.toLowerCase());
      });
    },
    totalPaginas() {
      return Math.ceil(this.estudiantesFiltrados.length / this.porPagina);
    },
    estudiantesFiltradosPaginados() {
      const inicio = (this.paginaActual - 1) * this.porPagina;
      return this.estudiantesFiltrados.slice(inicio, inicio + this.porPagina);
    },
    estadisticasFiltradas() {
      const filtrados = this.estudiantesFiltrados;
      const alto = filtrados.filter(e => e.riesgo?.toLowerCase() === 'alto').length;
      const medio = filtrados.filter(e => e.riesgo?.toLowerCase() === 'medio').length;
      const bajo = filtrados.filter(e => e.riesgo?.toLowerCase() === 'bajo').length;
      return { total: filtrados.length, alto, medio, bajo };
    },
    statsCardsDinamicas() {
      return [
        {
          color: 'red',
          iconType: 'material',
          icon: 'warning',
          title: 'Riesgo Alto',
          value: this.estadisticasFiltradas.alto.toString(),
          footerIcon: 'info',
          footerText: 'Estudiantes en riesgo alto',
        },
        {
          color: 'orange',
          iconType: 'material',
          icon: 'report',
          title: 'Riesgo Medio',
          value: this.estadisticasFiltradas.medio.toString(),
          footerIcon: 'info',
          footerText: 'Estudiantes en riesgo medio',
        },
        {
          color: 'green',
          iconType: 'material',
          icon: 'check_circle',
          title: 'Riesgo Bajo',
          value: this.estadisticasFiltradas.bajo.toString(),
          footerIcon: 'info',
          footerText: 'Estudiantes en riesgo bajo',
        },
      ];
    },
  },
  methods: {
    colorRiesgo(nivel) {
      const riesgo = nivel?.toLowerCase();
      return {
        'text-red-600': nivel === 'Alto',
        'text-yellow-600': nivel === 'Medio',
        'text-green-600': nivel === 'Bajo',
        'text-gray-500': !['Alto', 'Medio', 'Bajo'].includes(riesgo)
      }
    },

    async descargarPDF() {
      this.descargandoPDF = true;
      try {
        const filtros = {
          carrera: this.filtroCarrera || null,
          anioIngreso: this.filtroAnio || null,
          nivelRiesgo: this.filtroRiesgo || null,
        };

        const response = await descargarReporteFiltrado(filtros);

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const nombreArchivo = `reporte_${this.filtroCarrera || 'todas'}_${this.filtroAnio || 'todos'}_${this.filtroRiesgo || 'todos'}.pdf`
          .toLowerCase()
          .replace(/\s+/g, '_');

        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('❌ Error al generar el PDF:', error);
        alert('Error al generar el PDF.');
      } finally {
        this.descargandoPDF = false;
      }
    },

    async descargarExcel(){
      this.descargandoExcel = true;
      try {
        const filtros = {
          carrera: this.filtroCarrera || null,
          anioIngreso: this.filtroAnio || null,
          nivelRiesgo: this.filtroRiesgo || null,
        };

        const response = await descargarReporteExcel(filtros);

        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const nombreArchivo = `reporte_${this.filtroCarrera || 'todas'}_${this.filtroAnio || 'todos'}_${this.filtroRiesgo || 'todos'}.xlsx`
          .toLowerCase()
          .replace(/\s+/g, '_');

        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('❌ Error al generar el Excel:', error);
        alert('Error al generar el archivo Excel.');
      }finally{
        this.descargandoExcel = false
      }
    },
     async cargarEstudiantes() {
      try {
        const response = await obtenerEstudiantesResumen();
        this.estudiantes = response.data;
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
        this.$toast.open("Error al cargar los estudiantes");
      }
    },
    async actualizarEvaluacion(){
      this.cargando = true;
      try{
        const response = await actualizarEvaluacionGeneral();
        this.$toast.open(response.data.mensaje || "Evaluación actualizada");
        //recarga la tabla
        await this.cargarEstudiantes();
        this.paginaActual = 1;
      }catch(error){
        console.error(error);
        this.$toast.open("error al actualizar la evaluación")
      } finally {
        this.cargando = false;
      }
    }
  },
  async mounted() {
    this.cargarEstudiantes();
  },
}
</script>
