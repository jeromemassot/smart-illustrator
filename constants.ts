import { AgeRange, IllustrationStyle } from './types';

export const AGE_OPTIONS = [
  { value: AgeRange.Kids, label: "Kids (Under 10)", icon: "🧸" },
  { value: AgeRange.Teens, label: "Teens (10-16)", icon: "🛹" },
  { value: AgeRange.PreAdults, label: "Pre-adults (16-20)", icon: "🎓" },
  { value: AgeRange.Adults, label: "Adults (20+)", icon: "💼" },
];

export const STYLE_OPTIONS = [
  { value: IllustrationStyle.OldFashion, label: "Old Fashion Scholar", description: "Vintage textbook aesthetic with detailed hatching." },
  { value: IllustrationStyle.WhiteBoard, label: "White Board", description: "Simple marker sketches on a white background." },
  { value: IllustrationStyle.Modern, label: "Modern Vector", description: "Clean, flat colors and geometric shapes." }
];

export const TARGET_LANGUAGES = [
  "English", "Spanish", "French", "German", "Portuguese", "Chinese", "Japanese", "Hindi", "Arabic"
];