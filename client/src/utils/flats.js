export const generateFlats = () => {
  const flats = [];
  const blocks8 = ['A', 'B', 'C', 'D', 'E', 'F', 'EWS'];
  const blocks4 = ['G', 'H'];

  blocks8.forEach(block => {
    for (let floor = 1; floor <= 8; floor++) {
      for (let flat = 1; flat <= 8; flat++) {
        flats.push(`${block}-${floor}0${flat}`);
      }
    }
  });

  blocks4.forEach(block => {
    for (let floor = 1; floor <= 8; floor++) {
      for (let flat = 1; flat <= 4; flat++) {
        flats.push(`${block}-${floor}0${flat}`);
      }
    }
  });

  return flats;
};

export const SOCIETY_FLATS = generateFlats();
