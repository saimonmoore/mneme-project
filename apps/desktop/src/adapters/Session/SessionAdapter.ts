import { Login } from "@mneme/desktop/domain/Login/Login";
import { useMutation } from "@tanstack/react-query";
import { Mneme } from "@mneme/core";
import { useMneme } from "@mneme/core-web";

const doLogin = async (login: Login, mneme: Mneme) => {
    try {
        return await mneme.login(login.email, login.password);
    } catch (error: unknown) {
        throw new Error((error as Error).message);
    }
};

export const LoginAction = () => {
    const { mneme } = useMneme();

    return useMutation({ mutationFn: async (login: Login) => doLogin(login, mneme!) });
};