import { storyMapper } from "../../data/api.mapper";

export default class StoryDetailPresenter {
  #storyId;
  #view;
  #apiModel;

  constructor(storyId, { view, apiModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#apiModel = apiModel;
  }

  async showStoryDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initializeMap();
    } catch (error) {
      console.log(error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showStoryDetail() {
    this.#view.showStoryDetailLoading();
    try {
      const response = await this.#apiModel.getStoryDetail(this.#storyId);

      if (!response.ok) {
        console.log("showStoryDetail error", response);
        this.#view.showStoryDetailError(response.message);
        return;
      }

      const story = await storyMapper(response.story);
      console.log(story);
      this.#view.populateStoryDetailAndInitializeMap(story);
    } catch (error) {
      console.log("showStoryDetail error", error);
      this.#view.showStoryDetailError(error.message);
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }
}
