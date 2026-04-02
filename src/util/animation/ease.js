import { bez } from "catpow/util";

export const easeLinear = (p) => p;

export const easeInQuad = (p) => p * p;
export const easeOutQuad = (p) => 1 - Math.pow(1 - p, 2);
export const easeInOutQuad = (p) => (p < 0.5 ? p * p * 2 : 1 - Math.pow(1 - p, 2) * 2);

export const easeInCubic = (p) => p * p * p;
export const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);
export const easeInOutCubic = (p) => (p < 0.5 ? p * p * p * 4 : 1 - Math.pow(1 - p, 3) * 4);

export const easeInJump = (p) => bez([0, 3, 1], p);
export const easeOutJump = (p) => bez([0, -2, 1], p);
export const easeInOutJump = (p) => bez([0, -2, 0.5, 3, 1], p);

export const easeBounce = (p, c = -1) => (c < 10 && p > 1 / 3 ? easeBounce(p * 2 - 1, c + 1) : 1 - bez([0, Math.pow(1 / 2, c), 0], Math.max(0, Math.min(p * 1.5 + 0.5, 1))));
