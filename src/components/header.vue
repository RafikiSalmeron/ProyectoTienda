<template>
  <section>
    <nav class="navbar navbar-expand-lg navbar-light">
      <vue-confirm-dialog></vue-confirm-dialog>
      <router-link to="/">
        <img src="../assets/rafiki.png" />
      </router-link>
      <button
        class="navbar-toggler navbar-dark"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div v-if="user.loggedIn" class="mr-auto email">
          {{ email }}
        </div>
        <div v-else class="mr-auto"></div>
        <div v-if="user.loggedIn" class="carroPerfil">
          <i
            v-if="!admin"
            @click="cestita()"
            class="fa fa-shopping-cart"
            aria-hidden="true"
            ><span class="inside-i">Carrito</span></i
          >
          <i
            v-else
            @click="administrador()"
            class="fa fa-lock"
            aria-hidden="true"
            ><span class="inside-i">Administrador</span></i
          >
          <i
            @click="toProfile()"
            v-if="$route.name != 'profile' && !admin"
            class="fa fa-user-circle"
            aria-hidden="true"
            ><span class="inside-i">Perfil</span></i
          >
          <i v-else @click="logout()" class="fa fa-sign-out" aria-hidden="true"
            ><span class="inside-i">Cerrar sesión</span>
          </i>
        </div>
        <i
          @click="userProfile()"
          v-if="!user.loggedIn"
          class="fa fa-user-circle-o"
          aria-hidden="true"
          ><span class="inside-i">Iniciar sesión</span></i
        >
      </div>
    </nav>
    <div class="botHeader">
      <ul class="nav nav-tabs nav-fill">
        <li class="nav-item" @click="toHome()">
          <a class="nav-link" id="nav-link-home" aria-current="page">Inicio</a>
        </li>
        <li class="nav-item" @click="toProducts()">
          <a class="nav-link" id="nav-link-products" aria-current="page"
            >Productos</a
          >
        </li>
        <li class="nav-item" @click="toAboutUs()">
          <a class="nav-link" id="nav-link-aboutUs" aria-current="page"
            >¿Quiénes somos?</a
          >
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import Firebase from "../db";
import firebase from "firebase/app";

export default {
  name: "Header",
  props: {},
  data() {
    return {
      user: {
        loggedIn: false,
        data: {},
      },
      email: null,
      admin: false,
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$notify({
            title: "Inicio de Sesión",
            type: "error",
            text: "Se ha cerrado sesión. ",
          });
          localStorage.setItem("userEmail", "");
          this.$router.push({ name: "login" });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    administrador() {
      this.$confirm({
        message: `¿Dónde deseas acceder?`,
        button: {
          no: "Administrador de productos",
          yes: "Historial de ventas",
        },
        /**
         * Callback Function
         * @param {Boolean} confirm
         */
        callback: (confirm) => {
          console.log(confirm);
          if (confirm) {
            if (this.$route.name != "profile") {
              this.$router.push({ name: "profile" });
            }
          } else {
            if (this.$route.name != "admin") {
              this.$router.push({ name: "admin" });
            }
          }
        },
      });
    },
    userProfile() {
      this.$router.push({ name: "login" });
    },
    toHome() {
      if (this.$route.name != "home") {
        this.$router.push({ name: "home" });
      }
    },
    toProducts() {
      if (this.$route.name != "productList") {
        this.$router.push({ name: "productList" });
      }
    },
    toProfile() {
      if (this.$route.name != "profile") {
        this.$router.push({ name: "profile" });
      }
    },
    toAboutUs() {
      if (this.$route.name != "aboutUs") {
        this.$router.push({ name: "aboutUs" });
      }
    },
    cestita() {
      if (this.user.loggedIn == false) {
        this.$notify({
          title: "Inicio de Sesión",
          type: "error",
          text: "Tienes que iniciar sesión para acceder al carrito.",
        });
      } else {
        this.$router.push({ name: "chart" });
      }
    },
  },
  created: function () {
    this.email = localStorage.getItem("userEmail");
    console.log(this.$route.name);
    Firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("HEADER");
        console.log(user);
        this.user.loggedIn = true;
        localStorage.setItem("userEmail", user.email);
        this.email = user.email;
        if (this.email == "admin@admin.com") {
          this.admin = true;
        }
      } else {
        this.user.loggedIn = false;
        localStorage.setItem("userEmail", "");
        this.user.data = {};
        this.admin = false;
      }
    });
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_header.scss";
</style>