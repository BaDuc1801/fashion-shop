export const useHexColorPayload = () => {
  const normalizeHexColor = (color: string) => {
    if (!color) return '#000000';

    if (color.startsWith('#')) {
      return color;
    }

    const result = color.match(/\d+/g);
    if (!result || result.length < 3) return '#000000';

    const [r, g, b] = result.map(Number);

    const toHex = (n: number) => n.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return { normalizeHexColor };
};
