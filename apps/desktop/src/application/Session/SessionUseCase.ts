import { LoginAction } from "@mneme/desktop/adapters/Session/SessionAdapter";

export const useLogin = () => {
    const login = LoginAction();

    const { data, isPending: loading, error } = login;

    return {
        login: login.mutate,

        data,
        loading,
        error,
    };
};