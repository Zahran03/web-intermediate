export default class RegisterPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async loginUser({ email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const res = await this.#model.loginUser({ email, password });
      console.log(res);
      if (!res.ok) {
        console.error("loginUser: response:", res);
        this.#view.failToLogin(res.message);
        return;
      }
      this.#authModel.putToken(res.loginResult.token);
      this.#view.successToLogin(res.message, res.data);
    } catch (error) {
      console.error("loginUser: error:", error);
      this.#view.failToLogin(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
