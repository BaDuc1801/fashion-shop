export const PRODUCT_SIZE_SELECT_OPTIONS: { value: string; label: string }[] = [
  ...['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free size', 'One size'].map(
    (v) => ({ value: v, label: v }),
  ),
];
