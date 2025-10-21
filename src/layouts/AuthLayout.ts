import LogoRaw from "/logo.svg?raw";

export function AuthLayout(content: string): string {
  const colorLogo = LogoRaw.replace(/fill="[^"]*"/g, 'fill="currentColor"');

  return /*html*/ `
    <header class="fixed top-0 right-0 left-0 px-10 py-5 flex justify-between items-center">
      <div class="icon blue">${colorLogo}</div>
      <h1>Hello</h1>
      <nav class="flex items-center gap-3">
        <span>Not a join user?</span>
        <button class="btn-blue transition-all">Signup</button>
      </nav>
    </header>
    <main class="flex justify-center items-center flex-col max-w-7xl h-dvh">
      ${content}
    </main>
    <footer class="fixed bottom-0 flex justify-center">
      <small>© 2025 My App</small>
    </footer>
  `;
}