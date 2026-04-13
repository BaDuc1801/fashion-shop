const HEX_3_OR_6_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const expandHex = (hex: string) =>
  hex.length === 3 ? hex.split('').map((c) => `${c}${c}`).join('') : hex;

export const useHexColorPayload = () => {
  const normalizeHexColor = (value: string) => {
    const raw = value.trim();
    const matched = raw.match(HEX_3_OR_6_REGEX);
    if (!matched) return '#000000';

    const fullHex = expandHex(matched[1]).toLowerCase();
    return `#${fullHex}`;
  };

  return { normalizeHexColor };
};
