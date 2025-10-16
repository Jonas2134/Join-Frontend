export function Login() {
  return /*html*/ `
    <section class="flex justify-center items-center flex-col">
      <form aria-label="Login form">
        <fieldset class="flex flex-col items-center gap-4">
          <legend class="text-4xl text-center font-semibold pb-4 mb-4 border-b-2 border-blue-500">Login</legend>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </fieldset>
      </form>
      <a href="/signup" data-link>Sign up</a>
    </section>
  `;
}
