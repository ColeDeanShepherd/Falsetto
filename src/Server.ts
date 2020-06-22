import { apiBaseUri } from "./Config";

export interface IServer {
  logIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
}

export class Server {
  public async signUp(email: string, password: string): Promise<void> {
    const requestInit: RequestInit = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    };

    const response = await fetch(`${apiBaseUri}/sign-up`, requestInit);
    if (!response.ok) {
      return Promise.reject(`Failed signing up: ${response.statusText}`);
    }
  }
  
  public async logIn(email: string, password: string): Promise<void> {
    const requestInit: RequestInit = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    };

    const response = await fetch(`${apiBaseUri}/log-in`, requestInit);
    if (!response.ok) {
      return Promise.reject(`Failed logging in: ${response.statusText}`);
    }
  }
  
  public async resetPassword(email: string): Promise<void> {
    const requestInit: RequestInit = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    };

    const response = await fetch(`${apiBaseUri}/reset-password`, requestInit);
    if (!response.ok) {
      return Promise.reject(`Failed resetting password: ${response.statusText}`);
    }
  }
}