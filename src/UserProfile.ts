export type UserId = string; // TODO: remove or change
export type EmailAddress = string;

export interface UserProfile {
  email: EmailAddress,
  boughtProductIds: Array<number>
}