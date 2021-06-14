<template>
  <div id="aboutUs">
    <Header />
    <!-- Jumbotron -->
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
        title="Rafikify"
        alt="Rafikify"
      />
    </div>
    <!-- /Jumbotron -->
    <!-- Contenedor principal -->
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
        <a href="#/register">aquí</a>!<br />
      </div>
    </div>
    <!-- /Contenedor principal -->
    <Footer />
  </div>
</template>

<script>
// Se importan las dependencias
import Header from "./header.vue";
import Footer from "./footer.vue";

export default {
  name: "AboutUs",
  components: {
    Header,
    Footer,
  },
  data() {
    return {};
  },
  mounted: function () {
    // Selecciono el item como activo
    document.querySelector("#nav-link-aboutUs").classList.add("active");
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_aboutUs.scss";
</style>
