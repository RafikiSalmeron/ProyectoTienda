<template>
  <footer>
    <div class="topFooter">
      <a target="_blank" href="mailto:elcorreoquequieres@correo.com">
        <i class="fa fa-envelope" aria-hidden="true"></i>
      </a>
      <a target="_blank" href="https://www.google.es/maps/preview">
        <i class="fa fa-map-marker" aria-hidden="true"></i>
      </a>
      <a target="_blank" href="https://www.facebook.com">
        <i class="fa fa-facebook" aria-hidden="true"></i>
      </a>
      <a target="_blank" href="https://www.twitter.com">
        <i class="fa fa-twitter" aria-hidden="true"></i>
      </a>
      <a target="_blank" href="https://www.instagram.com">
        <i class="fa fa-instagram" aria-hidden="true"></i>
      </a>
      <a target="_blank" href="https://www.youtube.com">
        <i class="fa fa-youtube-play" aria-hidden="true"></i>
      </a>
    </div>
    <div class="botFooter">
      <p class="footer-company-name">© Rafael Salmerón Martos</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  props: {},
};
</script>

<style scoped lang="scss">
  @import "../scss/component/_footer.scss";
</style>