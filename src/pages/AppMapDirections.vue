<template>
  <div class="container">
    <q-form
      @submit="onSubmit"
      class="container__inputs row content-start items-start absolute-right full-width q-col-gutter-sm q-pr-sm q-pt-sm"
    >
      <div class="col col-12 col-md-4">
        <q-select
          filled
          v-model="state.origin"
          bg-color="white"
          use-input
          option-label="description"
          label="Origem"
          :loading="state.loadingOrigin"
          :options="state.options"
          ref="originRef"
          @input-value="(val) => filterPlaces(val, originRef, 'origin')"
        />
      </div>
      <div class="col col-12 col-md-4">
        <q-select
          filled
          v-model="state.destiny"
          ref="destinyRef"
          bg-color="white"
          use-input
          option-label="description"
          label="Destino"
          @input-value="(val) => filterPlaces(val, destinyRef, 'destiny')"
          :loading="state.loadingDestiny"
          :options="state.options"
        />
      </div>
      <div class="col col-12 col-md-4">
        <q-btn
          size="lg"
          color="primary"
          class="full-width full-height"
          no-caps
          label="Confirmar"
          type="submit"
        />
      </div>
    </q-form>
    <div ref="mapRef" class="map"></div>
  </div>
</template>
<script lang="ts">
import { reactive, defineComponent, onMounted, ref, UnwrapRef } from 'vue';
import { getPlacesFromGoogleAPI } from 'src/services/google_maps';
import { useQuasar } from 'quasar';
import lodash from 'lodash';

type State = {
  place: google.maps.places.QueryAutocompletePrediction | null;
  options: google.maps.places.QueryAutocompletePrediction[];
  origin: google.maps.places.QueryAutocompletePrediction | null;
  destiny: google.maps.places.QueryAutocompletePrediction | null;
  loadingOrigin: boolean;
  loadingDestiny: boolean;
};

export default defineComponent({
  setup() {
    const mapRef = ref();
    const $q = useQuasar();
    const destinyRef = ref();
    const originRef = ref();
    const directionsServiceRef = ref<google.maps.DirectionsService>();
    const directionsRendererRef = ref<google.maps.DirectionsRenderer>();
    const state = reactive<State>({
      place: null,
      options: [],
      origin: null,
      destiny: null,
      loadingOrigin: false,
      loadingDestiny: false,
    });

    let map: google.maps.Map;

    onMounted(() => {
      const recursiveRenderMap = () => {
        if (google) {
          directionsServiceRef.value = new google.maps.DirectionsService();
          directionsRendererRef.value = new google.maps.DirectionsRenderer();
          map = new google.maps.Map(mapRef.value as HTMLElement, {
            zoom: 7,
            fullscreenControl: false,
            center: { lat: -9, lng: 310 },
          });

          directionsRendererRef.value.setMap(map);
        } else {
          setTimeout(() => {
            recursiveRenderMap();
          }, 1000);
        }
      };
      recursiveRenderMap();
    });

    function calculateAndDisplayRoute(
      directionsService: google.maps.DirectionsService,
      directionsRenderer: google.maps.DirectionsRenderer
    ) {
      directionsService
        .route({
          origin: {
            query: state.origin?.description,
          },
          destination: {
            query: state.destiny?.description,
          },
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((response) => {
          directionsRenderer.setDirections(response);
        })
        .catch(() =>
          $q.notify({
            type: 'negative',
            message: 'Nenhuma rota foi encontrada',
            position: 'top',
          })
        );
    }

    const toggleLoading = {
      origin: () => {
        state.loadingOrigin = !state.loadingOrigin;
      },
      destiny: () => {
        state.loadingDestiny = !state.loadingDestiny;
      },
    };

    const filterPlaces = (
      place: string,
      selectRef: UnwrapRef<{ showPopup: () => void }>,
      target: 'origin' | 'destiny'
    ) => {
      if (!!place.length) {
        toggleLoading[target]();
        const debouncedGetPlaces = lodash.debounce(getPlaces, 500);
        debouncedGetPlaces(place, selectRef, target);
      }
    };

    const getPlaces = async (
      place: string,
      selectRef: UnwrapRef<{ showPopup: () => void }>,
      target: 'origin' | 'destiny'
    ) => {
      try {
        const data = await getPlacesFromGoogleAPI(place);
        state.options = data.predictions;
        setTimeout(() => {
          selectRef.showPopup();
        }, 0);
      } catch (e) {
        console.error(e);
        $q.notify({
          type: 'negative',
          message: 'Não foi possível fazer a busca do lugar',
          position: 'top',
        });
      } finally {
        toggleLoading[target]();
      }
    };

    const onSubmit = async () => {
      if (state.destiny?.description && state.origin?.description) {
        calculateAndDisplayRoute(
          directionsServiceRef.value!,
          directionsRendererRef.value!
        );
      }
    };

    return {
      state,
      mapRef,
      originRef,
      destinyRef,
      filterPlaces,
      onSubmit,
    };
  },
});
</script>

<style scoped>
.container {
  width: 100%;
  height: calc(100vh - 50px);
  position: relative;
}

.container__inputs {
  z-index: 1;
  height: fit-content;
}
.map {
  width: 100%;
  height: 100%;
}
</style>
