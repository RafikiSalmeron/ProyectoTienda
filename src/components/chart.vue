<template>
  <section id="chart">
    <Header />
    <div class="container">
      <h2>Cesta</h2>
      <h5>({{ cantidad }}) Artículo/s en tu cesta</h5>
      <div
        class="pedido-product"
        v-for="chart in carrito"
        v-bind:key="chart.id"
      >
        <div class="pedido-container">
          <div class="img-container">
            <p style="font-size: 1.2rem"><strong>Artículo</strong></p>
            <img
              :src="chart.producto.img"
              class="img-article"
              :title="chart.producto.Nombre"
              :alt="chart.producto.Nombre"
            />
          </div>
          <div class="desc-container">
            <p>
              <strong>{{ chart.producto.Nombre }}</strong>
            </p>
            <p>
              {{ chart.producto.descripcion }}
            </p>
          </div>
          <div class="text-container">
            <p v-if="chart.producto.stock > 0"><strong>Cantidad</strong></p>
            <input
              v-if="chart.producto.stock > 0"
              type="number"
              class="step"
              :id="chart.id"
              @change="cambiarUnidades"
              :value="chart.cantidad"
              min="0"
              :max="chart.producto.stock"
            />
            <input
              v-else
              type="number"
              style="display: none"
              class="step"
              :id="chart.id"
              @change="cambiarUnidades"
              :value="chart.cantidad"
              min="0"
              max="0"
            />
            <p v-if="chart.producto.stock <= 0"><strong>Precio</strong></p>
            <p class="precio">{{ chart.producto.Precio }} €</p>
          </div>
        </div>
        <div>
          <div v-if="chart.producto.stock > 0" class="stock">
            ¡Stock disponible!
          </div>
          <div v-else class="noStock">Stock no disponible</div>
          <button class="eliminar" @click="removeProduct(chart.id)">
            Eliminar artículo
          </button>
        </div>
        <hr />
      </div>
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
// Se importan las dependencias
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
      carro: [],
    };
  },
  mounted: function () {
    // Se obtiene el email
    this.email = localStorage.getItem("userEmail");
    // Compruebo si he obtenido un email
    if (this.email) {
      // Establezco el usuario a logeado
      this.user.loggedIn = true;
      // Linkeo el array del carrito con el carrito del usuario logeado
      this.$bind(
        "carrito",
        db.collection("Carrito").where("email", "==", this.email)
      );
    } else {
      // Establezco el usuario a no logeado
      this.user.loggedIn = false;
      // Muestro mensaje de error
      this.$notify({
        title: "Inicio de Sesión",
        type: "error",
        text: "Tienes que iniciar sesión para acceder al carrito.",
      });
      // Redirijo al inicio
      this.$router.push({ name: "home" });
      // Linkeo el array del carrito con un carrito vacío
      this.$bind("carrito", db.collection("Carrito").where("email", "==", ""));
    }
  },
  // Obtengo los datos de la base de datos
  firestore: {
    carrito: db
      .collection("Carrito")
      .where("email", "==", Firebase.auth.currentUser ? this.email : ""),
    carro: db.collection("Carrito"),
  },
  computed: {
    /**
     * Función que devuelve el precio total del carrito
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @return {String} Precio total del carrito
     */
    total: function () {
      // Establezco la variable que contiene el precio total
      let pTotal = 0;
      // Recorro los productos del carrito
      for (var item of this.carrito) {
        // Incremento el precio total del carrito
        pTotal += item.precioTotal;
      }
      // Retorno el precio total del producto
      return pTotal.toFixed(2) + " €";
    },
    /**
     * Función que devuelve la cantidad total de productos en el carrito
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @return {Number} Cantidad total de productos en el carrito
     */
    cantidad: function () {
      // Establezco la variable que contiene la cantidad total de productos
      let cTotal = 0;
      // Recorro los productos del carrito
      for (var item of this.carrito) {
        // Incremento la cantidad total de productos
        cTotal += parseFloat(item.cantidad);
      }
      // Retorno la cantidad total de productos
      return cTotal;
    },
  },
  methods: {
    /**
     * Función que realiza el pedido
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     */
    realizarPedido() {
      // Compruebo que el carrito no esté vacío
      if (this.carrito.length == 0) {
        // Muestro mensaje de error
        this.$notify({
          title: "Error al realizar pedido",
          type: "error",
          duration: 6000,
          text: "No se ha podido realizar el pedido debido a que no hay nada en el carrito.",
        });
        // Corto la ejecución
        return;
      }
      // Recorro los productos del carrito
      for (var item of this.carrito) {
        // Compruebo si el stock o la cantidad es menor o igual a 0
        if (parseFloat(item.producto.stock) <= 0 || item.cantidad <= 0) {
          // Muestro mensaje de error
          this.$notify({
            title: "Error al realizar pedido",
            type: "error",
            duration: 6000,
            text: "No se ha podido realizar el pedido debido a una cantidad inválida. Comprueba la cantidad o si el stock está disponible.",
          });
          // Corto la ejecución
          return;
        }
        // Establezco el stock a true
        let stock = true;
        // Compruebo si el producto se va a quedar
        if (item.producto.stock - item.cantidad == 0) {
          // Establezco stock a false
          stock = false;
        }
        // Actualizo el stock de los productos al realizar el pedido
        db.collection("Productos")
          .doc(item.idProduct)
          .update({
            stock: item.producto.stock - item.cantidad,
            vecesVendido: item.producto.vecesVendido + item.cantidad,
          });

        // Compruebo si el stock se quedará en 0
        if (!stock) {
          // Recorro todos los carritos
          for (let itemCarro of this.carro) {
            // Linkeo el array del carrito con un carrito vacío
            this.$bind("carro", db.collection("Carrito"));
            // Compruebo si el producto está en otros carritos
            if (itemCarro.idProduct == item.idProduct) {
              // Borro el producto del carrito
              db.collection("Carrito")
                .doc(itemCarro.id)
                .update({
                  producto: {
                    Nombre: itemCarro.producto.Nombre,
                    Precio: itemCarro.producto.Precio,
                    descripcion: itemCarro.producto.descripcion,
                    img: itemCarro.producto.img,
                    stock: itemCarro.producto.stock - 1,
                    novedad: itemCarro.producto.novedad,
                    vecesVendido: itemCarro.producto.vecesVendido + 1,
                  },
                });
            }
          }
        }

        // Borro el producto del carrito
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
      // Formateo la fecha a español
      const fechaFormated = fecha.toLocaleDateString("es-ES", options);
      // Agrego el pedido a la base de datos
      db.collection("Pedidos").add({
        email: this.email,
        total: this.total,
        fecha: fechaFormated,
        pedido: this.carrito,
      });
      // Muestro mensaje de información
      this.$notify({
        title: "Pedido realizado",
        type: "success",
        text: "El pedido se ha realizado correctamente.",
      });
      // Redirijo al inicio
      this.$router.push({ name: "home" });
    },
    /**
     * Función que elimina un producto del carrito
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @param {String} id Identificador del producto a eliminar del carrito
     *
     */
    removeProduct(id) {
      // Elimino el producto del carrito
      db.collection("Carrito").doc(id).delete();
    },
    /**
     * Función que cambia la cantidad de un producto en el carrito
     *
     * @author Rafa Salmerón <rafikisalmeronmartos@gmail.com>
     *
     * @param {Event} e Evento al cambiar las unidades
     *
     */
    cambiarUnidades: function (e) {
      // Compruebo si la cantidad es menor o igual a 0
      if (e.target.value <= 0) {
        // Establezco el valor a 1
        e.target.value = 1;
      }
      // Creo una variable que contendrá el artículo
      let articulo;
      // Actualizo el valor del carrito en función a la cantidad
      db.collection("Carrito")
        .doc(e.target.id)
        .get()
        .then((snapshot) => {
          articulo = snapshot.data();
          db.collection("Carrito")
            .doc(e.target.id)
            .update({
              cantidad: e.target.value,
              precioTotal: articulo.producto.Precio.toFixed(2) * e.target.value,
            });
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_chart.scss";
</style>