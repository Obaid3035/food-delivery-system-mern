import React, {useState} from 'react';
import * as AiIcons from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import DeleteModal from "../../../../components/DeleteModal/DeleteModal";
import MuiDataTable from "../../../../components/MuiDataTable/MuiDataTable";
import {Card} from "react-bootstrap";
import {successNotify} from "../../../../utils/toast";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import Loader from "../../../../components/Loader/Loader";
import { useDeleteMenuType, useGetMenuType} from "../../../../hooks/vendor/shop";

const MenuType = () => {

    const navigate = useNavigate();

    const [id, setId] = useState<string | null>(null)

    const [show, setShow] = useState(false)

    const [pageNo, setPageNo] = useState(0)

    const {data: res, isError, isSuccess, isLoading} = useGetMenuType(pageNo);
    const { mutate, isSuccess: isDeleteSuccess, reset, isLoading: isDeleteLoading, isError: isDeleteError, data: deleteRes } = useDeleteMenuType(id!)



    const deleteMenuTypeHandler = (id: string) => {
        setId(id)
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
        {
            name: "Edit Menu Type",
            options: {
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <button className={'action close_action'} onClick={() => navigate(`/vendor/create-product-type/${tableMeta.rowData[0]}`)}>
                            <AiIcons.AiOutlineIssuesClose/>
                        </button>
                    )
                }
            },
        },
        {
            name: "Delete Menu Type",
            options: {
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <button className={'action close_action'} onClick={() => deleteMenuTypeHandler(tableMeta.rowData[0])}>
                            <AiIcons.AiFillDelete/>
                        </button>
                    )
                }
            },
        }
    ];

    if (isLoading || isDeleteLoading) {
        return <Loader/>
    }

    let menuType;
    if(isSuccess){
        if (res.data.data.length > 0) {
            menuType = <MuiDataTable title={'MenuType List'} data={res.data} columns={columns} page={pageNo} setPage={setPageNo} />
        } else {
            menuType = (
                <Card className={'py-3'}>
                    <p className={'text-center'}>No Menu Type Found</p>
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
        <div className={'page_responsive'}>
            <DeleteModal show={show} onClose={() => setShow(!show)} onSubmit={onDeleteSubmit}/>
            <div className={'d-flex justify-content-end'}>
                <button className={'btn-send px-4 mr-2 mb-4'} onClick={() => navigate('/vendor/create-product-type')}>Add Menu Type</button>
            </div>

            <div>
                {menuType}
            </div>
        </div>
    );
};

export default MenuType;
