<template>
  <div class="admin-container">
    <Header />
    <h3 v-if="!edit">Añadir producto</h3>
    <h3 v-else>Editar producto</h3>
    <!-- TABLA PARA AÑADIR/EDITAR PRODUCTOS -->
    <div id="divAñadir">
      <table class="añadir">
        <tr>
          <td colspan="2">
            <p style="display: none; color: red" id="adminError">Error</p>
          </td>
        </tr>
        <tr>
          <td>ID:</td>
          <td><input v-model="adminID" disabled /></td>
        </tr>

        <tr>
          <td>Nombre*:</td>
          <td><input v-model="adminNombre" id="inName" type="text" /></td>
        </tr>

        <tr>
          <td>Descripción:</td>
          <td><input v-model="adminDescripcion" id="inDes" type="text" /></td>
        </tr>

        <tr>
          <td>Imagen src:</td>
          <td><input v-model="adminImg" id="inImg" type="text" /></td>
        </tr>

        <tr>
          <td>Precio*:</td>
          <td>
            <input v-model="adminPrecio" id="inPrecio" type="number" min="0" />
          </td>
        </tr>

        <tr>
          <td>Stock:</td>
          <td>
            <input v-model="adminStock" type="number" id="inStock" min="0" />
          </td>
        </tr>
      </table>
      <div class="novedad">
        <label
          ><input type="checkbox" v-model="cbNovedad" id="checkNovedad" />
          ¿Quieres mostrar este producto como novedad?
        </label>
      </div>
      <div class="boton">
        <i
          v-if="edit"
          @click="confirmarEdit()"
          class="fa fa-check fa-2x"
          style="color: #198754"
          aria-hidden="true"
        >
          Editar</i
        >
        <i
          v-else
          @click="confirmarAdd()"
          class="fa fa-plus-square fa-2x"
          style="color: #198754"
          aria-hidden="true"
        >
          Añadir</i
        >
        <i
          v-if="edit"
          @click="cancelarEdit()"
          class="fa fa-times fa-2x"
          style="color: #198754"
          aria-hidden="true"
        >
          Cancelar</i
        >
      </div>
    </div>
    <!-- /TABLA PARA AÑADIR/EDITAR PRODUCTOS -->

    <!-- LOADER -->
    <cube-spin v-if="productos.length == 0"></cube-spin>
    <!-- /LOADER -->

    <!-- LISTA DE PRODCUCTOS -->
    <div v-else class="div-container-produc">
      <div
        class="admin-product"
        v-for="producto in productos"
        v-bind:key="producto.id"
      >
        <div class="img-container">
          <img :src="producto.img" alt="Producto" />
        </div>

        <div class="desc-container">
          <p>
            <strong>{{ producto.Nombre }}</strong>
          </p>
          <p>
            {{ producto.descripcion }}
          </p>
        </div>
        <div class="text-container">
          <p>
            <strong>Stock: {{ producto.stock }}</strong>
          </p>
          <p>
            <strong>Precio: {{ producto.Precio }} €</strong>
          </p>
          <button @click="editarCampos(producto)">Editar</button>
          <button @click="confirmarBorrar(producto)">Eliminar</button>
        </div>
      </div>
    </div>
    <!-- /LISTA DE PRODCUCTOS -->
    <Footer />
  </div>
</template>

<script>
// Se importan las dependencias
import { db } from "../db";
import Header from "./header.vue";
import Footer from "./footer.vue";
import CubeSpin from "../../node_modules/vue-loading-spinner/src/components/Circle";

export default {
  components: { Header, CubeSpin, Footer },
  name: "Test",
  props: {},
  data() {
    return {
      user: {
        loggedIn: true,
        data: {},
      },
      email: "",
      productos: [],
      carrito: [],
      adminID: "ID Automático",
      adminNombre: "",
      adminDescripcion: "",
      adminPrecio: 0,
      adminImg: "",
      cbNovedad: false,
      adminStock: 0,
      edit: false,
    };
  },
  // Obtengo los datos de la base de datos
  firestore: {
    productos: db.collection("Productos"),
    carrito: db.collection("Carrito"),
  },
  mounted: function () {
    // Se obtiene el email
    this.email = localStorage.getItem("userEmail");
    // Compruebo si he obtenido un email
    if (this.email) {
      // Compruebo si el email obtenido es el del administrador
      if (this.email != "admin@admin.com") {
        // Muestro mensaje de error
        this.$notify({
          title: "Inicio de Sesión",
          type: "error",
          text: "Tienes que ser administrador para acceder al administrador.",
        });
        // Redirijo al inicio
        this.$router.push({ name: "home" });
      }
    } else {
      // Muestro mensaje de error
      this.$notify({
        title: "Inicio de Sesión",
        type: "error",
        text: "Tienes que iniciar sesión para acceder al administrador.",
      });
      // Redirijo al inicio
      this.$router.push({ name: "home" });
    }
  },
  methods: {
    /**
     * Función que valida el nombre y el precio
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     * @return True si está todo correcto, False si algún campo no es válido
     */
    validate() {
      // Compruebo si el nombre esta vacío
      if (this.adminNombre == "") {
        // Cambio el borde de color y le aplico el texto al párrafo
        document.getElementById("inName").style.borderColor = "red";
        document.getElementById("adminError").style.display = "block";
        document.getElementById("adminError").innerText =
          "El nombre no puede estar vacío.";
        // Retorno false
        return false;
      }
      // Compruebo si el precio es menor o igual a 0
      if (this.adminPrecio <= 0) {
        // Cambio el borde de color y le aplico el texto al párrafo
        document.getElementById("inPrecio").style.borderColor = "red";
        document.getElementById("adminError").style.display = "block";
        document.getElementById("adminError").innerText =
          "Tienes que asignarle un precio al producto.";
        // Retorno false
        return false;
      }
      // Retorno true
      return true;
    },
    /**
     * Función que valida la imagen
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     * @param {String} image_url La URL de la imagen a mostrar
     *
     * @return True si está todo correcto, False si la imagen no es válida
     */
    imageExists(image_url) {
      // Compruebo si no he obtenido una ruta
      if (image_url == "") {
        // Retorno false
        return false;
      }
      // Creo la petición
      var http = new XMLHttpRequest();
      http.open("HEAD", image_url, false);
      // Envío la petición
      try {
        http.send();
      } catch (error) {
        // Retorno false si he obtenido algún error
        return false;
      }
      // Retorno el resultado de la petición (true/false)
      return http.status != 404;
    },
    /**
     * Función que devuelve si un producto puede ser novedad o no
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     * @param {Boolean} action True si estoy editando un producto y False si estoy añadiendo uno nuevo
     *
     * @return True si el producto puede ser novedad y False si el producto no puede serlo (porque ya hay 3 marcados como novedad)
     */
    checkNovedad(action) {
      // Compruebo si está marcado el checkbox de novedad
      if (this.cbNovedad) {
        // Inicializo un contador
        let count = 0;
        // Recorro todos los productos
        for (let pr of this.productos) {
          // Compruebo si estoy editando el producto
          if (action) {
            // Compruebo si el id del producto es distinto al producto que se está editando y a su vez es novedad
            if (pr.id != this.adminID && pr.novedad) {
              // Sumo 1 al contador
              count = count + 1;
            }
          }
          // Si no estoy editando compruebo sólo si el producto es novedad
          else if (pr.novedad) {
            // Sumo 1 al contador
            count = count + 1;
          }
        }
        // Compruebo si el contador supera o iguala el máximo de novedades (3)
        if (count >= 3) {
          // Retorno false
          return false;
        }
        // Retorno true
        return true;
      }
      // Retorno true
      return true;
    },
    /**
     * Función que coloca en los inputs los valores del producto
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     * @param {Object} product El producto a editar
     *
     */
    editarCampos(product) {
      // Desplazo el scroll hacia arriba
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      // Establezco en los inputs los valores del producto a editar
      this.edit = true;
      this.adminID = product.id;
      this.adminNombre = product.Nombre;
      this.adminDescripcion = product.descripcion;
      this.adminPrecio = product.Precio;
      this.adminImg = product.img;
      this.adminStock = product.stock;
      this.cbNovedad = product.novedad;
    },
    /**
     * Función que muestra un dialog para confirmar si quiero editar el producto
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     */
    confirmarEdit() {
      // Muestro el dialog
      this.$confirm({
        message: `¿Estás seguro que deseas editar el producto?`,
        button: {
          no: "No",
          yes: "Sí",
        },
        /**
         * Callback Function
         * @param {Boolean} confirm El resultado del dialog
         */
        callback: (confirm) => {
          // Compruebo si ha aceptado o no
          if (confirm) {
            // Llamo a la función que edita el producto
            this.editarProducto();
          } else {
            // Corto la ejecución
            return;
          }
        },
      });
    },
    /**
     * Función que edita el producto
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     */
    editarProducto() {
      // Establezco todos los bordes de los inputs de color negro
      this.borderBlack();
      // Compruebo si el nombre y el precio son válidos
      if (!this.validate()) {
        // Muestro mensaje de error
        this.$notify({
          title: "Error al validar",
          type: "error",
          text: "Ha ocurrido un error al validar las características del producto. Comprueba los campos",
        });
        // Corto la ejecución
        return;
      }
      // Compruebo si puedo establecerlo como novedad en caso de que se haya marcado el checkbox
      if (!this.checkNovedad(true)) {
        // Muestro mensaje de error
        this.$notify({
          title: "Error novedades",
          type: "error",
          text: "No se pueden mostrar más de 3 productos como novedad.",
        });
        // Corto la ejecución
        return;
      }
      // Compruebo si la imagen introducida es válida
      if (!this.imageExists(this.adminImg)) {
        // Establezco una imagen por defecto en caso de que no sea válida
        this.adminImg = "https://i.imgur.com/1LH7119.png";
      }
      // Recorro todos los carritos
      for (let itemCarro of this.carrito) {
        // Compruebo si el producto a editar está en algún carrito
        if (itemCarro.idProduct == this.adminID) {
          // Actualizo el producto en todos los carritos en los que esté
          db.collection("Carrito")
            .doc(itemCarro.id)
            .update({
              precioTotal:
                parseInt(itemCarro.cantidad) * parseFloat(this.adminPrecio),
              producto: {
                Nombre: this.adminNombre,
                Precio: parseFloat(this.adminPrecio),
                descripcion: this.adminDescripcion,
                img: this.adminImg,
                stock: parseInt(this.adminStock),
                novedad: this.cbNovedad,
              },
            });
        }
      }
      // Actualizo el producto en la base de datos
      db.collection("Productos")
        .doc(this.adminID)
        .update({
          Nombre: this.adminNombre,
          Precio: parseFloat(this.adminPrecio),
          descripcion: this.adminDescripcion,
          img: this.adminImg,
          stock: parseInt(this.adminStock),
          novedad: this.cbNovedad,
        });

      // Limpio los inputs y mensaje de error
      this.cancelarEdit();

      // Muestro mensaje de información
      this.$notify({
        title: "Producto editado",
        type: "success",
        text: "El producto se ha editado.",
      });
    },

    /**
     * Función que muestra un dialog para confirmar si quiero eliminar el producto
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     * @param {Object} product El producto a eliminar
     *
     */
    confirmarBorrar(product) {
      // Muestro el dialog
      this.$confirm({
        message: `¿Estás seguro que deseas eliminar el producto?`,
        button: {
          no: "No",
          yes: "Sí",
        },
        /**
         * Callback Function
         * @param {Boolean} confirm El resultado del dialog
         */
        callback: (confirm) => {
          // Compruebo si ha aceptado o no
          if (confirm) {
            // Llamo a la función que elimina el producto
            this.borrarProducto(product);
          } else {
            // Corto la ejecución
            return;
          }
        },
      });
    },
    /**
     * Función que elimina el producto
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     * @param {Object} product El producto a eliminar
     *
     */
    borrarProducto(product) {
      // Recorro todos los carritos
      for (let itemCarro of this.carrito) {
        // Compruebo si el producto a eliminar está en algún carrito
        if (itemCarro.idProduct == product.id) {
          // Elimino el producto del carrito
          db.collection("Carrito").doc(itemCarro.id).delete();
        }
      }
      // Elimino el producto de la base de datos
      db.collection("Productos").doc(product.id).delete();

      // Limpio los inputs y mensaje de error
      this.cancelarEdit();

      // Muestro mensaje de información
      this.$notify({
        title: "Producto eliminado",
        type: "success",
        text: "El producto se ha eliminado.",
      });
    },
    /**
     * Función que limpia todos los inputs y mensajes de error
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     */
    cancelarEdit() {
      // Limpio los inputs y los pongo por defecto
      this.edit = false;
      this.adminID = "ID Automático";
      this.adminNombre = "";
      this.adminDescripcion = "";
      this.adminPrecio = 0;
      this.adminImg = "";
      this.adminStock = 0;
      this.cbNovedad = false;
      // Llamo a la función que establece los bordes negros a los inputs
      this.borderBlack();
      // Escondo el mensaje de error
      document.getElementById("adminError").style.display = "none";
    },
    /**
     * Función que establece los bordes negros a los inputs
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     */
    borderBlack() {
      // Establezco los bordes negros a los inputs
      document.getElementById("inPrecio").style.borderColor = "black";
      document.getElementById("inName").style.borderColor = "black";
      document.getElementById("inImg").style.borderColor = "black";
      document.getElementById("inDes").style.borderColor = "black";
      document.getElementById("inStock").style.borderColor = "black";
    },
    /**
     * Función que muestra un dialog para confirmar si quiero añadir un producto
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     */
    confirmarAdd() {
      // Muestro el dialog
      this.$confirm({
        message: `¿Estás seguro que deseas añadir un nuevo producto?`,
        button: {
          no: "No",
          yes: "Sí",
        },
        /**
         * Callback Function
         * @param {Boolean} confirm El resultado del dialog
         */
        callback: (confirm) => {
          // Compruebo si ha aceptado o no
          if (confirm) {
            // Llamo a la función que añade el producto
            this.addProduct();
          } else {
            // Corto la ejecución
            return;
          }
        },
      });
    },
    /**
     * Función añade un producto
     *
     * @author Rafa Salmeron <rafikisalmeronmartos@gmail.com>
     *
     */
    addProduct() {
      // Establezco todos los bordes de los inputs de color negro
      this.borderBlack();
      // Compruebo si el nombre y el precio son válidos
      if (!this.validate()) {
        // Muestro mensaje de error
        this.$notify({
          title: "Error al validar",
          type: "error",
          text: "Ha ocurrido un error al validar las características del producto. Comprueba los campos",
        });
        // Corto la ejecución
        return;
      }
      // Compruebo si el producto puede establecerse como novedad en caso de que este marcado el checkbox
      if (!this.checkNovedad(false)) {
        // Muestro mensaje de error
        this.$notify({
          title: "Error novedades",
          type: "error",
          text: "No se pueden mostrar más de 3 productos como novedad.",
        });
        // Corto la ejecución
        return;
      }
      // Compruebo si la imagen introducida es válida
      if (!this.imageExists(this.adminImg)) {
        // Establezco una imagen por defecto en caso de que no sea válida
        this.adminImg = "https://i.imgur.com/1LH7119.png";
      }
      // Añado el producto a la base de datos
      db.collection("Productos").add({
        Nombre: this.adminNombre,
        Precio: parseFloat(this.adminPrecio),
        descripcion: this.adminDescripcion,
        img: this.adminImg,
        stock: parseInt(this.adminStock),
        vecesVendido: 0,
        novedad: this.cbNovedad,
      });
      // Muestro mensaje de información
      this.$notify({
        title: "Producto añadido",
        type: "success",
        text: "El producto se ha añadido.",
      });
      // Limpio todos los inputs y mensajes de error
      this.cancelarEdit();
    },
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_admin.scss";
</style>