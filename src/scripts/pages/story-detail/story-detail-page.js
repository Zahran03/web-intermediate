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
    console.log("afterRender called");
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: StoryAPI,
    });

    this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitializeMap(story) {
    const detailPageElement = document.getElementById("detail-page");

    // Check if coordinates are valid numbers
    const isValidCoordinate = (coord) => {
      const num = parseFloat(coord);
      return !isNaN(num) && isFinite(num);
    };

    const hasValidCoordinates =
      isValidCoordinate(story.lat) && isValidCoordinate(story.lon);

    const location = await Map.getPlaceName(story.lat, story.lon);
    const templateHTML = generateStoryDetailTemplate({
      id: story.id,
      name: story.name,
      description: story.description,
      photo: story.photoUrl,
      createdAt: story.createdAt,
      lat: story.lat,
      lon: story.lon,
      location: location,
    });

    detailPageElement.innerHTML = templateHTML;

    await this.#waitForElement("#map-loading-container");

    await this.#waitForElement("#map");

    await this.#presenter.showStoryDetailMap();

    const lat = parseFloat(story.lat);
    const lon = parseFloat(story.lon);

    if (this.#map) {
      console.log("Map initialized, adding marker");
      const storyCoordinate = [lat, lon];
      const markerOptions = { alt: story.description };
      const popupOptions = { content: story.description };
      this.#map.changeCamera(storyCoordinate);
      this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
    } else {
      console.log("Map not initialized");
    }
  }

  async initializeMap() {
    console.log("initializeMap called");
    this.#map = await Map.build("#map", {
      zoom: 15,
    });
  }

  async #waitForElement(selector) {
    let attempts = 0;
    while (!document.querySelector(selector)) {
      attempts++;
      if (attempts > 100) {
        // Prevent infinite loop
        console.error(`Element ${selector} not found after 100 attempts`);
        throw new Error(`Element ${selector} not found`);
      }
      await new Promise((r) => setTimeout(r, 50));
    }
    console.log(`Element ${selector} found after ${attempts} attempts`);
  }

  showMapLoading() {
    console.log("showMapLoading called");
    const mapLoadingContainer = document.getElementById(
      "map-loading-container"
    );
    if (mapLoadingContainer) {
      mapLoadingContainer.innerHTML = '<div class="loading">Loading...</div>';
    } else {
      console.log("map-loading-container not found");
    }
  }

  hideMapLoading() {
    console.log("hideMapLoading called");
    const mapLoadingContainer = document.getElementById(
      "map-loading-container"
    );
    if (mapLoadingContainer) {
      // Instead of just clearing innerHTML, hide the entire container
      mapLoadingContainer.innerHTML = "";
      mapLoadingContainer.style.display = "none"; // Add this line
      // OR completely remove it: mapLoadingContainer.remove();
    } else {
      console.log("map-loading-container not found");
    }
  }

  showStoryDetailLoading() {
    console.log("showStoryDetailLoading called");
    document.getElementById("detail-page").innerHTML =
      '<div class="loading">Loading...</div>';
  }

  hideStoryDetailLoading() {
    console.log("hideStoryDetailLoading called");
    const detailPageElement = document.getElementById("detail-page");
    if (
      detailPageElement &&
      detailPageElement.innerHTML === '<div class="loading">Loading...</div>'
    ) {
      // Only clear if it's still showing loading
      console.log("Clearing loading state");
    } else {
      console.log(
        "Not clearing - content already populated or element not found"
      );
    }
  }

  showStoryDetailError(message) {
    console.log("showStoryDetailError called with message:", message);
    document.getElementById("detail-page").innerHTML = `
      <div class="error">
        <p>${message}</p>
      </div>
    `;
  }
}
