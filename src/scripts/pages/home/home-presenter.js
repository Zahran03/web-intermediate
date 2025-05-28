export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoryListMap() {
    this.#view.showLoading();
    try {
      await this.#view.intializeMap();
    } catch (error) {
      console.error("showStoryListMap: error:", error);
    } finally {
      this.#view.hideLoading();
    }
  }

  async intializeMapAndStoryList() {
    this.#view.showLoading();
    try {
      await this.showStoryListMap();

      const response = await this.#model.getStory();

      console.log(response);
      if (!response || !response.ok) {
        console.error("intializeMapAndStoryList: response:", response);
        this.#view.failToLoadStory(
          response?.message || "Failed to load stories"
        );
        return;
      }

      // Fixed the error message in console to match the actual method name
      
      this.#view.populateStories(response.message, response.listStory || []);
    } catch (error) {
      console.error("intializeMapAndStoryList: error:", error);
      this.#view.failToLoadStory(
        error.message || "An unexpected error occurred"
      );
    } finally {
      this.#view.hideLoading();
    }
  }

  async postNewStory({name, description, }) {}
}
