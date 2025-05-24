export default class AddStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showAddStoryFormMap() {
    this.#view.showLoading();
    try {
      await this.#view.initializeMap();
    } catch (error) {
      console.error("showAddStoryFormMap: error:", error);
    } finally {
      this.#view.hideLoading();
    }
  }

  async postNewStory({ name, description, photos, lat, lon }) {
    this.#view.showLoadingButtonSubmit();
    try {
      const data = {
        // name: name,
        description: description,
        photos: photos,
        lat: lat,
        lon: lon,
      };
      const response = await this.#model.addNewStory(data);

      if (!response.ok) {
        console.error("postNewStory: response:", response);
        this.#view.failToPostStory(response.message);
        return;
      }

      this.#view.successPostStory(response.message, response);
    } catch (error) {
      console.error("postNewStory: error:", error);
      this.#view.failToPostStory(
        error.message || "An unexpected error occurred"
      );
    } finally {
      this.#view.hideLoadingButtonSubmit();
    }
  }
}
