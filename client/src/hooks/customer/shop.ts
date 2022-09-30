import {useMutation, useQuery, useQueryClient} from "react-query";
import {ICoordinates, IError} from "../../interface";
import axios from "axios";
import {getTokenFormat, PAGINATION_LIMIT} from "../../lib/helper";


export function useGetShops(coordinate: ICoordinates, isParams: boolean, pageNo: number) {
    return useQuery<any, IError>(
        [`/shops?lat=${coordinate.lat}&lng=${coordinate.lng}&size=${PAGINATION_LIMIT}&page=${pageNo}`, `${coordinate} ${pageNo}`],
        () => axios.get(`/shops?lat=${coordinate.lat}&lng=${coordinate.lng}&size=${PAGINATION_LIMIT}&page=${pageNo}`),
        {
            enabled: isParams
        }
    )
}


export function useGetPostalShops(pageNo: number) {
    return useQuery<any, IError>(
        [`/shops/postal?size=${PAGINATION_LIMIT}&page=${pageNo}`, `${pageNo}`],
        () => axios.get(`/shops/postal?size=${PAGINATION_LIMIT}&page=${pageNo}`)
    )
}

export function useGetShopById(slug: string, isParams: boolean) {
    return useQuery<any, IError>(
        ["/shops", slug],
        () => axios.get(`/shops/${slug}`),
        {
            enabled: isParams
        }
    )
}

export function useIfOrdered(slug: string, isParams: boolean) {
    return useQuery<any, IError>(
        ["/shops/already-ordered/", slug],
        () => axios.get(`/shops/already-ordered/${slug}`, getTokenFormat()),
        {
            enabled: isParams
        }
    )
}


//Orders


export function useCreateOrder(slug: string) {
    return useMutation<any, IError, any>(
        (data) => axios.post(`/orders/${slug}`, data, getTokenFormat())
    )
}

export function useGetOrder() {
    return useQuery<any, IError>(
        ["/orders"],
        () => axios.get(`/orders`, getTokenFormat())
    )
}


// Reviews

export function useGetAllReviews(pageNo: number, slug: string) {
    return useQuery<any, IError>(
        [`/reviews/${slug}`, pageNo],
        () => axios.get(`/reviews/${slug}?size=${PAGINATION_LIMIT}&page=${pageNo}`)
    )
}

export function useCreateReview(id: string) {
    const queryClient = useQueryClient()
    return useMutation<any, IError, any>(
        ["/reviews", id],
        (data) => axios.post(`/reviews/${id}`, data, getTokenFormat()),
        {
            onSuccess: () => {
                queryClient.refetchQueries(`/orders`)
            }
        }
    )
}




