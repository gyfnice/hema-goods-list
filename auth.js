let Cookie = '';

const getCookie = () => {
  return Cookie || process.env.MY_COOKIE;
}
const setCookie = (val) => {
  Cookie = val;
}
module.exports = {
  getCookie,
  setCookie
};