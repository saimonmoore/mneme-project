import { User } from "../domain/User/User";
import { useMutation } from "@tanstack/react-query";

const signup = async (user: User) => {
    try {
        // Perform some async operation to signup
        return new Promise((resolve) => resolve(user));
    } catch (error: unknown) {
        throw new Error((error as Error).message);
    }
};

export const SignupAction = () => {
    // Perform some async operation to signup
    return useMutation({ mutationFn: async (user: User) => signup(user) });
};