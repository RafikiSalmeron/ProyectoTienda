<template>
  <div id="aboutUs">
    <Header />
    <h2>NOSOTROS</h2>
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
</style>
