import { LoginAction, LogoutAction } from "@mneme/desktop/adapters/Session/SessionAdapter";

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

export const useLogout = () => {
    const logout = LogoutAction();

    const { data, isPending: loading, error } = logout;

    return {
        logout: logout.mutate,

        data,
        loading,
        error,
    };
};