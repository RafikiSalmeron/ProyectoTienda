<template>
  <section>
    <nav class="navbar navbar-expand-lg navbar-light">
      <vue-confirm-dialog></vue-confirm-dialog>
      <router-link to="/">
        <img src="../assets/rafiki.png" alt="Logo" title="Logo" />
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
  created: function () {
    // Se obtiene el email
    this.email = localStorage.getItem("userEmail");
    /**
     *
     * Listener de Firebase que comprueba si hay sesión iniciada y cuándo se cierra
     *
     */
    Firebase.auth.onAuthStateChanged((user) => {
      // Compruebo si hay un usuario logeado
      if (user) {
        // Establezco el usuario a logeado
        this.user.loggedIn = true;
        // Establezco el email del usuario en el Local Storage
        localStorage.setItem("userEmail", user.email);
        // Establezco el email del usuario
        this.email = user.email;
        // Compruebo si el email logeado es el admin
        if (this.email == "admin@admin.com") {
          // Establezco el usuario como admin
          this.admin = true;
        }
      } else {
        // Establezco el usuario como no logeado
        this.user.loggedIn = false;
        // Elimino al usuario del Local Storage
        localStorage.setItem("userEmail", "");
        // Elimino la información del usuario
        this.user.data = {};
        this.admin = false;
      }
    });
  },
  methods: {
    /**
     * Función que cierra la sesión del usuario
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    logout() {
      /**
       *
       * Función que cierra la sesión del usuario nativa de firebase
       *
       */
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Muestro mensaje de información
          this.$notify({
            title: "Inicio de sesión",
            type: "error",
            text: "Se ha cerrado sesión. ",
          });
          // Elimino al usuario del Local Storage
          localStorage.setItem("userEmail", "");
          // Redirijo al login
          this.$router.push({ name: "login" });
        })
        .catch(function () {
          // Muestro mensaje de información
          this.$notify({
            title: "Cerrar sesión",
            type: "error",
            text: "Ha ocurrido un error al cerrar sesión. ",
          });
        });
    },
    /**
     * Función que muestra un dialog para acceder al historial de pedidos o administración de productos (administrador)
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    administrador() {
      // Muestro el dialog
      this.$confirm({
        message: `¿Dónde deseas acceder?`,
        button: {
          no: "Administrador de productos",
          yes: "Historial de ventas",
        },
        /**
         * Callback Function
         * @param {Boolean} confirm Resultado del dialog
         */
        callback: (confirm) => {
          // Compruebo el resultado
          if (confirm) {
            // Compruebo si no estoy ya en el historial de pedidos (perfil)
            if (this.$route.name != "profile") {
              // Redirijo al historial de pedidos (perfil)
              this.$router.push({ name: "profile" });
            }
          } else {
            // Compruebo si no estoy ya en la administración de productos
            if (this.$route.name != "admin") {
              // Redirijo a la administración de productos
              this.$router.push({ name: "admin" });
            }
          }
        },
      });
    },
    /**
     * Función que redirige al login
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    userProfile() {
      // Redirijo al login
      this.$router.push({ name: "login" });
    },
    /**
     * Función que redirige al inicio
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    toHome() {
      // Compruebo si no estoy en el inicio
      if (this.$route.name != "home") {
        // Redirijo al inicio
        this.$router.push({ name: "home" });
      }
    },
    /**
     * Función que redirige a la lista de productos
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    toProducts() {
      // Compruebo que no estoy en la lista de productos
      if (this.$route.name != "productList") {
        // Redirijo a la lista de productos
        this.$router.push({ name: "productList" });
      }
    },
    /**
     * Función que redirige al perfil
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    toProfile() {
      // Compruebo que no estoy en el perfil
      if (this.$route.name != "profile") {
        // Redirijo al perfil
        this.$router.push({ name: "profile" });
      }
    },
    /**
     * Función que redirige al "¿Quiénes somos?"
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    toAboutUs() {
      // Compruebo que no estoy en el "¿Quiénes somos?"
      if (this.$route.name != "aboutUs") {
        // Redirijo al "¿Quiénes somos?"
        this.$router.push({ name: "aboutUs" });
      }
    },
    /**
     * Función que redirige al carrito
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    cestita() {
      // Compruebo si el usuario esta logeado
      if (this.user.loggedIn == false) {
        // Muestro mensaje de error
        this.$notify({
          title: "Inicio de Sesión",
          type: "error",
          text: "Tienes que iniciar sesión para acceder al carrito.",
        });
      } else {
        // Redirijo al carrito
        this.$router.push({ name: "chart" });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_header.scss";
</style>