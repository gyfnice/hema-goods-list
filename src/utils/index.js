export const getUrlParamValue = (paramName) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(paramName);
};
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
export const stringToColor = (inputString) => {
    // Generate a hash code for the input string
    let hashCode = 0;
    for (let i = 0; i < inputString.length; i++) {
        hashCode = (hashCode << 5) - hashCode + inputString.charCodeAt(i);
    }

    // Convert the hash code to a hue value within the HSL color space
    const hue = ((hashCode % 360) + 360) % 360; // Ensure the hue is between 0 and 359

    // Define a constant saturation and lightness for bright and distinguishable colors
    const saturation = 80; // Saturation (0-100)
    const lightness = 60; // Lightness (0-100)

    // Convert the HSL values to an RGB color
    const h = hue / 60;
    const s = saturation / 100;
    const l = lightness / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h % 2) - 1));
    const m = l - c / 2;

    let r, g, b;

    if (h >= 0 && h < 1) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 1 && h < 2) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 2 && h < 3) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 3 && h < 4) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 4 && h < 5) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    // Convert the RGB values to hexadecimal format
    const rHex = Math.round((r + m) * 255)
        .toString(16)
        .padStart(2, '0');
    const gHex = Math.round((g + m) * 255)
        .toString(16)
        .padStart(2, '0');
    const bHex = Math.round((b + m) * 255)
        .toString(16)
        .padStart(2, '0');

    const colorCode = `#${rHex}${gHex}${bHex}`;

    return colorCode;
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
