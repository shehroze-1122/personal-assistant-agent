export const timeDifferenceInHours = (start: string, end: string) => {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return diff / (1000 * 60 * 60);
};

export const generateColors = (count: number) => {
  const hueStep = 360 / count;
  return Array.from({ length: count }, (_, i) => {
    const hue = i * hueStep;

    // Randomize saturation and lightness for more variation
    const saturation = Math.random() * 20 + 60; // Range from 60% to 80%
    const lightness = Math.random() * 20 + 50; // Range from 50% to 70%

    return {
      background: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`, // Slightly higher opacity for better visibility
      border: `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 1)`, // Darker border for contrast
    };
  });
};
