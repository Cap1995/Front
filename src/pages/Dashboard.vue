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

      <!-- Tabla de estudiantes con paginación -->
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card class="rounded-xl shadow bg-white">
          <md-card-header data-background-color="blue">
            <h4 class="title text-white text-lg">Estudiantes</h4>
            <p class="category text-white/90">Mostrando página {{ paginaActual }} de {{ totalPaginas }}</p>
          </md-card-header>
          <md-card-content>
            <md-table :value="estudiantesFiltradosPaginados" table-header-color="orange">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="RUN">{{ item.rut }}</md-table-cell>
                <md-table-cell md-label="Año de ingreso">{{ item.anio_ingreso }}</md-table-cell>
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
import { obtenerEstudiantesResumen } from '../api/api';

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
              (!this.filtroRiesgo || e.riesgo === this.filtroRiesgo);
      });
    },
    totalPaginas() {
      return Math.ceil(this.estudiantesFiltrados.length / this.porPagina);
    },
    estudiantesFiltradosPaginados() {
      const inicio = (this.paginaActual - 1) * this.porPagina;
      return this.estudiantesFiltrados.slice(inicio, inicio + this.porPagina);
    },
    // 🟡 Este es el nuevo "computed" bien ubicado
    estadisticasFiltradas() {
      const filtrados = this.estudiantes.filter(e => {
        return !this.filtroAnio || String(e.anioIngreso) === String(this.filtroAnio);
      });

      const total = filtrados.length;
      const alto = filtrados.filter(e => e.riesgo === 'Alto').length;
      const medio = filtrados.filter(e => e.riesgo === 'Medio').length;
      const bajo = filtrados.filter(e => e.riesgo === 'Bajo').length;

      return { total, alto, medio, bajo };
    },
    // 🟡 Tarjetas dinámicas según filtros (¡lo nuevo!)
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
      return {
        'text-red-600': nivel === 'Alto',
        'text-yellow-600': nivel === 'Medio',
        'text-green-600': nivel === 'Bajo',
        'text-gray-500': !['Alto', 'Medio', 'Bajo'].includes(nivel)
      }
    },
  },
  async mounted() {
    try {
      const res = await obtenerEstudiantesResumen();
      this.estudiantes = res.data;
    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error);
    }
    // try {
    //   const res = await fetch('http://localhost:8000/riesgos_calculados');
    //   const data = await res.json();
    //   this.estudiantes = data;
    //   // Ya no necesitas "statsCards" fijo; usarás el dinámico
    // } catch (error) {
    //   console.error('❌ Error al cargar estadísticas:', error);
    // }
  },
}
</script>
