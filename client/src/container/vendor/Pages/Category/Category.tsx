import React, {useState} from 'react';
import "./Category.css"
import {useNavigate} from "react-router-dom";
import * as AiIcons from "react-icons/ai";
import MuiDataTable from "../../../../components/MuiDataTable/MuiDataTable";
import Loader from '../../../../components/Loader/Loader';
import {useDeleteCategory, useGetCategory} from "../../../../hooks/vendor/shop";
import {successNotify} from "../../../../utils/toast";
import DeleteModal from "../../../../components/DeleteModal/DeleteModal";
import {Card} from "react-bootstrap";
import DisplayError from "../../../../components/DisplayError/DisplayError";

const Category = () => {

    const navigate = useNavigate();

    const [id, setId] = useState<string | null>(null)

    const [show, setShow] = useState(false)

    const [pageNo, setPageNo] = useState(0)

    const { mutate, isSuccess: isDeleteSuccess, reset, isLoading: isDeleteLoading, isError: isDeleteError, data: deleteRes } = useDeleteCategory(id!)

    const deleteCategoryHandler = (id: string) => {
        setId(id)
        setShow(!show)
    }

    const onDeleteSubmit = () => {
        mutate(id!)
        setShow(!show)
    }

    const {data: res, isError, isSuccess, isLoading} = useGetCategory(pageNo);


    const columns = [
        {
            name: "ID",
            options: {
                display: false,
            },
        },
        'Title',
        {
            name: "Edit Category",
            options: {
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <button className={'action close_action'} onClick={() => navigate(`/vendor/create-category/${tableMeta.rowData[0]}`)}>
                            <AiIcons.AiOutlineIssuesClose/>
                        </button>
                    )
                }
            },
        },
        {
            name: "Delete Category",
            options: {
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <button className={'action close_action'} onClick={() => deleteCategoryHandler(tableMeta.rowData[0])}>
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

    let category;
    if(isSuccess){
        if (res.data.data.length > 0) {
            category = <MuiDataTable title={'Category List'} data={res.data} columns={columns} page={pageNo} setPage={setPageNo} />
        } else {
            category = (
                <Card className={'py-3'}>
                    <p className={'text-center'}>No Category Found</p>
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
                <button className={'btn-send px-4 mr-2 mb-4'} onClick={() => navigate('/vendor/create-category')}>Add Category</button>
            </div>

            <div>
                {category}
            </div>
        </div>
    );
};
export default Category;
