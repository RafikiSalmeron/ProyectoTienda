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
// Se importan las dependencias
import CubeSpin from "../../node_modules/vue-loading-spinner/src/components/Circle";

export default {
  name: "Novedades",
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
      cesta: null,
      hay: false,
    };
  },
  props: {
    novedades: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
};
</script>

<style scoped lang="scss">
@import "../scss/component/_novedades.scss";
</style>