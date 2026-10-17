import { Server } from "node:http";
import { createApp } from "../src/app";

export interface TestResponse {
  status: number;
  headers: Headers;
  body: any;
}

export class TestClient {
  private server: Server | null = null;
  public baseUrl = "";

  async start(): Promise<string> {
    const app = createApp();
    return new Promise((resolve) => {
      this.server = app.listen(0, () => {
        const addr = this.server!.address();
        const port = typeof addr === "object" && addr ? addr.port : 4000;
        this.baseUrl = `http://127.0.0.1:${port}`;
        resolve(this.baseUrl);
      });
    });
  }

  async stop(): Promise<void> {
    if (this.server) {
      return new Promise((resolve) => {
        this.server!.close(() => {
          this.server = null;
          resolve();
        });
      });
    }
  }

  async request(method: string, path: string, options: { body?: any; token?: string; query?: Record<string, any> } = {}): Promise<TestResponse> {
    let url = `${this.baseUrl}${path}`;
    if (options.query) {
      const q = new URLSearchParams();
      for (const [k, v] of Object.entries(options.query)) {
        if (v !== undefined) q.append(k, String(v));
      }
      url += `?${q.toString()}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (options.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
    }

    const res = await fetch(url, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    let body: any;
    const text = await res.text();
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    return {
      status: res.status,
      headers: res.headers,
      body,
    };
  }

  get(path: string, options?: { token?: string; query?: Record<string, any> }) {
    return this.request("GET", path, options);
  }

  post(path: string, body?: any, options?: { token?: string }) {
    return this.request("POST", path, { body, ...options });
  }

  patch(path: string, body?: any, options?: { token?: string }) {
    return this.request("PATCH", path, { body, ...options });
  }

  delete(path: string, options?: { token?: string }) {
    return this.request("DELETE", path, options);
  }
}
