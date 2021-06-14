<template>
  <div id="productDetail">
    <Header />
    <div v-if="loading">
      <cube-spin></cube-spin>
    </div>
    <div v-else class="div-container-producto">
      <div class="detalle-product">
        <div class="img-container">
          <img
            :src="producto.img"
            :title="producto.Nombre"
            :alt="producto.Nombre"
          />
        </div>
        <div class="descText-container">
          <div class="desc-container">
            <p class="pNombre">
              <strong>{{ producto.Nombre }}</strong>
            </p>
            <p class="pDescripcion" align="left">
              <strong>Descripción</strong>
            </p>
            <p class="descripcion" align="justify">
              {{ producto.descripcion }}
            </p>
          </div>
          <div class="text-container">
            <p align="left">
              <strong style="color: red" v-if="producto.stock == 0"
                >¡No hay stock disponible!</strong
              >
              <strong v-else>Stock: {{ producto.stock }}</strong>
            </p>
            <p class="precio">
              <strong>Precio: {{ producto.Precio }} €</strong>
            </p>
          </div>
        </div>
      </div>
      <button
        class="btnAddChart"
        v-if="!admin && producto.stock != 0"
        @click="addProduct(producto)"
      >
        Añadir al carrito
      </button>
    </div>
    <Footer />
  </div>
</template>

<script>
// Se importan las dependencias
import Header from "./header.vue";
import Footer from "./footer.vue";
import CubeSpin from "../../node_modules/vue-loading-spinner/src/components/Circle";

import { db } from "../db";

export default {
  name: "ProductDetail",
  components: {
    Header,
    CubeSpin,
    Footer,
  },
  data() {
    return {
      producto: {},
      user: {
        loggedIn: false,
        data: {},
      },
      email: "",
      id: "",
      loading: true,
      admin: false,
    };
  },
  created() {
    // Obtengo el producto detallado
    this.getProduct();
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
     * Función que obtiene el producto detallado sacando el ID de la url
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    getProduct() {
      // Se guarda en una variable la url de la página
      const url = document.URL.toString();
      // Se separa el string con el separador indicado ('/')
      this.id = url.split("/")[5];
      // Consulta base de datos
      const docRef = db.collection("Productos").doc(this.id);
      docRef.get().then((doc) => {
        // Si el documento en la base de datos existe
        if (doc.exists) {
          // Se guarda los datos del resultado de la consulta en una variable
          this.producto = doc.data();
          this.loading = false;
        } else {
          // Si no existe
          // Muestro mensaje de error
          this.$notify({
            title: "El producto no existe",
            type: "error",
            text: "No se ha podido encontrar el producto especificado.",
          });
          // Redirijo al inicio
          this.$router.push({ name: "home" });
        }
      });
    },
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
          if (chart.email == this.email && chart.idProduct == this.id) {
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
          // Añado el producto al carritop
          db.collection("Carrito").add({
            email: this.email,
            idProduct: this.id,
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
@import "../scss/component/_productDetail.scss";
</style>
