import HomePresenter from "./home-presenter";
import * as StoryAPI from "../../data/api.js";
import Map from "../../utils/map.js";
import {
  generateStoryCardTemplate,
  generateStoryEmptyTemplate,
  generateStoryListErrorTemplate,
} from "../../template.js";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
    <section class="map-container">
      <div id="map" class="map"></div>
      <div class="loading-indicator" style="display: none;">
        <p>Loading...</p>
      </div>
    </section>

    <!-- Story Section -->
    <section class="story-section">
      <h2>Story List</h2>
      <div id="card-container"></div>
    </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    await this.#presenter.intializeMapAndStoryList();
  }

  populateStories(message, stories) {
    if (!stories || stories.length <= 0) {
      this.populatedStoriesListEmpty();
      return;
    }
    const html = stories.reduce((accumulator, story) => {
      if (this.#map && story && story.lat !== null && story.lon !== null) {
        // Validate that lat and lon are valid numbers before adding markers
        const lat = parseFloat(story.lat);
        const lon = parseFloat(story.lon);

        if (!isNaN(lat) && !isNaN(lon)) {
          const coordinate = [lat, lon];
          const markerOptions = { alt: story.title || "Unnamed location" };
          const popupOptions = { content: story.title || "Unnamed location" };
          this.#map.addMarker(coordinate, markerOptions, popupOptions);
        }
      }
      return accumulator.concat(
        generateStoryCardTemplate({
          ...story,
          name: story.name || "Unknown",
        })
      );
    }, "");

    const cardContainer = document.getElementById("card-container");
    if (cardContainer) {
      cardContainer.innerHTML = `
        <div class="card-container">
          ${html}
        </div>
      `;
    }
  }

  populatedStoriesListEmpty() {
    const cardContainer = document.querySelector(".card-container");
    if (cardContainer) {
      cardContainer.innerHTML = generateStoryEmptyTemplate();
    } else {
      const container = document.getElementById("card-container");
      if (container) {
        container.innerHTML = `<div class="card-container">${generateStoryEmptyTemplate()}</div>`;
      }
    }
  }

  populatedStoriesListError(message) {
    const cardContainer = document.querySelector(".card-container");
    if (cardContainer) {
      cardContainer.innerHTML = generateStoryListErrorTemplate(message);
    } else {
      const container = document.getElementById("card-container");
      if (container) {
        container.innerHTML = `<div class="card-container">${generateStoryListErrorTemplate(
          message
        )}</div>`;
      }
    }
  }

  async intializeMap() {
    const mapElement = document.querySelector("#map");
    if (!mapElement) {
      throw new Error("Map element not found in DOM");
    }

    // Make sure map is visible
    mapElement.style.display = "block";

    this.#map = await Map.build("#map", {
      zoom: 10,
      locate: true,
    });
  }

  showLoading() {
    // Instead of replacing the map container content, show a loading indicator
    const mapElement = document.querySelector("#map");
    const loadingIndicator = document.querySelector(".loading-indicator");

    if (mapElement && loadingIndicator) {
      // Hide map and show loading indicator
      mapElement.style.display = "none";
      loadingIndicator.style.display = "block";
    }
  }

  hideLoading() {
    // Show map and hide loading indicator
    const mapElement = document.querySelector("#map");
    const loadingIndicator = document.querySelector(".loading-indicator");

    if (mapElement && loadingIndicator) {
      mapElement.style.display = "block";
      loadingIndicator.style.display = "none";
    }
  }

  failToLoadStory(message) {
    this.populatedStoriesListError(message);
  }
}
