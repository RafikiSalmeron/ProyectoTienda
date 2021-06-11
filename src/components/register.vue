<template>
  <div class="register-container">
    <nav class="navbar navbar-expand-lg navbar-light bg-dark">
      <router-link to="/">
        <img src="../assets/rafiki.png" />
      </router-link>
    </nav>
    <div class="container">
      <div class="container-flex">
        <div class="field">
          <h2>Registrar</h2>
          <label class="label">Email</label>
          <div class="control">
            <input
              class="input"
              type="email"
              placeholder="Email aqui.."
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
              v-model="password"
            />
          </div>
          <button @click="register">Registrar</button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { db } from "../db";
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
  firestore: {
    pata: db.collection("Productos"),
  },
  methods: {
    register: function () {
      if (this.email && this.password) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.email = "";
            this.password = "";
            this.$router.push({ name: "login" });
          })
          .catch(() => {
            this.$notify({
              title: "Inicio de Sesión",
              type: "error",
              text: "Ha ocurrido un error al registrar el usuario. Comprueba los campos introducidos",
              duration: 5000,
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
@import "../scss/component/_register.scss";
</style>