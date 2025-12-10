export const handleError = (error) => {
    console.error(error);
    const message =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred.';
    // Using toast from react-toastify; ensure it's imported where used.
    // This function does not import toast directly to keep it generic.
    return message;
};
