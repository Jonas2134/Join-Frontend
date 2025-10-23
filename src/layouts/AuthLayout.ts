import LogoRaw from "/logo.svg?raw";

export function AuthLayout(
  content: string,
  mode: "login" | "signup" = "login"
): string {
  const colorLogo = LogoRaw.replace(/fill="[^"]*"/g, 'fill="currentColor"');

  const navHtml =
    mode === "login"
      ? `<span>Not a join user?</span>
       <a href="/signup" data-link class="btn-blue transition-all">Signup</a>`
      : `<span>Already a user?</span>
       <a href="/" data-link class="btn-blue transition-all">Login</a>`;

  return /*html*/ `
    <header class="fixed top-0 right-0 left-0 px-10 py-5 flex justify-between items-center">
      <div class="icon blue">${colorLogo}</div>
      <nav class="flex items-center gap-3">
        ${navHtml}
      </nav>
    </header>
    <main class="flex justify-center items-center flex-col h-dvh">
      ${content}
    </main>
    <footer class="fixed bottom-0 flex justify-center">
      <small>© 2025 My App</small>
    </footer>
  `;
}
