import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type LabelRGBAColor } from "../../types/db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateLabelColor = (labelColor: LabelRGBAColor) => {
  const { r, g, b, a } = labelColor;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const generateLabelBackgroundColor = (
  labelId: string,
  labelColor: LabelRGBAColor,
  selectedLabelId?: string,
) => {
  const { r, g, b, a } = labelColor;
  const adjustedOpacity = a * (selectedLabelId === labelId ? 1 : 0.2);
  return `rgba(${r}, ${g}, ${b}, ${adjustedOpacity})`;
};

export const productionUrl = "";
