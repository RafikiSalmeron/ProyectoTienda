<template>
  <div class="container-login">
    <nav class="navbar navbar-expand-lg navbar-light">
      <router-link to="/">
        <img src="../assets/rafiki.png" />
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
  computed: {
    authenticated() {
      return this.user.loggedIn;
    },
  },
  methods: {
    validate() {
      document.getElementById("pError").style.display = "none";
      document.getElementById("inEmail").style.borderColor = "black";
      document.getElementById("inPassword").style.borderColor = "black";

      if (!this.email) {
        document.getElementById("inEmail").style.borderColor = "red";
        document.getElementById("pError").innerText =
          "El email no puede estar vacío.";
        return false;
      }
      if (this.password.length < 1) {
        document.getElementById("inPassword").style.borderColor = "red";
        document.getElementById("pError").innerText =
          "La contraseña no puede estar vacía.";
        return false;
      }
      let reg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

      if (reg.test(this.email)) {
        return true;
      } else {
        document.getElementById("inEmail").style.borderColor = "red";
        document.getElementById("pError").innerText =
          "El email no tiene un formato válido.";
        return false;
      }
    },
    registrar() {
      this.$router.push({ name: "register" });
    },
    login(prov) {
      var provider;
      if (prov == "Facebook") {
        provider = new firebase.auth.FacebookAuthProvider();
      }
      if (prov == "Google") {
        provider = new firebase.auth.GoogleAuthProvider();
      }
      if (prov == "Github") {
        provider = new firebase.auth.GithubAuthProvider();
      }
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          this.$notify({
            title: "Inicio de Sesión",
            type: "success",
            text: "Se ha iniciado sesión. ",
          });
          localStorage.setItem("userEmail", Firebase.auth.currentUser.email);
          this.$router.push({ name: "home" });
        })
        .catch(function (error) {
          this.$notify({
            title: "Inicio de Sesión",
            type: "error",
            text: "No se ha podido iniciar sesión.",
          });
          console.log(error);
        });
    },
    loginEmail: function () {
      if (this.validate()) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.$notify({
              title: "Inicio de Sesión",
              type: "success",
              text: "Se ha iniciado sesión. ",
            });
            localStorage.setItem("userEmail", Firebase.auth.currentUser.email);
            this.$router.push({ name: "home" });
          })
          .catch((err) => {
            document.getElementById("pError").style.display = "block";
            document.getElementById("inEmail").style.borderColor = "red";
            document.getElementById("inPassword").style.borderColor = "red";
            if (
              err.code == "auth/user-not-found" ||
              err.code == "auth/wrong-password"
            ) {
              document.getElementById("pError").innerText =
                "Email o contraseña incorrectos.";
              this.$notify({
                title: "Inicio de Sesión",
                type: "warn",
                text: "Email o contraseña incorrectos.",
              });
            } else {
              this.$notify({
                title: "Inicio de Sesión",
                type: "error",
                text: "Ha ocurrido un error al iniciar sesión.",
              });
            }
          });
      } else {
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