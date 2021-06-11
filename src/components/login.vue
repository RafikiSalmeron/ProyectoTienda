<template>
  <div class="container-login">
    <nav class="navbar navbar-expand-lg navbar-light bg-dark">
      <router-link to="/">
        <img src="../assets/rafiki.png" />
      </router-link>
    </nav>

    <h2>Iniciar sesión</h2>
    <div class="field">
      <label class="label">E-mail</label>
      <div class="control">
        <input
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
          class="input"
          type="password"
          placeholder="Contraseña aqui.."
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
      if (this.email && this.password) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            console.log(user.user.email);
            console.log(Firebase.auth.currentUser.email);
            this.$notify({
              title: "Inicio de Sesión",
              type: "success",
              text: "Se ha iniciado sesión. ",
            });
            localStorage.setItem("userEmail", Firebase.auth.currentUser.email);
            this.$router.push({ name: "home" });
          })
          .catch((err) => {
            this.$notify({
              title: "Inicio de Sesión",
              type: "error",
              text: err,
            });
          });
      } else {
        this.$notify({
          title: "Inicio de Sesión",
          type: "error",
          text: "Todos los campos deben estar rellenos.",
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/login.scss";
</style>