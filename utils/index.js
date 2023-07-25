function replaceCookies(cookieArray, cookieString) {
    const updatedCookieArray = cookieArray.map((cookie) => {
        const matches = cookie.match(/_m_h5_tk=([^;]+)/);
        const token = matches ? matches[1] : null;

        const encMatches = cookie.match(/_m_h5_tk_enc=([^;]+)/);
        const encToken = encMatches ? encMatches[1] : null;

        return { token, encToken };
    });

    let updatedCookieString = cookieString;
    updatedCookieArray.forEach((cookieObj) => {
        if (cookieObj.token) {
            updatedCookieString = updatedCookieString.replace(
                /_m_h5_tk=([^;]+)/,
                `_m_h5_tk=${cookieObj.token}`
            );
        }
        if (cookieObj.encToken) {
            updatedCookieString = updatedCookieString.replace(
                /_m_h5_tk_enc=([^;]+)/,
                `_m_h5_tk_enc=${cookieObj.encToken}`
            );
        }
    });

    return updatedCookieString;
}
module.exports = {
    replaceCookies
};
