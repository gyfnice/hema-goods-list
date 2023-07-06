export const Store = (namespace, data) => {
  if (typeof data !== "undefined" && data !== null) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }
  const store = localStorage.getItem(namespace);
  const result = store && JSON.parse(store);
  if (result !== "undefined" && result !== null && result !== undefined) {
    return result;
  }
  return null;
};
export const groupCopywriting = (copywritingArr) => {
  const groupedObj = {};

  for (let i = 0; i < copywritingArr.length; i++) {
    const matchResult = copywritingArr[i].match(/^(.*?)\(/);
    if (matchResult && matchResult[1]) {
      const key = matchResult[1];
      if (!groupedObj[key]) {
        groupedObj[key] = [];
      }
      groupedObj[key].push(copywritingArr[i]);
    }
  }

  return groupedObj;
}