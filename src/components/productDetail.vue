<template>
  <div id="productDetail">
    <Header />
    <div v-if="loading">
      <cube-spin></cube-spin>
    </div>
    <div v-else class="div-container-pedido">
      <div class="pedido-product">
        <div class="img-container">
          <img :src="producto.img" alt="Producto" />
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
        v-if="!admin"
        :disabled="stock(producto)"
        @click="addProduct(producto)"
      >
        Añadir al carrito
      </button>
    </div>
    <Footer />
  </div>
</template>

<script>
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
    this.getProduct();
  },
  methods: {
    getProduct: function () {
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
          // Si no existe
        } else {
          this.$notify({
            title: "El producto no existe",
            type: "error",
            text: "No se ha podido encontrar el producto especificado.",
          });
          this.$router.push({ name: "home" });
        }
      });
    },
    stock(producto) {
      if (producto.stock > 0) {
        return false;
      }
      return true;
    },
    addProduct(producto) {
      if (this.user.loggedIn) {
        console.log(this.carrito);
        console.log(producto);
        for (var chart of this.carrito) {
          if (chart.email == this.email && chart.idProduct == this.id) {
            console.log("HAY");
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
            idProduct: this.id,
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
  computed: {
    authenticated() {
      return this.user.loggedIn;
    },
  },
  mounted: function () {
    this.email = localStorage.getItem("userEmail");
    if (this.email) {
      this.user.loggedIn = true;
      if (this.email == "admin@admin.com") {
        this.admin = true;
      }
    } else {
      this.user.loggedIn = false;
      this.user.data = {};
      this.admin = false;
    }
  },

  firestore: {
    carrito: db.collection("Carrito"),
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_productDetail.scss";
</style>
