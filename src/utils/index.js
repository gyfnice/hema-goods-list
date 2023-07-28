export const Store = (namespace, data) => {
    if (typeof data !== 'undefined' && data !== null) {
        return localStorage.setItem(namespace, JSON.stringify(data));
    }
    const store = localStorage.getItem(namespace);
    const result = store && JSON.parse(store);
    if (result !== 'undefined' && result !== null && result !== undefined) {
        return result;
    }
    return null;
};
export const groupCopywriting = (list) => {
    const groupedObj = {};
    let copywritingArr = list.filter((item) => item);
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
};
// Function to validate the cookie name
function isValidCookieName(name) {
    // Use a regular expression to check if the name is valid
    const nameRegex = /^[a-zA-Z0-9!#$%&'*+\-.^_`|~]+$/;

    return nameRegex.test(name);
}

// Function to validate the cookie value
function isValidCookieValue(value) {
    // Use a regular expression to check if the value is valid
    const valueRegex = /^[a-zA-Z0-9!#$%&'()*+\-.^_`|~]+$/;

    return valueRegex.test(value);
}
export function validateCookieString(cookieString) {
    // Split the cookie string into individual cookies
    const cookies = cookieString.split(';');

    // Iterate through each cookie
    for (let i = 0; i < cookies.length; i++) {
        // Trim any leading or trailing whitespace
        const cookie = cookies[i].trim();

        // Split the cookie into name and value
        const [name, value] = cookie.split('=');

        // Check if the name or value is empty
        if (!name || !value) {
            return false;
        }

        // Validate the cookie name
        if (!isValidCookieName(name)) {
            return false;
        }

        // Validate the cookie value
        if (!isValidCookieValue(value)) {
            return false;
        }
    }

    // All cookies are valid
    return true;
}
