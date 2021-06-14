<template>
  <div id="dest-main-container">
    <h2>Productos destacados</h2>
    <cube-spin v-if="destacados.length == 0"></cube-spin>
    <div class="dest-container">
      <div
        class="dest-card"
        v-for="producto in destacados"
        v-bind:key="producto.id"
        v-cloak
      >
        <router-link v-bind:to="`/productDetail/${producto.id}`">
          <img
            :src="producto.img"
            :title="producto.Nombre"
            :alt="producto.Nombre"
          />
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
// Se importan las dependencias
import { db } from "../db";
import CubeSpin from "../../node_modules/vue-loading-spinner/src/components/Circle";

export default {
  name: "Destacados",
  components: {
    CubeSpin,
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
  props: {
    destacados: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  mounted: function () {
    // Se obtiene el email
    this.email = localStorage.getItem("userEmail");
    // Compruebo si he obtenido un email
    if (this.email) {
      // Establezco el usuario a logeado
      this.user.loggedIn = true;
      // Compruebo si el usuario es el administrador
      if (this.email == "admin@admin.com") {
        // Establezco el usuario como administrador
        this.admin = true;
      }
    } else {
      // Establezco el usuario a no logeado
      this.user.loggedIn = false;
      this.user.data = {};
      this.admin = false;
    }
  },
  // Obtengo los datos de la base de datos
  firestore: {
    carrito: db.collection("Carrito"),
  },
  methods: {
    /**
     * Función que añade un producto al carrito
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @param {Object} producto Producto que se añade al carrito
     *
     */
    addProduct(producto) {
      // Compruebo si el usuario esta logeado
      if (this.user.loggedIn) {
        // Recorro el carrito del usuario
        for (var chart of this.carrito) {
          // Compruebo si en el carrito hay ese producto ya
          if (chart.email == this.email && chart.idProduct == producto.id) {
            // Establezco la cesta al carrito recorrido
            this.cesta = chart;
            // Establezco la variable a true pare indicar que ya está el producto
            this.hay = true;
          }
        }
        // Compruebo si el producto ya está en el carrito
        if (this.hay) {
          // Compruebo si la cantidad ya es igual o mayor al stock del producto
          if (this.cesta.cantidad >= producto.stock) {
            // Muestro mensaje de error
            this.$notify({
              title: "Añadir al carrito",
              type: "error",
              text: "No hay más stock disponible. Ya tienes el máximo número de artículos posible en el carrito.",
            });
          } else {
            // Actualizo el carrito sumando la cantidad y el precio total
            db.collection("Carrito")
              .doc(this.cesta.id)
              .update({
                cantidad: parseFloat(this.cesta.cantidad) + 1,
                precioTotal:
                  (parseFloat(this.cesta.cantidad) + 1) *
                  parseFloat(producto.Precio),
                producto,
              });
            // Muestro mensaje de información
            this.$notify({
              title: "Añadir al carrito",
              type: "success",
              text: "Has añadido un producto al carrito.",
            });
          }
        } else {
          // Añado el producto al carrito
          db.collection("Carrito").add({
            email: this.email,
            idProduct: producto.id,
            cantidad: 1,
            precioTotal: parseFloat(producto.Precio),
            producto,
          });
          // Muestro mensaje de información
          this.$notify({
            title: "Añadir al carrito",
            type: "success",
            text: "Has añadido un producto al carrito.",
          });
        }
        // Establezco la variable a false
        this.hay = false;
      } else {
        // Muestro mensaje de error
        this.$notify({
          title: "Añadir al carrito",
          type: "error",
          text: "Tienes que iniciar sesión para añadir productos al carrito.",
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_destacados.scss";
</style>