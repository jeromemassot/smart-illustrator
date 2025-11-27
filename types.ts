export enum AgeRange {
  Kids = "Kids (Under 10)",
  Teens = "Teens (10-16)",
  PreAdults = "Pre-adults (16-20)",
  Adults = "Adults (20+)"
}

export enum IllustrationStyle {
  OldFashion = "Old Fashion Scholar Book",
  WhiteBoard = "White Board Sketch",
  Modern = "Modern Flat Vector",
  ComicBook = "Comic Book",
  OilPainting = "Oil Painting",
  PixelArt = "Pixel Art"
}

export interface GenerationRequest {
  sourceType: 'text' | 'url';
  content: string; // The text content or the URL
  language: string;
  ageRange: AgeRange;
  style: IllustrationStyle;
}

export interface GenerationResult {
  imageUrl: string;
  explanation: string;
  generatedPrompt: string;
  sources?: Array<{ title: string; uri: string }>;
}