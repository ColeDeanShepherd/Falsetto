export interface PremiumProduct {
  id: number;
  name: string;
  uri: string;
  priceInUsCents: number;
}

export const understandingThePianoKeyboardProduct: PremiumProduct = {
  id: 1,
  name: "Understanding the Piano Keyboard",
  uri: "/understanding-the-piano-keyboard",
  priceInUsCents: 2000
};

export const premiumProducts = [
  understandingThePianoKeyboardProduct
];