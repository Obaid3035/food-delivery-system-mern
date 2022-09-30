import {useMutation, useQuery} from "react-query";
import axios from "axios";
import { IAuthInput, IError} from "../../interface";



export function useRegister() {
    return useMutation<any, IError, IAuthInput>(
        data => axios.post("/auth/register", data)
    )
}

export function useLogin() {
    return useMutation<any, IError, IAuthInput>(
        data => axios.post("/auth/login", data)
    )
}

export function useAuthorize(token: string) {
    return useQuery<any, IError>(
        ["/vendor/authorize", token],
        () => axios.get(`/auth/authorize/${token}`)
    )
}
