import { Login } from "@mneme/desktop/domain/Login/Login";
import { useMutation } from "@tanstack/react-query";

const doLogin = async (login: Login) => {
    try {
        // Perform some async operation to login
        // Sleep for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1500));

        return new Promise((resolve, reject) => {
            // Reject 50% of the times
            if (Math.random() > 0.75) {
                reject(new Error("Unable to login user. Please try again."));
            }
            resolve(login);
        });
    } catch (error: unknown) {
        throw new Error((error as Error).message);
    }
};

export const LoginAction = () => {
    // Perform some async operation to login
    return useMutation({ mutationFn: async (login: Login) => doLogin(login) });
};