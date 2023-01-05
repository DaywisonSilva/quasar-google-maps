<template>
  <div ref="mapRef" class="container"></div>
</template>
<script lang="ts">
import { reactive, defineComponent, onMounted, ref } from 'vue';
import MarkerImage from 'assets/images/quasar-maps-logo-marker.svg';
export default defineComponent({
  setup() {
    const state = reactive({});
    const mapRef = ref();

    onMounted(() => {
      const recursiveRenderMap = () => {
        if (google) {
          const coords = {
            lat: -1.4385750153286079,
            lng: -48.47846986045001,
          };

          const map = new google.maps.Map(mapRef.value as HTMLElement, {
            zoom: 18,
            center: {
              ...coords,
            },
          });

          new google.maps.Marker({
            position: { ...coords },
            map,
            icon: {
              url: MarkerImage,
              scale: 22,
            },
          });
        } else {
          setTimeout(() => {
            recursiveRenderMap();
          }, 1000);
        }
      };

      recursiveRenderMap();
    });

    return { state, mapRef };
  },
});
</script>

<style scoped>
.container {
  width: 100%;
  height: calc(100vh - 50px);
}
</style>
