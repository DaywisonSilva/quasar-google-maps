<template>
  <div class="containter row">
    <div ref="mapRef" class="map col-12 col-md-6"></div>
    <div ref="panoRef" class="pano col-12 col-md-6"></div>
  </div>
</template>
<script lang="ts">
import { reactive, defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
  setup() {
    const state = reactive({});
    const mapRef = ref();
    const panoRef = ref();

    onMounted(() => {
      const fenway = { lat: -1.44, lng: 311.53 };
      const recursiveRenderMap = () => {
        if (google) {
          const map = new google.maps.Map(mapRef.value as HTMLElement, {
            center: fenway,
            zoom: 14,
          });

          const panorama = new google.maps.StreetViewPanorama(
            panoRef.value as HTMLElement,
            {
              position: fenway,
              pov: {
                heading: 34,
                pitch: 10,
              },
            }
          );

          map.setStreetView(panorama);
        } else {
          recursiveRenderMap();
        }
      };
      recursiveRenderMap();
    });

    return { state, mapRef, panoRef };
  },
});
</script>

<style scoped>
.containter {
  height: calc(100vh - 50px);
}

.map,
.pano {
  height: 50%;
}

@media screen and (min-width: 1024px) {
  .map,
  .pano {
    height: 100%;
  }
}
</style>
