import {useMutation, useQuery, useQueryClient} from "react-query";
import {IError} from "../../interface";
import axios from "axios";
import {getTokenFormat, PAGINATION_LIMIT} from "../../lib/helper";
import { ICategory } from "../../container/vendor/Pages/Category/CreateCategory/CreateCategory";


// Shop
export function useCreateShop() {
    return useMutation<any, IError, any>(
        data => axios.post("/vendor/shops", data, getTokenFormat())
    )
}

export function useUpdateShop() {
    const queryClient = useQueryClient()
    return useMutation<any, IError, any>(
        ["/vendor/shops"],
        data => axios.put(`/vendor/shops`, data, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries("/vendor/shops")
            }
        }
    )
}

export function useGetShop() {
    return useQuery<any, IError>(
        ["/vendor/shops"],
        () => axios.get(`/vendor/shops`, getTokenFormat())
    )
}

export function useCreateCategory() {
    return useMutation<any, IError, ICategory>(
        data => axios.post("/vendor/category", data, getTokenFormat())
    )
}

export function useGetCategory(pageNo: number) {
    return useQuery<any, IError>(
        ["/vendor/category", pageNo],
        () => axios.get(`/vendor/category?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useEditCategory(id: string) {
    return useMutation<any, IError, ICategory>(
        ["/vendor/category", id],
        (data) => axios.put(`/vendor/category/${id}`, data, getTokenFormat())
    )
}


export function useDeleteCategory(id: string) {
    const queryClient = useQueryClient()
    return useMutation<any, IError, string>(
        ["/vendor/category", id],
        () => axios.delete(`/vendor/category/${id}`, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries("/vendor/category")
            }
        }
    )
}

export function useGetAddOn(pageNo: number) {
    return useQuery<any, IError>(
        ["/vendor/add-on", pageNo],
        () => axios.get(`/vendor/add-on?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}


export function useCreateAddOn() {
    return useMutation<any, IError, any>(
        data => axios.post("/vendor/add-on", data, getTokenFormat())
    )
}

export function useEditAddOn(id: string) {
    return useMutation<any, IError, any>(
        ["/vendor/add-on", id],
        data => axios.put(`/vendor/add-on/${id}`, data, getTokenFormat())
    )
}

export function useDeleteAddOn(id: string) {
    const queryClient = useQueryClient()
    return useMutation<any, IError, string>(
        ["/vendor/add-on", id],
        () => axios.delete(`/vendor/add-on/${id}`, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries("/vendor/add-on")
            }
        }
    )
}


// MENU TYPE

export function useGetMenuType(pageNo: number) {
    return useQuery<any, IError>(
        ["/vendor/menu-types", pageNo],
        () => axios.get(`/vendor/menu-types?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useCreateMenuType() {
    return useMutation<any, IError, any>(
        data => axios.post("/vendor/menu-types", data, getTokenFormat())
    )
}

export function useEditMenuType(id: string) {
    return useMutation<any, IError, any>(
        ["/vendor/menu-types", id],
        data => axios.put(`/vendor/menu-types/${id}`, data, getTokenFormat())
    )
}

export function useDeleteMenuType(id: string) {
    const queryClient = useQueryClient()
    return useMutation<any, IError, string>(
        ["/vendor/menu-types", id],
        () => axios.delete(`/vendor/menu-types/${id}`, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries("/vendor/menu-types")
            }
        }
    )
}

// ProductSection

export function useGetProduct(pageNo: number) {
    return useQuery<any, IError>(
        ["/vendor/products", pageNo],
        () => axios.get(`/vendor/products?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useCreateProduct() {
    return useMutation<any, IError, any>(
        data => axios.post("/vendor/products", data, getTokenFormat())
    )
}

export function useEditProduct(id: string) {
    return useMutation<any, IError, any>(
        data => axios.put(`/vendor/products/${id}`, data, getTokenFormat())
    )
}

export function useDeleteProduct(id: string) {
    const queryClient = useQueryClient()
    return useMutation<any, IError, string>(
        ["/vendor/products", id],
        () => axios.delete(`/vendor/products/${id}`, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries("/vendor/products")
            }
        }
    )
}

//Gallery

export function useGetGallery() {
    return useQuery<any, IError>(
        ["/vendor/gallery"],
        () => axios.get(`/vendor/gallery`, getTokenFormat())
    )
}


export function useUploadMainImage() {
    const queryClient = useQueryClient()
    return useMutation<any, IError, any>(
        ["/vendor/gallery-main"],
        data => axios.put(`/vendor/gallery-main`, data, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries("/vendor/gallery")
            }
        }
    )
}

export function useUploadBannerImage() {
    const queryClient = useQueryClient()
    return useMutation<any, IError, any>(
        ["/vendor/gallery-banner"],
        data => axios.put(`/vendor/gallery-banner`, data, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries("/vendor/gallery")
            }
        }
    )
}

// Reviews

export function useGetReview(pageNo: number) {
    return useQuery<any, IError>(
        ["/vendor/reviews", pageNo],
        () => axios.get(`/vendor/reviews?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}


// Dashboard

export function useGetDashboard() {
    return useQuery<any, IError>(
        ["/vendor/dashboard"],
        () => axios.get(`/vendor/dashboard`, getTokenFormat())
    )
}

// Orders


export function useGetAllOrders(pageNo: number) {
    return useQuery<any, IError>(
        ["/vendor/orders-all", pageNo],
        () => axios.get(`/vendor/orders-all?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useGetUnderApprovalOrders(pageNo: number) {
    return useQuery<any, IError>(
        ["/vendor/orders-under-approval", pageNo],
        () => axios.get(`/vendor/orders-under-approval?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useGetInProgressOrders(pageNo: number) {
    return useQuery<any, IError>(
        ["/vendor/orders-in-progress", pageNo],
        () => axios.get(`/vendor/orders-in-progress?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useGetCompletedOrders(pageNo: number) {
    return useQuery<any, IError>(
        ["/vendor/orders-completed", pageNo],
        () => axios.get(`/vendor/orders-completed?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useGetRejectedOrders(pageNo: number) {
    return useQuery<any, IError>(
        ["/vendor/orders-rejected", pageNo],
        () => axios.get(`/vendor/orders-rejected?size=${PAGINATION_LIMIT}&page=${pageNo}`, getTokenFormat())
    )
}

export function useToAcceptedOrder() {
    const queryClient = useQueryClient()
    return useMutation<any, IError, any>(
        ["/vendor/orders/accepted/"],
        (id) => axios.put(`/vendor/orders/accepted/${id}`, id, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries(`/vendor/orders-all`)
                queryClient.refetchQueries(`/vendor/orders-in-progress`)
                queryClient.refetchQueries(`/vendor/orders-under-approval`)
            }
        }
    )
}

export function useToRejectedOrder() {
    const queryClient = useQueryClient()
    return useMutation<any, IError, any>(
        ["/vendor/orders/rejected/"],
        (id) => axios.put(`/vendor/orders/rejected/${id}`, id, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries(`/vendor/orders-all`)
                queryClient.refetchQueries(`/vendor/orders-rejected`)
                queryClient.refetchQueries(`/vendor/orders-under-approval`)
            }
        }
    )
}
export function useToCompletedOrder() {
    const queryClient = useQueryClient()
    return useMutation<any, IError, any>(
        ["/vendor/orders/completed/"],
        (id) => axios.put(`/vendor/orders/completed/${id}`, id, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries(`/vendor/orders-all`)
                queryClient.refetchQueries(`/vendor/orders-completed`)
                queryClient.refetchQueries(`/vendor/orders-in-progress`)
            }
        }
    )
}

export function useGetSubscription() {
    return useQuery<any, IError>(
        ["/vendor/subscription"],
        () => axios.get(`/vendor/subscription`, getTokenFormat())
    )
}

export function useDeleteSubscription() {
    const queryClient = useQueryClient()
    return useMutation<any, IError, any>(
        ["/vendor/subscription/cancel"],
        () => axios.put(`/vendor/subscription/cancel`, null,  getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries(`/vendor/subscription`)
            }
        }
    )
}
