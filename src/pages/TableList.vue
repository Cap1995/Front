<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Formulario de Estudiante</h4>
            <p class="category">Registro y actualización de datos</p>
          </md-card-header>

          <md-card-content class="main-card-content">
            <!-- Académicos -->
            <h3 class="section-title">Académicos</h3>
            <div class="md-layout">
              <div v-for="campo in secciones.academicos" :key="campo.model" class="md-layout-item md-size-25">
                <md-field>
                  <label>{{ campo.label }}</label>
                  <md-input v-model="form[campo.model]"></md-input>
                </md-field>
              </div>
            </div>

            <!-- Personales -->
            <h3 class="section-title">Personales</h3>
            <div class="md-layout">
              <div v-for="campo in secciones.personales" :key="campo.model" class="md-layout-item md-size-25">
                <md-field>
                  <label>{{ campo.label }}</label>
                  <md-input v-model="form[campo.model]"></md-input>
                </md-field>
              </div>
            </div>

            <!-- Procedencia -->
            <h3 class="section-title">Procedencia</h3>
            <div class="md-layout">
              <div v-for="campo in secciones.procedencia" :key="campo.model" class="md-layout-item md-size-25">
                <md-field>
                  <label>{{ campo.label }}</label>
                  <md-input v-model="form[campo.model]"></md-input>
                </md-field>
              </div>
            </div>

            <!-- Monitoreo -->
            <h3 class="section-title">Monitoreo</h3>
            <div class="md-layout">
              <div v-for="campo in secciones.monitoreo" :key="campo.model" class="md-layout-item md-size-25">
                <md-field>
                  <label>{{ campo.label }}</label>
                  <md-input v-model="form[campo.model]"></md-input>
                </md-field>
              </div>
            </div>

            <!-- Evaluaciones -->
            <h3 class="section-title">Evaluaciones</h3>
            <div class="md-layout">
              <div v-for="campo in secciones.evaluaciones" :key="campo.model" class="md-layout-item md-size-25">
                <md-field>
                  <label>{{ campo.label }}</label>
                  <md-input v-model="form[campo.model]"></md-input>
                </md-field>
              </div>
            </div>
          </md-card-content>

          <md-card-actions>
            <md-button class="md-raised md-primary" type="submit">Guardar</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableList",
  data() {
    return {
      form: {},
      secciones: {
        academicos: [
          { label: "RUN", model: "run" },
          { label: "Cohorte", model: "cohorte" },
          { label: "Estado", model: "estado" },
          { label: "Vía de Ingreso", model: "viaIngreso" },
          { label: "Habilitado PACE / Cupo PACE", model: "pace" },
          { label: "Habilitado PAT / Cupo PAT", model: "pat" },
          { label: "Habilitado Semilla / Cupo Semilla", model: "semilla" },
          { label: "Discapacidad", model: "discapacidad" },
          { label: "Carrera", model: "carrera" },
          { label: "Sede", model: "sede" },
        ],
        personales: [
          { label: "Apellido Paterno", model: "apellidoPaterno" },
          { label: "Apellido Materno", model: "apellidoMaterno" },
          { label: "Primer Nombre", model: "primerNombre" },
          { label: "Segundo Nombre", model: "segundoNombre" },
          { label: "Correo Personal", model: "correoPersonal" },
          { label: "Correo Institucional", model: "correoInstitucional" },
          { label: "Teléfono 1", model: "telefono1" },
          { label: "Teléfono 2", model: "telefono2" },
          { label: "Nacionalidad", model: "nacionalidad" },
          { label: "Dirección", model: "direccion" },
          { label: "Ciudad Residencia", model: "ciudad" },
        ],
        procedencia: [
          { label: "PACE IES Procedencia", model: "paceIes" },
          { label: "RBD", model: "rbd" },
          { label: "Establecimiento", model: "establecimiento" },
          { label: "Comuna", model: "comuna" },
        ],
        monitoreo: [
          { label: "Mes Monitoreo", model: "mesMonitoreo" },
          { label: "Contactado", model: "contactado" },
          { label: "Fecha Contacto", model: "fechaContacto" },
        ],
        evaluaciones: [
          { label: "Rendimiento Académico", model: "rendimiento" },
          { label: "Vocacional", model: "vocacional" },
          { label: "Salud Mental", model: "saludMental" },
          { label: "Solicitud de Apoyo", model: "solicitudApoyo" },
          { label: "Inglés", model: "ingles" },
          { label: "Matemática", model: "matematica" },
          { label: "Química", model: "quimica" },
          { label: "Física", model: "fisica" },
          { label: "Biología", model: "biologia" },
          { label: "A+A", model: "ayudaAprendizaje" },
          { label: "Psicoeducativo", model: "psicoeducativo" },
          { label: "Observaciones Monitoreo", model: "observaciones" },
        ],
      },
    };
  },
  methods: {
    guardarFormulario() {
      console.log("Formulario guardado:", this.form);
    },
  },
};
</script>

<style scoped>
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px;
  color: #2e7d32;
}
.main-card-content {
  background: transparent;
  padding: 20px;
}
</style>
