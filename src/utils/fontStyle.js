
const calculateFontSize = (
  containerWidth,
  containerHeight,
  text,
  isLabel = false,
  isSinglePanel = false
) => {
  const textLength = (text?.toString() || "").length || 1;
  const widthFactor = isLabel
    ? isSinglePanel
      ? 2.2
      : 2.5
    : isSinglePanel
    ? 1.5
    : 2.0;
  const heightFactor = isLabel
    ? isSinglePanel
      ? 0.18
      : 0.2
    : isSinglePanel
    ? 0.5
    : 0.4;

  // Calculated size based on container dimensions
  const widthBasedSize = containerWidth / (textLength * widthFactor);
  const heightBasedSize = containerHeight * heightFactor;

  // size constraints for small containers
  const minSize = Math.min(containerWidth, containerHeight) < 40 ? 8 : 10;
  // max size to prevent overflow
  const maxSize = isLabel ? 24 : isSinglePanel ? 64 : 32;

  return Math.max(minSize, Math.min(widthBasedSize, heightBasedSize, maxSize));
};
export default calculateFontSize;
