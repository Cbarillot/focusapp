<template>
  <div class="animated-bg"></div>
</template>

<style scoped>
.animated-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  animation: gradientMove 10s ease-in-out infinite alternate;
}
@keyframes gradientMove {
  0% { filter: hue-rotate(0deg);}
  100% { filter: hue-rotate(90deg);}
}
</style>