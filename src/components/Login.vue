<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Iniciar sesión</h2>
      <p class="subtitle">Por favor ingresa tus credenciales</p>

      <form @submit.prevent="login">
        <div class="form-group">
          <label for="rut">RUT:</label>
          <input type="text" v-model="rut" id="rut" placeholder="Ej: 12345678" required />
        </div>

        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input type="password" v-model="password" id="password" required />
        </div>

        <button type="submit" class="login-btn">Ingresar</button>
        <p v-if="error" class="error-text">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
const BASE_URL = process.env.VUE_APP_API_URL || import.meta.env.VITE_API_URL;

export default {
  name: "Login",
  data() {
    return {
      rut: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async login() {
      this.error = null;
      try {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rut: parseInt(this.rut),
            password: this.password,
          }),
        });

        if (!res.ok) {
          this.error = "Credenciales inválidas";
          return;
        }

        const data = await res.json();
        localStorage.setItem("token", data.token);

        if (this.$route.path !== "/dashboard") {
          this.$router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
        this.error = "Error al conectar con el servidor";
      }
    },
  },
  created() {
    console.log("API Base URL:", BASE_URL);
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #4f46e5, #9333ea);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  color: #333;
}

.subtitle {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #777;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: #444;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.2s;
}

input:focus {
  border-color: #4f46e5;
  outline: none;
}

.login-btn {
  width: 100%;
  background-color: #4f46e5;
  color: white;
  padding: 0.7rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.login-btn:hover {
  background-color: #4338ca;
}

.error-text {
  color: red;
  margin-top: 0.8rem;
  text-align: center;
  font-size: 0.9rem;
}
</style>
