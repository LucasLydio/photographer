declare module 'alpinejs' {
  interface AlpineInstance {
    data(name: string, callback: () => unknown): void;
    start(): void;
  }

  const Alpine: AlpineInstance;
  export default Alpine;
}
