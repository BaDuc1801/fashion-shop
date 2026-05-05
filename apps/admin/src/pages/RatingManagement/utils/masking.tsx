import React from 'react';

/**
 * Normalize + merge overlapping ranges
 */
export const normalizeRanges = (
  ranges: [number, number][],
  max: number,
): [number, number][] => {
  if (!ranges?.length) return [];

  const valid = ranges
    .map(([s, e]) => ({
      start: Math.max(0, s),
      end: Math.min(max, e),
    }))
    .filter((r) => r.end > r.start)
    .sort((a, b) => a.start - b.start);

  if (!valid.length) return [];

  const merged: { start: number; end: number }[] = [];
  let cur = { ...valid[0] };

  for (let i = 1; i < valid.length; i++) {
    const next = valid[i];

    if (next.start <= cur.end) {
      cur.end = Math.max(cur.end, next.end);
    } else {
      merged.push(cur);
      cur = { ...next };
    }
  }

  merged.push(cur);

  return merged.map((m) => [m.start, m.end] as [number, number]);
};

/**
 * Get selected text offsets inside container
 */
export const getSelectionOffsets = (
  container: HTMLElement,
): [number, number] | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return null;

  if (!container.contains(range.commonAncestorContainer)) return null;

  const pre = range.cloneRange();
  pre.selectNodeContents(container);
  pre.setEnd(range.startContainer, range.startOffset);

  const start = pre.toString().length;
  const end = start + range.toString().length;

  if (start === end) return null;

  return [start, end];
};

/**
 * Render highlighted text safely
 */
export const renderHighlightedText = (
  original: string,
  ranges: [number, number][],
  highlightClassName = 'bg-[#FFD66D] px-1 rounded-sm',
) => {
  if (!original) return original;
  if (!ranges?.length) return original;

  const normalized = normalizeRanges(ranges, original.length);
  if (!normalized.length) return original;

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  normalized.forEach(([start, end], idx) => {
    if (start > cursor) {
      parts.push(original.slice(cursor, start));
    }

    parts.push(
      <mark key={`${start}-${end}-${idx}`} className={highlightClassName}>
        {original.slice(start, end)}
      </mark>,
    );

    cursor = end;
  });

  if (cursor < original.length) {
    parts.push(original.slice(cursor));
  }

  return parts;
};
