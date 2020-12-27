const getSortingItem = (term, isActive = false) => {
  return {
    term,
    isActive
  };
};

export const getSortingItems = () => {
  return [
    getSortingItem(`default`, true),
    getSortingItem(`date`),
    getSortingItem(`rating`)
  ];
};
