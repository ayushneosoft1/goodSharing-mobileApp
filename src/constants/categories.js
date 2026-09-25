export const CATEGORIES = [
  { id: "1", code: "BOOK", label: "BOOK" },
  { id: "2", code: "CLOTH", label: "CLOTH" },
  { id: "3", code: "ELECTRONIC", label: "ELECTRONIC" },
  { id: "4", code: "TOYS", label: "TOYS" },
];

export const CATEGORY_IDS = Object.fromEntries(
  CATEGORIES.map(({ code, id }) => [code, id]),
);

export const CATEGORY_NAMES = Object.fromEntries(
  CATEGORIES.map(({ id, code }) => [id, code]),
);
