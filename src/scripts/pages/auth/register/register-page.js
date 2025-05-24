import * as StoryAPI from "../../../data/api.js";
import RegisterPresenter from "./register-presenter.js";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <div class="page-wrapper">
        <form class="register-form" id="register-form">
    <h2>Register</h2>

    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" placeholder="John Doe" />
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="you@example.com" />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" placeholder="Enter your password" />
    </div>

    <button type="submit">Register</button>
  </form>
      </div>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#setForm();
  }

  #setForm() {
    document
      .getElementById("register-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
        };

        await this.#presenter.registerUser(data);
      });
  }

  showSubmitLoadingButton() {
    const button = document.querySelector("button[type='submit']");
    button.innerHTML = "Loading...";
    button.setAttribute("disabled", true);
  }

  hideSubmitLoadingButton() {
    const button = document.querySelector("button[type='submit']");
    button.innerHTML = "Register";
    button.removeAttribute("disabled");
  }

  successToRegister(message) {
    alert(message);
    location.hash = "/login";
  }

  failToRegister(message) {
    alert(message);
  }
}
