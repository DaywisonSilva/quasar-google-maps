<template>
  <q-select
    v-model="state.place"
    use-input
    option-label="description"
    label="Standard"
    :loading="state.loading"
    :options="state.options"
    @filter="filterPlaces"
    @update:model-value="
      () => getPlaceDetailsFromGoogleAPI(state.place?.place_id!)
    "
    style="max-width: 300px"
  />
  <div ref="mapRef" class="map"></div>
</template>
<script lang="ts">
import { reactive, defineComponent, onMounted, ref } from 'vue';

type State = {
  place: google.maps.places.QueryAutocompletePrediction | null;
  options: google.maps.places.QueryAutocompletePrediction[];
  loading: boolean;
};

export default defineComponent({
  setup() {
    const mapRef = ref();
    const state = reactive<State>({ place: null, options: [], loading: false });

    let map: google.maps.Map;

    onMounted(() => {
      // const directionsService = new google.maps.DirectionsService();
      // const directionsRenderer = new google.maps.DirectionsRenderer();
      map = new google.maps.Map(mapRef.value as HTMLElement, {
        zoom: 7,
        center: { lat: -9, lng: 310 },
      });

      // directionsRenderer.setMap(map);

      // const onChangeHandler = function () {
      //   calculateAndDisplayRoute(directionsService, directionsRenderer);
      // };

      // (document.getElementById('start') as HTMLElement).addEventListener(
      //   'change',
      //   onChangeHandler
      // );
      // (document.getElementById('end') as HTMLElement).addEventListener(
      //   'change',
      //   onChangeHandler
      // );
    });

    // function calculateAndDisplayRoute(
    //   directionsService: google.maps.DirectionsService,
    //   directionsRenderer: google.maps.DirectionsRenderer
    // ) {
    //   directionsService
    //     .route({
    //       origin: {
    //         query: (document.getElementById('start') as HTMLInputElement).value,
    //       },
    //       destination: {
    //         query: (document.getElementById('end') as HTMLInputElement).value,
    //       },
    //       travelMode: google.maps.TravelMode.DRIVING,
    //     })
    //     .then((response) => {
    //       directionsRenderer.setDirections(response);
    //     })
    //     .catch((e) =>
    //       window.alert('Directions request failed due to ' + status)
    //     );
    // }

    const filterPlaces = (place: string, update: (fn: () => void) => void) => {
      state.loading = true;
      update(() => {
        getPlacesFromGoogleAPI(place);
      });
    };

    const getPlacesFromGoogleAPI = (place: string) => {
      const displaySuggestions = function (
        predictions: google.maps.places.QueryAutocompletePrediction[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) {
        if (
          status != google.maps.places.PlacesServiceStatus.OK ||
          !predictions
        ) {
          // TODO Replace for QNotify here
          alert(status);
          return;
        } else {
          state.options = predictions;
        }

        state.loading = false;
      };

      const autocompleteService = new google.maps.places.AutocompleteService();

      if (place)
        autocompleteService.getQueryPredictions(
          { input: place },
          displaySuggestions
        );
    };

    const getPlaceDetailsFromGoogleAPI = (placeId: string) => {
      const placesService = new google.maps.places.PlacesService(map);

      placesService.getDetails({ placeId }, (place, status) => {
        console.log(place);
      });
    };

    return { state, mapRef, filterPlaces, getPlaceDetailsFromGoogleAPI };
  },
});
</script>

<style scoped>
.map {
  width: 100%;
  height: 300px;
}
</style>
