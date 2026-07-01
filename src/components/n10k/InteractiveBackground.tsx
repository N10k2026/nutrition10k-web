'use client';

/**
 * StaticBackground — fixed full-viewport background for Nutrition 10K.
 *
 * Pure matte white background (no red tints, no gradients).
 * Brand colors: white (primary) + red (#E30613, accents on cards/buttons only) + black (text).
 */
export default function InteractiveBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Pure matte white base */}
      <div className="absolute inset-0 bg-white" />
    </div>
  );
}
