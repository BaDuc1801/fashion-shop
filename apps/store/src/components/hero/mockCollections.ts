export type Collection = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  categoryIds: string[];
};

export const mockCollections: Collection[] = [
  {
    id: 'holiday-2026-women',
    title: "Women's New Arrivals",
    subtitle: 'HOLIDAY 2026',
    description:
      "New colors, now also available in women's sizing. Discover the latest seasonal picks curated for this collection.",
    categoryIds: ['women', 'new-arrivals'],
  },
];

