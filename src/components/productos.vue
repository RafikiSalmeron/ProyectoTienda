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
        <button
          @click="clearFilter()"
          type="button"
          class="clearFilter btn btn-dark"
        >
          <i class="fa fa-times" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <h3 v-if="productosFilter == 0 && !exist">
      No se ha encontrado el producto a buscar
      <i class="fa fa-frown-o" aria-hidden="true"></i>
    </h3>
    <h2 v-else>Productos</h2>
    <cube-spin v-if="productosFilter == 0 && exist"></cube-spin>
    <div class="productos-container">
      <div
        class="produc-card"
        v-for="producto in productosFilter"
        v-bind:key="producto.id"
        v-cloak
      >
        <div>
          <router-link v-bind:to="`/productDetail/${producto.id}`">
            <img :src="producto.img" alt="Producto Novedad" />
          </router-link>
          <div>
            <p class="bold">{{ producto.Nombre }}</p>
          </div>
        </div>
        <div class="btnContainer">
          <p class="bold precio">{{ producto.Precio }} €</p>
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
  </div>
</template>

<script>
// Se importan las dependencias
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
  computed: {
    /**
     * Función que realiza la búsqueda
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     * @return {Array} Array con los productos a mostrar
     *
     */
    productosFilter: function () {
      // Si el input de búsqueda está vacío devuelve el array de suplementos
      if (this.filterSearch == "") {
        // Retorno todos los productos
        return this.productos;
        // Si no está vacío
      } else {
        // Devuelve el array aplicando el filtro
        var array = this.productos.filter((obj) => {
          // Compruebo si el nombre a buscar equivale a un producto
          if (
            obj.Nombre.toLowerCase().indexOf(this.filterSearch.toLowerCase()) >=
            0
          ) {
            // Retorno el producto para el array
            return true;
          } else {
            // Retorno false
            return false;
          }
        });
        // Compruebo el tamaño del array de productos a mostrar
        if (array.length == 0) {
          // Si no hay llamo a la función que establece si existe o no
          this.setExist(false);
          // Retorno el array vacío
          return array;
        } else {
          // Si no hay llamo a la función que establece si existe o no
          this.setExist(true);
          return array;
        }
      }
    },
  },
  methods: {
    /**
     * Función que limpia el filtro de búsqueda
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     *
     */
    clearFilter() {
      this.filterSearch = "";
    },
    /**
     * Función que establece si el prodcto existe en la búsqueda
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     *
     */
    setExist(exist) {
      this.exist = exist;
    },
    /**
     * Función que añade un producto al carrito
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
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
          // Añado el producto al carritop
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
@import "../scss/component/_productos.scss";
</style>