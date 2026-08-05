export const iconNeedsContrastBackground = (image: HTMLImageElement): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  if (!context) return false;

  try {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let visiblePixels = 0;
    let lightPixels = 0;

    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] < 32) continue;
      visiblePixels += 1;
      if (pixels[index] >= 235 && pixels[index + 1] >= 235 && pixels[index + 2] >= 235) {
        lightPixels += 1;
      }
    }

    return visiblePixels > 0 && lightPixels / visiblePixels >= .85;
  } catch (_error) {
    return false;
  }
};
