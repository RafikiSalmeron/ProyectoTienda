<template>
  <div id="aboutUs">
    <Header />
    <div
      class="
        jumbotron jumbotron-fluid
        d-flex
        flex-column
        align-items-center
        justify-content-around
      "
      style="background-repeat: no-repeat"
    >
      <img src="../assets/rafiki.png" width="250px" height="250px" alt="" />
      <img src="../assets/rafikify.png" width="250px" height="250px" alt="" />
    </div>
    <div class="text-aboutUs-container">
      <h3>¿Quiénes somos?</h3>
      <div class="text-aboutUs col-10 col-sm-9 col-md-6 col-lg-4 py-5">
        Rafikify es una tienda online de ropa y complementos creada en 2020. Sin
        embargo, nuestro recorrido por el mundo de la moda comenzó hace más de
        40 años, cuando nuestros padres abrieron su primera tienda. En nuestra
        tienda online encontraréis las últimas tendencias en ropa y
        complementos, seleccionados en nuestros viajes por las ciudades más
        vanguardistas.<br /><br />

        ¿No sabes cómo comprar? ¡Puedes empezar registrándote pulsando
        <a href="#/register">aquí</a>!.<br />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "./header.vue";
import Footer from "./footer.vue";

import { db } from "../db";

export default {
  name: "AboutUs",

  components: {
    Header,
    Footer,
  },
  data() {
    return {
      productos: [],
      user: {
        loggedIn: false,
        data: {},
      },
      email: "",
    };
  },
  computed: {
    authenticated() {
      return this.user.loggedIn;
    },
  },
  mounted: function () {
    this.email = localStorage.getItem("userEmail");
    if (this.email) {
      this.user.loggedIn = true;
    } else {
      this.user.loggedIn = false;
      this.user.data = {};
    }
    document.querySelector("#nav-link-aboutUs").classList.add("active");
  },

  firestore: {
    productos: db.collection("Productos"),
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_aboutUs.scss";
</style>
