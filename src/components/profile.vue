<template>
  <div id="profile">
    <Header />
    <h3 class="py-5 m-0" style="background-color: rgb(240, 240, 240)">
      <i class="fa fa-bookmark" aria-hidden="true"></i> Historial de compras de
      {{ getnombre }}
    </h3>
    <h2 v-if="pedidos.length == 0 && !exist">NO HAY PEDIDOS</h2>
    <div class="div-container-pedido">
      <cube-spin v-if="pedidos.length == 0 && exist"></cube-spin>
      <div
        v-else
        class="pedidos-product"
        v-for="object in pedidos"
        v-bind:key="object.id"
      >
        <div class="visual-container">
          <div>{{ object.fecha }}</div>
          <div class="ml-1">Total: {{ object.total }}</div>
          <i
            @click="displayPedido(object.id)"
            :id="'flecha' + object.id"
            class="fa fa-arrow-down"
            aria-hidden="true"
          ></i>
        </div>
        <div :id="object.id" class="pedidosMostrar">
          <div
            class="pedido-product"
            v-for="pedido in object.pedido"
            v-bind:key="pedido.id"
          >
            <div class="img-container">
              <img :src="pedido.producto.img" alt="Producto" />
            </div>

            <div class="desc-container">
              <p>
                <strong>{{ pedido.producto.Nombre }}</strong>
              </p>
              <p>
                {{ pedido.producto.descripcion }}
              </p>
            </div>
            <div class="text-container">
              <p>
                <strong>Cantidad: {{ pedido.cantidad }}</strong>
              </p>
              <p>
                <strong>Precio Total: {{ pedido.precioTotal }}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from "./header.vue";
import Footer from "./footer.vue";
import Firebase from "../db";
import CubeSpin from "../../node_modules/vue-loading-spinner/src/components/Circle";

import { db } from "../db";

export default {
  name: "Profile",

  components: {
    Header,
    CubeSpin,
    Footer,
  },
  data() {
    return {
      pedidos: [],
      user: {
        loggedIn: false,
        data: {},
      },
      email: "",
      exist: true,
    };
  },
  computed: {
    authenticated() {
      return this.user.loggedIn;
    },
    getnombre() {
      // Convierte el correro del usuario en string
      const usuario = this.email.toString();
      // Lo separa con el elemento @
      const usuarioModificado = usuario.split("@");
      // Guardamos el primer string resultante
      const nombre = usuarioModificado[0];
      // Retornamos ese valor como nombre
      return nombre;
    },
  },
  mounted: function () {
    this.email = localStorage.getItem("userEmail");
    if (this.email) {
      this.user.loggedIn = true;
      console.log(this.user.loggedIn);
      this.exist = true;
      this.getPedidos();
    } else {
      this.user.loggedIn = false;
      this.user.data = {};
      this.$notify({
        title: "Inicio de Sesión",
        type: "error",
        text: "Tienes que iniciar sesión para acceder a tu perfil.",
      });
      this.$bind("pedidos", db.collection("Pedidos").where("email", "==", ""));
      this.$router.push({ name: "home" });
    }
  },
  methods: {
    getPedidos: function () {
      this.$bind(
        "pedidos",
        db.collection("Pedidos").where("email", "==", this.email)
      );
      setTimeout(() => {
        if (this.pedidos.length == 0) {
          this.exist = false;
        }
      }, 500);
    },
    displayPedido(idDiv) {
      var div = document.getElementById(idDiv);
      console.log(div.style.display);
      if (div.style.display == "none" || div.style.display == "") {
        document
          .getElementById("flecha" + idDiv)
          .classList.replace("fa-arrow-down", "fa-arrow-up");
        div.style.display = "flex";
      } else {
        div.style.display = "none";
        document
          .getElementById("flecha" + idDiv)
          .classList.replace("fa-arrow-up", "fa-arrow-down");
      }
    },
  },
  firestore: {
    pedidos: db
      .collection("Pedidos")
      .where("email", "==", Firebase.auth.currentUser ? this.email : ""),
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_profile.scss";
</style>
