export type Fetch = typeof fetch;

export class IsomorphicFn {
  protected readonly fetch: Fetch;

  constructor(fetch: Fetch) {
    this.fetch = fetch;
  }
}
