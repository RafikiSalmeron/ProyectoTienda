<template>
  <div id="noved-main-container">
    <h2>Novedades</h2>
    <cube-spin v-if="novedades.length == 0"></cube-spin>
    <div id="carouselId" v-else class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators">
        <li
          v-if="novedades.length >= 1"
          data-target="#carouselId"
          data-slide-to="0"
          class="active"
        ></li>
        <li
          v-if="novedades.length >= 2"
          data-target="#carouselId"
          data-slide-to="1"
        ></li>
        <li
          v-if="novedades.length >= 3"
          data-target="#carouselId"
          data-slide-to="2"
        ></li>
      </ol>
      <div class="carousel-inner" role="listbox">
        <div v-if="novedades.length >= 1" class="carousel-item active">
          <router-link v-bind:to="`/productDetail/${novedades[0].id}`">
            <img
              data-src="holder.js/900x500/auto/#777:#555/text:First slide"
              :src="novedades[0].img"
              alt="First slide"
            />
          </router-link>
        </div>
        <div v-if="novedades.length >= 2" class="carousel-item">
          <router-link v-bind:to="`/productDetail/${novedades[1].id}`">
            <img
              data-src="holder.js/900x500/auto/#666:#444/text:Second slide"
              :src="novedades[1].img"
              alt="Second slide"
            />
          </router-link>
        </div>
        <div v-if="novedades.length >= 3" class="carousel-item">
          <router-link v-bind:to="`/productDetail/${novedades[2].id}`">
            <img
              data-src="holder.js/900x500/auto/#666:#444/text:Third slide"
              :src="novedades[2].img"
              alt="Third slide"
            />
          </router-link>
        </div>
      </div>
      <a
        class="carousel-control-prev"
        href="#carouselId"
        role="button"
        data-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a
        class="carousel-control-next"
        href="#carouselId"
        role="button"
        data-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  </div>
</template>

<script>
import Firebase from "../db";
import { db } from "../db";
import CubeSpin from "../../node_modules/vue-loading-spinner/src/components/Circle";

export default {
  name: "Novedades",
  components: {
    CubeSpin,
  },
  props: {
    novedades: {
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
@import "../scss/component/_novedades.scss";
</style>