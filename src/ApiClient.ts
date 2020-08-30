import { apiBaseUri } from "./Config";
import { UserProfile } from './UserProfile';

export interface IApiClient {
  signUpAsync(email: string, password: string): Promise<string>;
  logInAsync(email: string, password: string): Promise<string>;
  emailResetPasswordLinkAsync(email: string): Promise<void>;
  resetPasswordAsync(resetPasswordToken: string, newPassword: string): Promise<void>;
  getProfileAsync(): Promise<UserProfile>;
  startPurchaseAsync(productId: number, priceUsCents: number): Promise<StartPurchaseResponseDto>;
  createStripeCheckoutSessionAsync(productId: number, priceUsCents: number): Promise<CreateStripeCheckoutSessionResponseDto>;
}

export interface StartPurchaseResponseDto {
  stripeClientSecret: string;
}

export interface CreateStripeCheckoutSessionResponseDto {
  checkoutSessionId: string;
}

export class ApiClient implements IApiClient {
  public async signUpAsync(email: string, password: string): Promise<string> {
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
  
  public async logInAsync(email: string, password: string): Promise<string> {
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
  
  public async emailResetPasswordLinkAsync(email: string): Promise<void> {
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

  public async resetPasswordAsync(resetPasswordToken: string, newPassword: string): Promise<void> {
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

  public async getProfileAsync(): Promise<UserProfile> {
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
  
  public async startPurchaseAsync(productId: number, priceUsCents: number): Promise<StartPurchaseResponseDto> {
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

  public async createStripeCheckoutSessionAsync(productId: number, priceUsCents: number): Promise<CreateStripeCheckoutSessionResponseDto> {
    const requestInit: RequestInit = {
      method: "POST",
      // TODO: review security
      credentials: "include", // include the session cookie,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, priceUsCents })
    };

    const response = await fetch(`${apiBaseUri}/create-stripe-checkout-session`, requestInit);

    if (!response.ok) {
      const errorMessage = await response.text();
      return Promise.reject(`Failed creating Stripe checkout session: ${errorMessage}`);
    }

    const responseJson = await response.json();

    const responseDto = responseJson as CreateStripeCheckoutSessionResponseDto;
    return responseDto;
  }
}