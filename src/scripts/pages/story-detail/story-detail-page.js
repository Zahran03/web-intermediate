import { parseActivePathname } from "../../routes/url-parser";
import Map from "../../utils/map";
import StoryDetailPresenter from "./story-detail-presenter";
import * as StoryAPI from "../../data/api";
import { generateStoryDetailTemplate } from "../../template";

export default class StoryDetailPage {
  #presenter;

  #map;

  async render() {
    return `
            <div class="container">
                <section id="detail-page" class="detail-container">
                  
                </section>
            </div>
`;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: StoryAPI,
    });

    this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitializeMap(story) {
    document.getElementById("detail-page").innerHTML =
      generateStoryDetailTemplate({
        name: story.name,
        description: story.description,
        photoUrl: story.photoUrl,
        createdAt: story.createdAt,
        lat: story.lat,
        lon: story.lon,
      });

    await this.#presenter.showStoryDetailMap();
    if (this.#map) {
      const storyCoordintate = [story.lat, story.lon];
      const markerOptions = { alt: story.description };
      const popupOptions = { content: report.description };
      this.#map.changeCamera(storyCoordintate);
      this.#map.addMarker(storyCoordintate, markerOptions, popupOptions);
    }
  }

  async initializeMap() {
    this.#map = await Map.build("#map", {
      zoom: 15,
    });
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      '<div class="loading">Loading...</div>';
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showStoryDetailLoading() {
    document.getElementById("detail-page").innerHTML =
      '<div class="loading">Loading...</div>';
  }

  hideStoryDetailLoading() {
    document.getElementById("detail-page").innerHTML = "";
  }

  showStoryDetailError(message) {
    document.getElementById("detail-page").innerHTML = `
      <div class="error">
        <p>${message}</p>
      </div>
    `;
  }
}
