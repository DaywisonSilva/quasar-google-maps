type Place = google.maps.places.PlaceResult | null;
type PlaceStatus = google.maps.places.PlacesServiceStatus;

const getPlaceDetailsFromGoogleAPI = (
  placeId: string,
  map: google.maps.Map
) => {
  const placesService = new google.maps.places.PlacesService(map);

  return new Promise<{ place: Place; status: PlaceStatus }>(
    (resolve, reject) => {
      placesService.getDetails({ placeId }, (place, status) => {
        if (status === 'OK') resolve({ place, status });
        else reject({ place, status });
      });
    }
  );
};

type Predictions = google.maps.places.QueryAutocompletePrediction[];
const getPlacesFromGoogleAPI = (place: string) => {
  return new Promise<{
    predictions: Predictions | [];
    status: PlaceStatus;
  }>((resolve, reject) => {
    const displaySuggestions = function (
      predictions: Predictions | null,
      status: PlaceStatus
    ) {
      if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
        reject({ predictions, status });
      } else {
        resolve({ predictions, status });
      }
    };

    const autocompleteService = new google.maps.places.AutocompleteService();

    if (place)
      autocompleteService.getQueryPredictions(
        { input: place },
        displaySuggestions
      );
  });
};

export { getPlaceDetailsFromGoogleAPI, getPlacesFromGoogleAPI };
