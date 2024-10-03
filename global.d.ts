export {};

declare global {
  interface GlobalThis {
    pastes?: Map<string, { title: string; content: string }>;
  }
}
