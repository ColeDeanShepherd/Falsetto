export interface PremiumProduct {
  id: number;
  name: string;
  uri: string;
}

export const understandingThePianoKeyboardProductId = 1;

export const premiumProducts = [
  {
    id: understandingThePianoKeyboardProductId,
    name: "Understanding the Piano Keyboard",
    uri: "/understanding-the-piano-keyboard"
  }
];