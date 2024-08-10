import { User } from "@mneme/desktop/domain/User/User";
import { useMutation } from "@tanstack/react-query";
import { Mneme } from "@mneme/core";
import { useMneme } from "@mneme/core-web";

const signup = async (user: User, mneme: Mneme) => {
    try {
        return await mneme.signup({
            email: user.email,
            userName: user.userName,
            password: user.password,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
        });
    } catch (error: unknown) {
        throw new Error((error as Error).message);
    }
};

export const SignupAction = () => {
    const { mneme } = useMneme();

    return useMutation({ mutationFn: async (user: User) => signup(user, mneme!) });
};