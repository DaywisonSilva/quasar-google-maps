<template>
  <div ref="mapRef" class="container"></div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import MapStyles from 'assets/data/gray.map.styles.json';

export default defineComponent({
  setup() {
    const mapRef = ref();

    onMounted(() => {
      const recursiveRenderMap = () => {
        if (google) {
          new google.maps.Map(mapRef.value as HTMLElement, {
            center: { lat: -9, lng: 310 },
            zoom: 5,
            styles: MapStyles,
          });
        } else {
          recursiveRenderMap();
        }
      };
      recursiveRenderMap();
    });

    return { mapRef };
  },
});
</script>

<style scoped>
.container {
  width: 100%;
  height: calc(100vh - 50px);
}
</style>
