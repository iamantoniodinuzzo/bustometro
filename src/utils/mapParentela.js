// Mappa coefficiente parentela → categoria stats
export const mapParentela = (coeff) => {
  if (coeff === 2.0) return 'genitori';
  if (coeff === 1.5) return 'fratelli';
  if (coeff === 1.2) return 'cugini';
  return 'amici';
};
