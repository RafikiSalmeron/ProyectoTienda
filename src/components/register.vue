<template>
  <div class="register-container">
    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-light">
      <router-link to="/">
        <img src="../assets/rafiki.png" alt="Logo" title="Logo" />
      </router-link>
    </nav>
    <!-- /Header -->
    <!-- Contenedor principal -->
    <div class="container">
      <div class="container-flex">
        <div class="field">
          <h2>¿Aún no tienes usuario? ¡Regístrate aquí!</h2>
          <p style="display: none; color: red" id="pError">ERROR</p>
          <label class="label">Email</label>
          <div class="control">
            <input
              id="inEmail"
              class="input"
              type="email"
              placeholder="ejemplo@email.com"
              v-model="email"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Contraseña</label>
          <div class="control">
            <input
              id="inPassword"
              class="input"
              type="password"
              placeholder="Mínimo 6 caracteres"
              v-model="password"
              v-on:keyup.enter="register"
            />
          </div>
          <button @click="register">Registrar</button>
        </div>
      </div>
    </div>
    <!-- /Contenedor principal -->
    <!-- Footer -->
    <Footer />
    <!-- /Footer -->
  </div>
</template>

<script>
// Se importan las dependencias
import firebase from "firebase/app";
import Footer from "./footer.vue";

export default {
  name: "Register",
  components: { Footer },
  data() {
    return {
      email: "",
      password: "",
      pata: [],
    };
  },
  mounted: function () {
    // Se obtiene el email
    this.email = localStorage.getItem("userEmail");
    // Compruebo si he obtenido un email
    if (this.email) {
      // Si he obtenido el email, redirijo al home y muestro mensaje de información
      this.$notify({
        title: "Sesión iniciada",
        type: "warn",
        text: "¡Tienes la sesión iniciada!",
      });
      // Redirijo al inicio
      this.$router.push({ name: "home" });
    }
  },

  methods: {
    /**
     * Función que valida el email y la contraseña
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @return {Boolean} True si está todo correcto, False si algún campo no es válido
     */
    validate() {
      // Escondo el párrafo de error y le cambio el borde de color a los inputs de email y contraseña
      document.getElementById("pError").style.display = "none";
      document.getElementById("inEmail").style.borderColor = "black";
      document.getElementById("inPassword").style.borderColor = "black";

      // Compruebo si el email esta vacío
      if (!this.email) {
        // Cambio el borde de color y le aplico el texto al párrafo
        document.getElementById("inEmail").style.borderColor = "red";
        document.getElementById("pError").innerText =
          "El email no puede estar vacío.";
        // Retorno false
        return false;
      }

      // Compruebo si la contraseña no supera los 6 caracteres
      if (this.password.length < 6) {
        // Cambio el borde de color y le aplico el texto al párrafo
        document.getElementById("inPassword").style.borderColor = "red";
        document.getElementById("pError").innerText =
          "La contraseña debe tener mínimo 6 caracteres.";
        // Retorno false
        return false;
      }

      // Establezco el patrón de validación
      let reg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

      // Compruebo si el email es válido
      if (reg.test(this.email)) {
        // Retorno true
        return true;
      } else {
        // Cambio el borde de color y le aplico el texto al párrafo
        document.getElementById("inEmail").style.borderColor = "red";
        document.getElementById("pError").innerText =
          "El email no tiene un formato válido.";
        // Retorno false
        return false;
      }
    },
    /**
     * Función que registra al usuario
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    register() {
      // Compruebo si los campos de email y password son válidos
      if (this.validate()) {
        /**
         *
         * Función de Firebase para registrar usuarios
         *
         */
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            // Limpio los inputs
            this.email = "";
            this.password = "";
            // Muestro mensaje de información
            this.$notify({
              title: "Usuario registrado",
              text: "Se ha registrado el usuario correctamente.",
            });
            // Redirijo al login
            this.$router.push({ name: "login" });
          })
          // Compruebo si ha ocurrido algún error
          .catch(() => {
            // Muestro mensaje de error
            this.$notify({
              title: "Inicio de Sesión",
              type: "error",
              text: "Ha ocurrido un error al registrar el usuario. Comprueba los campos introducidos",
              duration: 5000,
            });
          });
      } else {
        // Muestro el párrafo de error
        document.getElementById("pError").style.display = "block";
        // Muestro mensaje de error
        this.$notify({
          title: "Error de validacón",
          type: "error",
          text: "Ha ocurrido un error al validar los campos. Comprueba que se han introducido correctamente.",
        });
      }
    },
  },
};
</script>


<style scoped lang="scss">
@import "../scss/component/_register.scss";
</style>