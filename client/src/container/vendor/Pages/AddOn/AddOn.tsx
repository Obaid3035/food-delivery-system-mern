import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import * as AiIcons from "react-icons/ai";
import MuiDataTable from "../../../../components/MuiDataTable/MuiDataTable";
import {useDeleteAddOn, useGetAddOn} from "../../../../hooks/vendor/shop";
import Loader from "../../../../components/Loader/Loader";
import {Card} from "react-bootstrap";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import DeleteModal from "../../../../components/DeleteModal/DeleteModal";
import {successNotify} from "../../../../utils/toast";

const AddOn = () => {
    const navigate = useNavigate();
    const [id, setId] = useState<string | null>(null)
    const [show, setShow] = useState(false)
    const [pageNo, setPageNo] = useState(0)
    const {data: res, isError, isSuccess, isLoading} = useGetAddOn(pageNo);
    const { mutate, isSuccess: isDeleteSuccess, reset, isLoading: isDeleteLoading, isError: isDeleteError, data: deleteRes } = useDeleteAddOn(id!)

    const deleteAddOnHandler = (addOnId: string) => {
        setId(addOnId)
        setShow(!show)
    }

    const onDeleteSubmit = () => {
        mutate(id!)
        setShow(!show)
    }

    const columns = [
        {
            name: "ID",
            options: {
                display: false,
            },
        },
        'Title',
        'AddOn',
        {
            name: "Edit Add-On",
            options: {
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <button className={'action close_action'} onClick={() => navigate(`/vendor/create-add-on/${tableMeta.rowData[0]}`)}>
                            <AiIcons.AiOutlineIssuesClose />
                        </button>
                    )
                }
            },
        },
        {
            name: "Delete Add-On",
            options: {
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <button className={'action close_action'} onClick={() => deleteAddOnHandler(tableMeta.rowData[0])}>
                            <AiIcons.AiFillDelete />
                        </button>
                    )
                }
            },
        }
    ];



    if (isLoading || isDeleteLoading) {
        return <Loader/>
    }

    let addOn;

    if(isSuccess){
        if (res.data.data.length > 0) {
            addOn = <MuiDataTable title={'AddOn List'} data={res.data} columns={columns} page={pageNo} setPage={setPageNo} />
        } else {
            addOn = (
                <Card className={'py-3'}>
                    <p className={'text-center'}>No Add On Found</p>
                </Card>
            )
        }
    }
    if (isDeleteSuccess) {
        successNotify(deleteRes.data.message)
        reset()
    }

    if (isError || isDeleteError) {
        return <DisplayError/>
    }

    return (
        <div className='page_responsive'>
            <DeleteModal show={show} onClose={() => setShow(!show)} onSubmit={onDeleteSubmit}/>
            <div className={'d-flex justify-content-end'}>
                <button className={'btn-send px-4 mr-2 mb-4'} onClick={() =>  navigate('/vendor/create-add-on')}>Add AddOn</button>
            </div>
            <div>
                {addOn}
            </div>
        </div>
    )
}
export default AddOn;
