<template>
  <div id="profile">
    <Header />
    <h3 class="py-5 m-0" style="color: black">
      <i class="fa fa-bookmark" aria-hidden="true"></i> Historial de compras de
      {{ getnombre }}
    </h3>
    <GChart
      id="grafica"
      :settings="{ packages: ['corechart', 'table', 'map'] }"
      type="PieChart"
      :data="implementarGrafica"
      :options="chartOptions"
      v-if="admin"
    />
    <h2 v-if="pedidos.length == 0 && !exist">NO HAY PEDIDOS</h2>
    <div class="div-container-pedido">
      <cube-spin v-if="pedidos.length == 0 && exist"></cube-spin>
      <div
        v-else
        class="pedidos-product"
        v-for="object in pedidos"
        v-bind:key="object.id"
      >
        <div class="visual-container-main">
          <div v-if="admin">{{ object.email }}</div>
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
        </div>
        <div :id="object.id" class="pedidosMostrar">
          <div
            class="pedido-product"
            v-for="pedido in object.pedido"
            v-bind:key="pedido.id"
          >
            <div class="img-container">
              <img
                :src="pedido.producto.img"
                :title="pedido.producto.Nombre"
                :alt="pedido.producto.Nombre"
              />
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
                <strong>Precio Total: {{ pedido.precioTotal }} €</strong>
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
import { GChart } from "vue-google-charts";

import { db } from "../db";

export default {
  name: "Profile",

  components: {
    Header,
    CubeSpin,
    GChart,
    Footer,
  },
  data() {
    return {
      pedidos: [],
      prodDestacados: [],
      user: {
        loggedIn: false,
        data: {},
      },
      email: "",
      exist: true,
      admin: false,
      chartData: [],
      // Estilo y opciones de la gráfica
      chartOptions: {
        title: "Gráfica de ventas",
        chartArea: {
          width: 500,
        },
        pieSliceText: "none",
        is3D: true,
      },
    };
  },
  mounted: function () {
    // Se obtiene el email
    this.email = localStorage.getItem("userEmail");
    // Compruebo si he obtenido un email
    if (this.email) {
      // Establezco el usuario en logeado
      this.user.loggedIn = true;
      // Establezco la variable encargada del loader a true
      this.exist = true;
      // Obtengo los pedidos
      this.getPedidos();
    } else {
      // Establezco el usuario en logeado
      this.user.loggedIn = false;
      // Borro los datos del usuario
      this.user.data = {};
      // Muestro mensaje de error
      this.$notify({
        title: "Inicio de Sesión",
        type: "error",
        text: "Tienes que iniciar sesión para acceder a tu perfil.",
      });
      // Vacío el carrito de los pedidos
      this.$bind("pedidos", db.collection("Pedidos").where("email", "==", ""));
      // Redirijo al inicio
      this.$router.push({ name: "home" });
    }
  },
  // Obtengo los datos de la base de datos
  firestore: {
    pedidos: db
      .collection("Pedidos")
      .where("email", "==", Firebase.auth.currentUser ? this.email : ""),
    prodDestacados: db
      .collection("Productos")
      .orderBy("vecesVendido", "desc")
      .limit(7),
  },
  computed: {
    /**
     * Función que devuelve el nombre de usuario quitando la parte del dominio del email
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @return {String} Nombre del usuario
     */
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
    /**
     * Función que devuelve el array encargado de mostrar los valores en la gráfica
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @return {Array} Array con los valores que se mostrarán en la gráfica
     */
    implementarGrafica: function () {
      // Array iniciado con las columnas principales
      let valores = [
        ["Producto", "Veces vendido", { type: "string", role: "tooltip" }],
      ];
      // Recorro los productos destacados
      for (let item of this.prodDestacados) {
        valores.push([
          item.Nombre,
          item.vecesVendido,
          item.vecesVendido + " veces vendido",
        ]);
      }
      // Retorno los valores en forma de Array
      return valores;
    },
  },
  methods: {
    /**
     * Función que obtiene los pedidos realizados
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    getPedidos() {
      // Compruebo si el usuario logeado es el administrador
      if (this.email == "admin@admin.com") {
        // Establezco el usuario como administrador
        this.admin = true;
        // Linkeo el array pedidos con la colección de pedidos
        this.$bind(
          "pedidos",
          db.collection("Pedidos").orderBy("fecha", "desc")
        );
      } else {
        // Linkeo el array pedidos con la colección de pedidos del usuario logeado
        this.$bind(
          "pedidos",
          db
            .collection("Pedidos")
            .where("email", "==", this.email)
            .orderBy("fecha", "desc")
        );
      }
      // Espero a que carguen los pedidos
      setTimeout(() => {
        // Compruebo si hay pedidos
        if (this.pedidos.length == 0) {
          // Establezco la variable encargada del loader en falso
          this.exist = false;
        }
      }, 1000);
    },
    /**
     * Función que despliega un pedido seleccionado
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @param {String} idDiv La ID del elemento <div>
     *
     */
    displayPedido(idDiv) {
      // Obtengo el div en el que se ha clickado
      var div = document.getElementById(idDiv);
      // Compruebo si el div está ya desplegado
      if (div.style.display == "none" || div.style.display == "") {
        // Le cambio el icono de la flecha al div
        document
          .getElementById("flecha" + idDiv)
          .classList.replace("fa-arrow-down", "fa-arrow-up");
        // Despliego el div
        div.style.display = "flex";
      } else {
        // Escondo el div
        div.style.display = "none";
        // Le cambio el icono de la flecha al div
        document
          .getElementById("flecha" + idDiv)
          .classList.replace("fa-arrow-up", "fa-arrow-down");
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_profile.scss";
</style>
