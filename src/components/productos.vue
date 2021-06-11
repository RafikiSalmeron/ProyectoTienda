<template>
  <div id="productos-main-container">
    <!-- Buscador y botón de filtro  -->
    <div id="searcher" class="input-group d-flex justify-content-center">
      <div class="btn-group col-10 d-flex align-items-center">
        <input
          type="text"
          class="form-control"
          name=""
          id="searchInput"
          v-model="filterSearch"
          aria-describedby="helpId"
          placeholder="Buscar..."
        />
      </div>
    </div>
    <h2 v-if="productosFilter == 0 && !exist">
      No se ha encontrado el producto a buscar
    </h2>
    <h2 v-else>Productos</h2>
    <cube-spin v-if="productosFilter == 0 && exist"></cube-spin>
    <div class="productos-container">
      <div
        class="produc-card"
        v-for="producto in productosFilter"
        v-bind:key="producto.id"
        v-cloak
      >
        <router-link v-bind:to="`/productDetail/${producto.id}`">
          <img :src="producto.img" alt="Producto Novedad" />
        </router-link>
        <p class="bold">{{ producto.Nombre }}</p>
        <p class="descripcion">{{ producto.descripcion }}</p>
        <p class="bold precio">{{ producto.Precio }} €</p>
        <p class="stock">Stock : {{ producto.stock }}</p>
        <div class="btnContainer">
          <button
            class="btnAddChart"
            v-if="!admin"
            :disabled="stock(producto)"
            @click="addProduct(producto)"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Firebase from "../db";
import { db } from "../db";
import CubeSpin from "../../node_modules/vue-loading-spinner/src/components/Circle";

export default {
  components: {
    CubeSpin,
  },
  name: "Productos",
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
      filterSearch: "",
      exist: true,
    };
  },
  props: {
    productos: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  computed: {
    productosFilter: function () {
      // Si el input de búsqueda está vacío devuelve el array de suplementos
      if (this.filterSearch == "") {
        return this.productos;
        // Si no está vacío
      } else {
        // Devuelve el array aplicando el filtro
        var array = this.productos.filter((obj) => {
          if (
            obj.Nombre.toLowerCase().indexOf(this.filterSearch.toLowerCase()) >=
            0
          ) {
            return true;
          } else {
            return false;
          }
        });

        if (array.length == 0) {
          // NMO HAY
          this.setExist(false);
          return array;
        } else {
          this.setExist(true);
          return array;
        }
      }
    },
  },
  methods: {
    setExist(exist) {
      this.exist = exist;
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
          if (chart.email == this.email && chart.idProduct == producto.id) {
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
@import "../scss/component/_productos.scss";
</style>