import { atom } from "recoil";

export const vouchedState = atom({
  key: "vouchedState",
  default: [
    { address: "0xb837f2564d24f3A4A503b351efe1b764fbC583c0", locked: 0.1 },
  ],
});
