<template>
  <div id="productsList">
    <Header />
    <Productos :productos="productos" />
    <Footer />
  </div>
</template>

<script>
// Se importan las dependencias
import Header from "./header.vue";
import Productos from "./productos.vue";
import Footer from "./footer.vue";
import { db } from "../db";

export default {
  name: "ProductsList",
  components: {
    Header,
    Productos,
    Footer,
  },
  data() {
    return {
      productos: [],
    };
  },
  mounted: function () {
    // Selecciono el item como activo
    document.querySelector("#nav-link-products").classList.add("active");
  },
  // Obtengo los datos de la base de datos
  firestore: {
    productos: db.collection("Productos"),
  },
};
</script>

<style scoped lang="scss">
</style>
