import { type RgbaColor } from "react-colorful";

export const isColorEdited = (color1: RgbaColor, color2: RgbaColor) => {
  for (const property in color1) {
    if (
      color1[property as keyof RgbaColor] !==
      color2[property as keyof RgbaColor]
    ) {
      return true;
    }
  }
  return false;
};
