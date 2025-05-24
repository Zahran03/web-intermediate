import "../../../../styles/styles.css";
import LoginPresenter from "./login-presenter";
import * as StoryAPI from "../../../data/api.js";
import * as AuthModel from "../../../utils/auth.js";

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
  <div class="page-wrapper">
      <form class="login-form">
    <h2>Login</h2>

    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="you@example.com" />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" placeholder="Enter your password" />
    </div>

    <button type="submit">Login</button>
  </form>
  </div>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryAPI,
      authModel: AuthModel,
    });

    this.#setForm();
  }

  #setForm() {
    document
      .querySelector(".login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = {
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
        };

        await this.#presenter.loginUser(data);
      });
  }
  showSubmitLoadingButton() {
    const button = document.querySelector("button[type='submit']");
    button.innerHTML = "Loading...";
  }
  hideSubmitLoadingButton() {
    const button = document.querySelector("button[type='submit']");
    button.innerHTML = "Login";
  }
  successToLogin(message) {
    console.log(message);
    location.hash = "/";
  }
  failToLogin(message) {
    console.error(message);
    alert(message);
  }
}
