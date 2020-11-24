<template>
  <div class="home">
    <yandex-map />
  </div>
</template>

<script>
import YandexMap from '@/components/yandex-map/yandex-map.vue';

export default {
  name: 'Home',
  components: {
    YandexMap,
  },
};
</script>

<style lang="scss" scoped>

.home {
  width: 100%;
  height: 100vh;
  background-color: #cccccc;
  margin: 0; padding: 0;
}
</style>
