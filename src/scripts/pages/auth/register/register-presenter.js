export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async registerUser({ name, email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const res = await this.#model.registerUser({ name, email, password });
      if (!res.ok) {
        console.error("registerUser: response:", res);
        this.#view.failToRegister(res.message);
        return;
      }
      this.#view.successToRegister(res.message, res.data);
    } catch (error) {
      console.error("registerUser: error:", error);
      this.#view.failToRegister(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
