export function AuthLayout(content: string): string {
  return /*html*/ `
    <header class="fixed top-0 flex justify-center">
      <h1>Welcome</h1>
    </header>
    <main class="flex justify-center items-center flex-col max-w-7xl h-dvh">
      ${content}
    </main>
    <footer class="fixed bottom-0 flex justify-center">
      <small>© 2025 My App</small>
    </footer>
  `;
}
