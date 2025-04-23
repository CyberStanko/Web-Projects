import '@testing-library/jest-dom';

// Mock NextResponse
global.NextResponse = {
  json: (body, init) => {
    return {
      json: async () => body,
      status: init?.status || 200,
      headers: new Map(),
      ok: true,
      ...init
    };
  }
};

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
    ok: true
  })
);

global.Response = class Response {
  constructor(body, init) {
    this.body = body;
    this.init = init;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || '';
  }
  json() {
    return Promise.resolve(this.body);
  }
};

global.Request = class Request {
  constructor(url, init) {
    this.url = url;
    this.init = init;
  }
};

// Optional: add any global setup here 