import Map from "../utils/map.js";

export async function storyMapper(story) {
  return {
    ...story,
    // lat:{
    //   ...story.lat,

    // }
    // lat: await Map.getPlaceName(story.lan),
    // lon: await Map.getPlaceName(story.lon),
    // location: {
    //   ...story.location,
    //   placeName: await Map.getPlaceNameByCoordinate(
    //     story.location.latitude,
    //     story.location.longitude
    //   ),
    // },
  };
}
