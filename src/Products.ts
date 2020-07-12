export interface PremiumProduct {
  id: number;
  name: string;
  uri: string;
}

export const understandingThePianoKeyboardProductId = 1;

export const understandingThePianoKeyboardProduct: PremiumProduct = {
  id: understandingThePianoKeyboardProductId,
  name: "Understanding the Piano Keyboard",
  uri: "/understanding-the-piano-keyboard"
};

export const earTrainingCourseProduct: PremiumProduct = {
  id: 3,
  name: "Ear Training",
  uri: "/ear-training"
};

export const premiumProducts = [
  understandingThePianoKeyboardProduct,
  {
    id: understandingThePianoKeyboardProductId,
    name: "Understanding the Piano Keyboard",
    uri: "/understanding-the-piano-keyboard"
  },
  earTrainingCourseProduct
];