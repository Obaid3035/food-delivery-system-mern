import {useMutation, useQuery, useQueryClient} from "react-query";
import {IError} from "../../interface";
import axios from "axios";
import {getTokenFormat, PAGINATION_LIMIT} from "../../lib/helper";

export function useGetAllVendors(pageNo: number) {
    return useQuery<any, IError>(
        ["/admin/vendors", pageNo],
        () => axios.get(`/admin/vendors?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}


export function useGetActiveVendors(pageNo: number) {
    return useQuery<any, IError>(
        ["/admin/vendors/active", pageNo],
        () => axios.get(`/admin/vendors/active?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useGetInActiveVendors(pageNo: number) {
    return useQuery<any, IError>(
        ["/admin/vendors/inactive", pageNo],
        () => axios.get(`/admin/vendors/inactive?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useToActiveVendors() {
    const queryClient = useQueryClient()
    return useMutation<any, IError, any>(
        ["/admin/vendors/active"],
        (id) => axios.put(`/admin/vendors/active/${id}`, id, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries(`/admin/vendors/inactive`)
                queryClient.refetchQueries(`/admin/vendors/active`)
                queryClient.refetchQueries(`/admin/vendors`)
            }
        }
    )
}

export function useToInActiveVendors() {
    const queryClient = useQueryClient()
    return useMutation<any, IError, any>(
        ["/admin/vendors/inactive"],
        (id) => axios.put(`/admin/vendors/inactive/${id}`, id, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries(`/admin/vendors/inactive`)
                queryClient.refetchQueries(`/admin/vendors/active`)
                queryClient.refetchQueries(`/admin/vendors`)
            }
        }
    )
}

export function useGetAllCustomers(pageNo: number) {
    return useQuery<any, IError>(
        ["/admin/customers", pageNo],
        () => axios.get(`/admin/customers?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useGetRejectedOrders(pageNo: number) {
    return useQuery<any, IError>(
        ["/admin/orders/rejected", pageNo],
        () => axios.get(`/admin/orders/rejected?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useRefundOrder() {
    const queryClient = useQueryClient()
    return useMutation<any, IError, any>(
        ["/admin/orders/refund"],
        (id) => axios.put(`/admin/orders/refund/${id}`, id, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries(`/admin/orders/rejected`)
            }
        }
    )
}

export function useAdminDashboard() {
    return useQuery<any, IError>(
        ["/admin/dashboard"],
        () => axios.get(`/admin/dashboard`, getTokenFormat()),

    )
}

export function useAdminSubscription(pageNo: number) {
    return useQuery<any, IError>(
        ["/admin/vendors/subscription", pageNo],
        () => axios.get(`/admin/vendors/subscription?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

