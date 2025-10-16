export function BoardLayout(content: string): string {
  return /*html*/ `
    <header>
      <h1>Dashboard</h1>
    </header>
    <aside>
      <nav>
        <a href="/dashboard" data-link>Home</a>
        <a href="/settings" data-link>Settings</a>
      </nav>
    </aside>
    <main>${content}</main>
  `;
}