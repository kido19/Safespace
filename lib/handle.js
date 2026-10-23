// /lib/handle.js
const ADJ = ["Calm","Brave","Quiet","Bright","Kind","Still","Gentle","Bold","Soft","Wise"];
const ANIMAL = ["Otter","Tiger","Falcon","Panda","Wolf","Dolphin","Fox","Hawk","Deer","Lynx"];

export function makeHandle() {
  const a = ADJ[Math.floor(Math.random() * ADJ.length)];
  const b = ANIMAL[Math.floor(Math.random() * ANIMAL.length)];
  const n = Math.floor(Math.random() * 99);
  return `${a}${b}${n}`;
}