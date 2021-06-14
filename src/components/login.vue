<template>
  <div class="container-login">
    <nav class="navbar navbar-expand-lg navbar-light">
      <router-link to="/">
        <img
          src="../assets/rafiki.png"
          title="Logo de mono"
          alt="Logo de mono"
        />
      </router-link>
    </nav>

    <h2>Iniciar sesión</h2>
    <div class="field">
      <p style="display: none; color: red" id="pError">ERROR</p>
      <label class="label">E-mail</label>
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
          v-on:keyup.enter="loginEmail"
          v-model="password"
        />
      </div>
    </div>
    <div class="login">
      <button class="first" @click="loginEmail">Login</button>
      <button @click="login('Facebook')">Login con Facebook</button>
      <button @click="login('Google')">Login con Google</button>
      <button @click="login('Github')">Login con Github</button>
      <button class="register" @click="registrar">Registrarse</button>
    </div>

    <Footer />
  </div>
</template>

<script>
// Se importan las dependencias
import Firebase from "../db";
import firebase from "firebase/app";
import Footer from "./footer.vue";

export default {
  name: "Login",
  components: { Footer },
  props: {},
  data() {
    return {
      user: {
        loggedIn: false,
        data: {},
      },
      email: "",
      password: "",
    };
  },
  methods: {
    /**
     * Función que valida el email y la contraseña
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @return {Boolean} True si está todo correcto, False si algún campo no es válido
     *
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
      // Compruebo si la contraseña está vacía
      if (this.password.length < 1) {
        // Cambio el borde de color y le aplico el texto al párrafo
        document.getElementById("inPassword").style.borderColor = "red";
        document.getElementById("pError").innerText =
          "La contraseña no puede estar vacía.";
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
     * Función que redirige al register
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    registrar() {
      // Redirijo al register
      this.$router.push({ name: "register" });
    },
    /**
     * Función que logea al usuario con los métodos de acceso que te permite Firebase
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @param {String} prov Proveedor con el cual se quiere iniciar sesión
     *
     */
    login(prov) {
      // Establezco la variable encargada de seleccionar el proveedor
      var provider;
      // Compruebo si el proveedor es Facebook
      if (prov == "Facebook") {
        // Establezco Facebook como proveedor
        provider = new firebase.auth.FacebookAuthProvider();
      }
      // Compruebo si el proveedor es Google
      if (prov == "Google") {
        // Establezco Google como proveedor
        provider = new firebase.auth.GoogleAuthProvider();
      }
      // Compruebo si el proveedor es GitHub
      if (prov == "Github") {
        // Establezco GitHub como proveedor
        provider = new firebase.auth.GithubAuthProvider();
      }
      /**
       *
       * Función que logea al usuario con el proveedor indicado anteriormente
       *
       */
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          // Muestro mensaje de información
          this.$notify({
            title: "Inicio de Sesión",
            type: "success",
            text: "Se ha iniciado sesión. ",
          });
          // Establezco el email del usuario en el Local Storage
          localStorage.setItem("userEmail", Firebase.auth.currentUser.email);
          // Redirijo al inicio
          this.$router.push({ name: "home" });
        })
        .catch(function () {
          // Muestro mensaje de error
          this.$notify({
            title: "Inicio de Sesión",
            type: "error",
            text: "No se ha podido iniciar sesión.",
          });
        });
    },
    /**
     * Función que logea al usuario con email y contraseña
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    loginEmail: function () {
      // Compruebo si el email y la contraseña son válidos
      if (this.validate()) {
        /**
         *
         * Función que logea al usuario con el email y la contraseña
         *
         */
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            // Muestro mensaje de información
            this.$notify({
              title: "Inicio de Sesión",
              type: "success",
              text: "Se ha iniciado sesión. ",
            });
            // Establezco el email del usuario en el Local Storage
            localStorage.setItem("userEmail", Firebase.auth.currentUser.email);
            // Redirijo al inicio
            this.$router.push({ name: "home" });
          })
          .catch((err) => {
            // Muestro mensaje de error
            document.getElementById("pError").style.display = "block";
            // Aplico el estilo a los bordes de los inputs
            document.getElementById("inEmail").style.borderColor = "red";
            document.getElementById("inPassword").style.borderColor = "red";
            // Compruebo el código de error
            if (
              err.code == "auth/user-not-found" ||
              err.code == "auth/wrong-password"
            ) {
              // Establezco el mensaje de error
              document.getElementById("pError").innerText =
                "Email o contraseña incorrectos.";
              // Muestro mensaje de aviso
              this.$notify({
                title: "Inicio de Sesión",
                type: "warn",
                text: "Email o contraseña incorrectos.",
              });
            } else {
              // Muestro mensaje de error
              this.$notify({
                title: "Inicio de Sesión",
                type: "error",
                text: "Ha ocurrido un error al iniciar sesión.",
              });
            }
          });
      } else {
        // Muestro mensaje de error
        document.getElementById("pError").style.display = "block";
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
@import "../scss/component/login.scss";
</style>