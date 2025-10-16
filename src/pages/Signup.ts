export function Signup() {
  return /*html*/ `
    <section>
      <h2>Sign Up</h2>
      <form>
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Sign up</button>
      </form>
      <a href="/" data-link>Login</a>
    </section>
  `;
}