<template>
  <div id="noved-main-container">
    <h2>Productos destacados</h2>
    <cube-spin v-if="destacados.length == 0"></cube-spin>
    <div class="noved-container">
      <div
        class="noved-card"
        v-for="producto in destacados"
        v-bind:key="producto.id"
        v-cloak
      >
        <router-link v-bind:to="`/productDetail/${producto.id}`">
          <img :src="producto.img" alt="Producto Novedad" />
        </router-link>
        <p class="bold">{{ producto.Nombre }}</p>
        <p class="precio bold">{{ producto.Precio }} €</p>
        <p v-if="producto.stock == 0" class="stock">
          ¡No hay stock disponible!
          <i class="fa fa-frown-o" aria-hidden="true"></i>
        </p>
        <p v-else class="stock">Stock : {{ producto.stock }}</p>
        <button
          class="btnAddChart"
          v-if="!admin && producto.stock != 0"
          @click="addProduct(producto)"
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Firebase from "../db";
import { db } from "../db";
import CubeSpin from "../../node_modules/vue-loading-spinner/src/components/Circle";

export default {
  name: "Destacados",
  components: {
    CubeSpin,
  },
  props: {
    destacados: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods: {
    stock(producto) {
      if (producto.stock > 0) {
        return false;
      }
      return true;
    },
    addProduct(producto) {
      if (this.user.loggedIn) {
        for (var chart of this.carrito) {
          if (chart.email == this.email && chart.idProduct == producto.id) {
            this.cesta = chart;
            this.hay = true;
          }
        }
        if (this.hay) {
          if (this.cesta.cantidad == producto.stock) {
            this.$notify({
              title: "Añadir al carrito",
              type: "error",
              text: "No hay más stock disponible. Ya tienes el máximo número de artículos posible en el carrito.",
            });
          } else {
            db.collection("Carrito")
              .doc(this.cesta.id)
              .update({
                cantidad: parseFloat(this.cesta.cantidad) + 1,
                precioTotal:
                  (parseFloat(this.cesta.cantidad) + 1) *
                  parseFloat(producto.Precio),
                producto,
              });
            this.$notify({
              title: "Añadir al carrito",
              type: "success",
              text: "Has añadido un producto al carrito.",
            });
          }
        } else {
          db.collection("Carrito").add({
            email: this.email,
            idProduct: producto.id,
            cantidad: 1,
            precioTotal: parseFloat(producto.Precio),
            producto,
          });
          this.$notify({
            title: "Añadir al carrito",
            type: "success",
            text: "Has añadido un producto al carrito.",
          });
        }
        this.hay = false;
      } else {
        this.$notify({
          title: "Añadir al carrito",
          type: "error",
          text: "Tienes que iniciar sesión para añadir productos al carrito.",
        });
      }
    },
  },
  data() {
    return {
      user: {
        loggedIn: false,
        data: {},
      },
      email: "",
      admin: false,
      carrito: [],
      cesta: null,
      hay: false,
    };
  },
  firestore: {
    carrito: db.collection("Carrito"),
  },
  mounted: function () {
    this.email = localStorage.getItem("userEmail");
    Firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user.loggedIn = true;
        if (this.email == "admin@admin.com") {
          this.admin = true;
        }
      } else {
        this.user.loggedIn = false;
        this.user.data = {};
        this.admin = false;
      }
    });
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_destacados.scss";
</style>