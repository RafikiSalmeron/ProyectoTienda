<template>
  <div id="home">
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
      <img
        src="../assets/rafiki.png"
        width="250px"
        height="250px"
        title="Logo de mono"
        alt="Logo de mono"
      />
      <img
        src="../assets/rafikify.png"
        width="250px"
        height="250px"
        title="Logo de mono"
        alt="Logo de mono"
      />
    </div>
    <Novedades :novedades="novedad" />
    <Destacados :destacados="prodDestacados" />
    <Footer />
  </div>
</template>

<script>
// Se importan las dependencias
import Destacados from "./destacados.vue";
import Novedades from "./novedades.vue";
import Header from "./header.vue";
import Footer from "./footer.vue";

import { db } from "../db";

export default {
  name: "Home",

  components: {
    Header,
    Novedades,
    Destacados,
    Footer,
  },
  data() {
    return {
      productos: [],
      prodDestacados: [],
      user: {
        loggedIn: false,
        data: {},
      },
      email: "",
    };
  },
  computed: {
    /**
     * Función que devuelve un array con los productos que son novedad
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @return {Array} Array con los productos que son novedad
     *
     */
    novedad: function () {
      // Creo un array vacío para las novedades
      var novArray = [];
      // Recorro todos los productos
      for (var prod of this.productos) {
        // Compruebo si el producto es novedad
        if (prod.novedad) {
          // Añado el producto al array
          novArray.push(prod);
        }
      }
      // Retorno el array con las novedades
      return novArray;
    },
  },
  mounted: function () {
    // Se obtiene el email
    this.email = localStorage.getItem("userEmail");
    // Compruebo si he obtenido un email
    if (this.email) {
      // Establezco el usuario a logeado
      this.user.loggedIn = true;
    } else {
      // Establezco el usuario a no logeado
      this.user.loggedIn = false;
      this.user.data = {};
    }

    // Selecciono el item como activo
    document.querySelector("#nav-link-home").classList.add("active");
  },
  // Obtengo los datos de la base de datos
  firestore: {
    productos: db.collection("Productos"),
    prodDestacados: db
      .collection("Productos")
      .orderBy("vecesVendido", "desc")
      .limit(5),
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_home.scss";
</style>
