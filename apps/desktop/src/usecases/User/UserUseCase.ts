import { SignupAction } from "@mneme/desktop/adapters/User/UserAdapter";

export const useSignup = () => {
    const signup = SignupAction();

    const { data, isPending: loading, error } = signup;

    return {
        signup: signup.mutate,

        data,
        loading,
        error,
    };
};