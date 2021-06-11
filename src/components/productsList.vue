<template>
  <div id="productsList">
    <Header />
    <Productos :productos="productos" />
    <Footer />
  </div>
</template>

<script>
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
      console.log(this.user.loggedIn);
    } else {
      this.user.loggedIn = false;
      this.user.data = {};
    }
    document.querySelector("#nav-link-products").classList.add("active");
  },

  firestore: {
    productos: db.collection("Productos"),
  },
};
</script>

<style scoped lang="scss">
</style>
