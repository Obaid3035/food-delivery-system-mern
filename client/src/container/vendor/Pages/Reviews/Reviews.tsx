import React, {useState} from 'react';
import RatingStar from "../../../../components/RatingStar/RatingStar";
import MuiDataTable from "../../../../components/MuiDataTable/MuiDataTable";
import {useGetReview} from "../../../../hooks/vendor/shop";
import Loader from "../../../../components/Loader/Loader";
import {Card} from "react-bootstrap";
import DisplayError from "../../../../components/DisplayError/DisplayError";

const Reviews = () => {
    const [pageNo, setPageNo] = useState(0)
    const columns = [{
        name: "ID",
        options: {
            display: false,
        }
    },
        'customer Name',
        'Comments',
        {
            name: "Rating",
            options: {
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <RatingStar avgRating={value} />
                    )
                }
            }
        },
    ];

    const {data: res, isError, isSuccess, isLoading} = useGetReview(pageNo);



    if (isLoading) {
        return <Loader/>
    }

    if (isError) {
        return <DisplayError/>
    }


    let reviews;
    if(isSuccess){
        if (res.data.data.length > 0) {
            reviews = <MuiDataTable title={'Review List'} data={res.data} columns={columns} page={pageNo} setPage={setPageNo} />
        } else {
            reviews = (
                <Card className={'py-3'}>
                    <p className={'text-center'}>No Review Found</p>
                </Card>
            )
        }
    }

    return (
        <div className={'page_responsive'}>
            {reviews}
        </div>
    );
};

export default Reviews;
