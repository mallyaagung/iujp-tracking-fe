export const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
