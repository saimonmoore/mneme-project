import { User } from "@mneme/desktop/domain/User/User";
import { useMutation } from "@tanstack/react-query";
import { Mneme } from '@mneme/desktop/infrastructure/pear/backend';

console.log('Got Mneme in desktop...', { Mneme });

const signup = async (user: User) => {
    try {
        // Perform some async operation to signup
        // Sleep for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1500));

        return new Promise((resolve, reject) => {
            // Reject 50% of the times
            if (Math.random() > 0.75) {
                reject(new Error("userName already exists"));
            }
            resolve(user);
        });
    } catch (error: unknown) {
        throw new Error((error as Error).message);
    }
};

export const SignupAction = () => {
    // Perform some async operation to signup
    return useMutation({ mutationFn: async (user: User) => signup(user) });
};