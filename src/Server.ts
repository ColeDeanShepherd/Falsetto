import { apiBaseUri } from "./Config";
import { UserProfile } from './UserProfile';

export interface IServer {
  signUp(email: string, password: string): Promise<string>;
  logIn(email: string, password: string): Promise<string>;
  emailResetPasswordLink(email: string): Promise<void>;
  resetPassword(resetPasswordToken: string, newPassword: string): Promise<void>;
  getProfile(): Promise<UserProfile>;
  startPurchase(productId: number, priceUsCents: number): Promise<StartPurchaseResponseDto>;
}

export interface StartPurchaseResponseDto {
  stripeClientSecret: string
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

  public async getProfile(): Promise<UserProfile> {
    const requestInit: RequestInit = {
      // TODO: review security
      credentials: "include" // include the session cookie
    };

    const response = await fetch(`${apiBaseUri}/profile`, requestInit);

    if (!response.ok) {
      const errorMessage = await response.text();
      return Promise.reject(`Failed getting profile: ${errorMessage}`);
    }

    const responseJson = await response.json();

    const profile = responseJson as UserProfile;
    return profile;
  }
  
  public async startPurchase(productId: number, priceUsCents: number): Promise<StartPurchaseResponseDto> {
    const requestInit: RequestInit = {
      method: "POST",
      // TODO: review security
      credentials: "include", // include the session cookie,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, priceUsCents })
    };

    const response = await fetch(`${apiBaseUri}/start-purchase`, requestInit);

    if (!response.ok) {
      const errorMessage = await response.text();
      return Promise.reject(`Failed starting purchase: ${errorMessage}`);
    }

    const responseJson = await response.json();

    const responseDto = responseJson as StartPurchaseResponseDto;
    return responseDto;
  }
}