import AddStoryPresenter from "./add-presenter";
import * as StoryAPI from "../../data/api.js";
import Map from "../../utils/map.js";
import Camera from "../../utils/camera.js";
import { convertBase64ToBlob } from "../../utils/index.js";

export default class AddNewStory {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenDocumentations = [];
  #map = null;
  async render() {
    return `
        <form id="new-form">
      
      
      <div class="form-control">
        <label for="description-input">Deskripsi</label>
        <textarea
          id="description-input"
          name="description"
          placeholder="deskripsi"
          rows="5"
        ></textarea>
      </div>
      
      <div class="form-control">
        <label for="documentations-input">Gambar</label>
        <div id="documentations-more-info">Anda dapat mengupload gambar sebagai dokumentasi.</div>
        
        <div class="new-form__documentations__buttons">
          <button id="documentations-input-button" type="button">
            Ambil Gambar
          </button>
          <input
            id="documentations-input"
            name="documentations"
            type="file"
            accept="image/*"
            multiple
            hidden="hidden"
          >
          <button id="open-documentations-camera-button" class="btn-outline" type="button">
            Buka Kamera
          </button>
        </div>
        
        <div id="camera-container" class="new-form__camera__container">
          <video id="camera-video" class="new-form__camera__video">
            Video stream not available.
          </video>
          <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>
          
          <div class="new-form__camera__tools">
            <select id="camera-select"></select>
            <button id="camera-take-button" type="button">
              Ambil Gambar
            </button>
          </div>
        </div>
        
        <ul id="documentations-taken-list"></ul>
      </div>
      
      <div class="form-control">
        <label>Lokasi</label>
        <div class="new-form__location__map__container">
          <div id="map" class="new-form__location__map"></div>
        </div>
        <div class="new-form__location__lat-lng">
          <input type="number" name="latitude" value="-6.175389" disabled>
          <input type="number" name="longitude" value="106.827139" disabled>
        </div>
      </div>
      
      <div class="form-buttons">
        <button type="submit">Buat Cerita</button>
        <button type="button" class="btn-outline" onclick="window.location.href='#/'">Batal</button>
      </div>
    </form>
    `;
  }

  async afterRender() {
    this.#presenter = new AddStoryPresenter({
      view: this,
      model: StoryAPI,
    });
    this.#takenDocumentations = [];

    this.#presenter.showAddStoryFormMap();
    this.#formSetup();
  }

  #formSetup() {
    this.#form = document.querySelector("#new-form");
    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        description: this.#form.elements.namedItem("description").value,
        photos: this.#takenDocumentations.map((picture) => picture.blob),
        lat: this.#form.elements.namedItem("latitude").value,
        lon: this.#form.elements.namedItem("longitude").value,
      };
      console.log("data", data);
      await this.#presenter.postNewStory(data);
    });

    document
      .querySelector("#documentations-input")
      .addEventListener("change", async (event) => {
        const insertingPicturesPromises = Object.values(event.target.files).map(
          async (file) => {
            return await this.#addImagesTaken(file);
          }
        );
        await Promise.all(insertingPicturesPromises);
        await this.#populateImagesTaken();
      });

    document
      .getElementById("documentations-input-button")
      .addEventListener("click", () => {
        this.#form.elements.namedItem("documentations").click();
      });

    const containerCamera = document.getElementById("camera-container");
    document
      .getElementById("open-documentations-camera-button")
      .addEventListener("click", async (event) => {
        containerCamera.classList.toggle("open");
        this.#isCameraOpen = containerCamera.classList.contains("open");

        if (this.#isCameraOpen) {
          event.currentTarget.textContent = "Tutup Kamera";
          this.#cameraSetup();
          await this.#camera.launch();

          return;
        }

        event.currentTarget.textContent = "Buka Kamera";
        this.#camera.stop();
      });
  }

  async initializeMap() {
    this.#map = await Map.build("#map", {
      zoom: 15,
      locate: true,
    });

    const centerCoordinate = this.#map.getCenter();
    console.log(centerCoordinate);
    this.#updateLatLngInput(centerCoordinate.lat, centerCoordinate.lng);
    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.lat, centerCoordinate.lng],
      { draggable: "true" }
    );
    draggableMarker.addEventListener("move", (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });
    this.#map.addMapEventListener("click", (event) => {
      draggableMarker.setLatLng(event.latlng);
      event.sourceTarget.flyto(event.latlng);
    });
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem("latitude").value = latitude;
    this.#form.elements.namedItem("longitude").value = longitude;
  }

  #cameraSetup() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById("camera-video"),
        cameraSelect: document.getElementById("camera-select"),
        canvas: document.getElementById("camera-canvas"),
      });
    }

    this.#camera.addCheeseButtonListener("#camera-take-button", async () => {
      const image = await this.#camera.takePicture();
      await this.#addImagesTaken(image);
      await this.#populateImagesTaken();
    });
  }

  async #addImagesTaken(image) {
    let blob = image;

    if (image instanceof String) {
      blob = await convertBase64ToBlob(image, "image/png");
    }

    const newDocumentation = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };

    this.#takenDocumentations = [
      ...this.#takenDocumentations,
      newDocumentation,
    ];
  }

  async #populateImagesTaken() {
    const html = this.#takenDocumentations.reduce(
      (accumulator, picture, currentIndex) => {
        const imageUrl = URL.createObjectURL(picture.blob);
        return (
          accumulator +
          `<li class="new-form__documentations__taken">
            <img src="${imageUrl}" alt="Gambar ${currentIndex + 1}">
            <button type="button" data-deletepictureid="${
              picture.id
            }" class="btn-outline" data-index="${currentIndex}">Hapus</button>
          </li>`
        );
      },
      ""
    );

    document.getElementById("documentations-taken-list").innerHTML = html;

    document
      .querySelectorAll("button[data-deletepictureid]")
      .forEach((button) =>
        button.addEventListener("click", (event) => {
          const pictureId = event.target.dataset.deletepictureid;

          const deleted = this.#removeImage(pictureId);
          if (!deleted) {
            console.log(`images dengan id ${pictureId} tidak ditemukan`);
          }

          this.#populateImagesTaken();
        })
      );
  }

  #removeImage(id) {
    const selectedPicture = this.#takenDocumentations.find(
      (picture) => picture.id === id
    );

    if (!selectedPicture) {
      return null;
    }

    this.#takenDocumentations = this.#takenDocumentations.filter((picture) => {
      return picture.id != selectedPicture.id;
    });

    return selectedPicture;
  }

  async showLoading() {
    this.#form = document.querySelector("#new-form");
    this.#form.insertAdjacentHTML(
      "beforeend",
      `<div class="loading-container">
        <div class="loading-spinner"></div>
      </div>`
    );
  }

  hideLoading() {
    const loadingContainer = document.querySelector(".loading-container");
    if (loadingContainer) {
      loadingContainer.remove();
    }
  }

  showLoadingButtonSubmit() {
    const button = this.#form.querySelector("button[type='submit']");
    button.insertAdjacentHTML(
      "beforeend",
      `<div class="loading-spinner"></div>`
    );
  }

  hideLoadingButtonSubmit() {
    const button = this.#form.querySelector("button[type='submit']");
    const loadingSpinner = button.querySelector(".loading-spinner");
    if (loadingSpinner) {
      loadingSpinner.remove();
    }
  }

  successPostStory(message, response) {
    alert(message);
    location.hash = "/";
  }

  failToPostStory(message) {
    alert(message);
  }
}
