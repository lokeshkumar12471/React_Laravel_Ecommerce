export const getAuthData = () => {
    const results = localStorage.getItem('auth_token');
    return {
        isAuthenticated: !!results,
    };
};