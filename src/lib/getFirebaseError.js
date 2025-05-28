export const getErrorMessage = (errorCode) => {
    switch(errorCode) {
        case "auth/email-already-in-use":
            return "E-mail already in use by another account.";

        case "auth/invalid-credential":
            return "Wrong e-mail or password.";

        case "auth/weak-password":
            return "Please create a stronger password.";

        default:
            return "Uknown error. Please try again later.";

    }
}