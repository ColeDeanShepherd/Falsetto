import { apiBaseUri } from "./Config";

export interface IServer {
  signUp(email: string, password: string): Promise<string>;
  logIn(email: string, password: string): Promise<string>;
  emailResetPasswordLink(email: string): Promise<void>;
  resetPassword(resetPasswordToken: string, newPassword: string): Promise<void>;
}

export class Server implements IServer {
  public async signUp(email: string, password: string): Promise<string> {
    const requestInit: RequestInit = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    };

    const response = await fetch(`${apiBaseUri}/sign-up`, requestInit);

    if (!response.ok) {
      const errorMessage = await response.text();
      return Promise.reject(`Failed signing up: ${errorMessage}`);
    }

    const sessionToken = await response.text();
    return sessionToken;
  }
  
  public async logIn(email: string, password: string): Promise<string> {
    const requestInit: RequestInit = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    };

    const response = await fetch(`${apiBaseUri}/log-in`, requestInit);

    if (!response.ok) {
      const errorMessage = await response.text();
      return Promise.reject(`Failed logging in: ${errorMessage}`);
    }

    const sessionToken = await response.text();
    return sessionToken;
  }
  
  public async emailResetPasswordLink(email: string): Promise<void> {
    const requestInit: RequestInit = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    };

    const response = await fetch(`${apiBaseUri}/forgot-password`, requestInit);

    if (!response.ok) {
      const errorMessage = await response.text();
      return Promise.reject(`Failed sending password reset email: ${errorMessage}`);
    }
  }

  public async resetPassword(resetPasswordToken: string, newPassword: string): Promise<void> {
    const requestInit: RequestInit = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resetPasswordToken, password: newPassword })
    };

    const response = await fetch(`${apiBaseUri}/reset-password`, requestInit);

    if (!response.ok) {
      const errorMessage = await response.text();
      return Promise.reject(`Failed resetting password: ${errorMessage}`);
    }
  }
}