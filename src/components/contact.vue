<template>
  <div id="contact">
    <Header />
    <h2>CONTACTO</h2>
    <Footer />
  </div>
</template>

<script>
import Header from "./header.vue";
import Footer from "./footer.vue";

import { db } from "../db";

export default {
  name: "Contact",

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
      email: null,
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
      console.log(this.user.loggedIn);
    }
    document.querySelector("#nav-link-contact").classList.add("active");
  },

  firestore: {
    productos: db.collection("Productos"),
  },
};
</script>

<style scoped lang="scss">
</style>
