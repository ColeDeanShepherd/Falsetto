export type UserId = string;
export type FullName = string;
export type EmailAddress = string;

export class UserProfile {
  public constructor(
    public id: UserId,
    public fullName: FullName,
    public emailAddress: EmailAddress,
  ) {}
}