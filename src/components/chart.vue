<template>
  <section id="chart">
    <Header />
    <div class="container">
      <h2>Cesta</h2>
      <h5>({{ cantidad }}) Artículo/s en tu cesta</h5>
      <table>
        <thead>
          <th>Artículo</th>
          <th>Precio</th>
          <th>Cantidad</th>
        </thead>
        <tr v-for="chart in carrito" v-bind:key="chart.id">
          <td class="exTD">
            <img :src="chart.producto.img" class="img-article" alt="Producto" />
          </td>
          <td class="midTD">
            <div class="info">
              <div class="producto">{{ chart.producto.Nombre }}</div>
              <div class="infoProduc">{{ chart.producto.descripcion }}</div>
              <div class="stock">¡Stock disponible!</div>
              <button class="eliminar" @click="removeProduct(chart.id)">
                Eliminar artículo
              </button>
            </div>
          </td>
          <td class="exTD">
            <input
              type="number"
              class="step"
              :id="chart.id"
              @change="cambiarUnidades"
              :value="chart.cantidad"
              min="1"
              :max="chart.producto.stock"
            />
            <p class="precio">{{ chart.producto.Precio }} €</p>
          </td>
        </tr>
      </table>
      <hr />

      <div id="botonCesta">
        <div id="subtotal">
          Subtotal({{ cantidad }} producto/s): {{ total }}
        </div>

        <div id="realizar">
          <button class="btnRealizar" @click="realizarPedido()">
            Realizar pedido
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </section>
</template>

<script>
import Firebase from "../db";
import { db } from "../db";
import Header from "./header.vue";
import Footer from "./footer.vue";

export default {
  components: { Header, Footer },
  name: "Chart",
  props: {},
  data() {
    return {
      user: {
        loggedIn: true,
        data: {},
      },
      email: null,
      carrito: [],
    };
  },
  computed: {
    total: function () {
      let pTotal = 0;
      for (var item of this.carrito) {
        pTotal += item.precioTotal;
      }
      return pTotal.toFixed(2) + " €";
    },
    cantidad: function () {
      let cTotal = 0;
      for (var item of this.carrito) {
        cTotal += parseFloat(item.cantidad);
      }
      return cTotal;
    },
  },
  methods: {
    realizarPedido() {
      for (var item of this.carrito) {
        console.log(item);
        console.log(item.producto);
        db.collection("Productos")
          .doc(item.idProduct)
          .update({
            stock: item.producto.stock - item.cantidad,
            vecesVendido: item.producto.vecesVendido + item.cantidad,
          });
        db.collection("Carrito").doc(item.id).delete();
      }
      // Fecha actual
      const fecha = new Date();
      // Formateamos la fecha
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const fechaFormated = fecha.toLocaleDateString("es-ES", options);
      db.collection("Pedidos").add({
        email: this.email,
        total: this.total,
        fecha: fechaFormated,
        pedido: this.carrito,
      });
      this.$notify({
        title: "Pedido realizado",
        type: "success",
        text: "El pedido se ha realizado correctamente.",
      });
      this.$router.push({ name: "home" });
    },
    removeProduct(id) {
      db.collection("Carrito").doc(id).delete();
    },
    cambiarUnidades: function (e) {
      let articulo;
      db.collection("Carrito")
        .doc(e.target.id)
        .get()
        .then((snapshot) => {
          articulo = snapshot.data();
          console.log(articulo.producto.Precio);
          // do something with document
          db.collection("Carrito")
            .doc(e.target.id)
            .update({
              cantidad: e.target.value,
              precioTotal: articulo.producto.Precio.toFixed(2) * e.target.value,
            });
        });
    },
  },

  firestore: {
    carrito: db
      .collection("Carrito")
      .where("email", "==", Firebase.auth.currentUser ? this.email : ""),
  },
  mounted: function () {
    this.email = localStorage.getItem("userEmail");
    if (this.email) {
      this.user.loggedIn = true;
      this.$bind(
        "carrito",
        db.collection("Carrito").where("email", "==", this.email)
      );
      console.log(true);
    } else {
      this.user.loggedIn = false;
      this.$notify({
        title: "Inicio de Sesión",
        type: "error",
        text: "Tienes que iniciar sesión para acceder al carrito.",
      });
      this.$router.push({ name: "home" });
      this.$bind("carrito", db.collection("Carrito").where("email", "==", ""));
      console.log(false);
    }
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_chart.scss";
</style>