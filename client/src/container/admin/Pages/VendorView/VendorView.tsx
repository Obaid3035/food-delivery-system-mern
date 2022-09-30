import React, {useState} from 'react';
import MuiDataTable from "../../../../components/MuiDataTable/MuiDataTable";
import * as AiIcons from 'react-icons/ai'
import {Card, Tab, Tabs} from "react-bootstrap";
import "./VendorView.css";
import {
    useGetActiveVendors,
    useGetAllVendors,
    useGetInActiveVendors,
    useToActiveVendors,
    useToInActiveVendors
} from "../../../../hooks/admin/vendor";
import Loader from "../../../../components/Loader/Loader";
import DisplayError from "../../../../components/DisplayError/DisplayError";
import {successNotify} from "../../../../utils/toast";
import { useNavigate } from "react-router-dom";

enum VENDOR_KEY {
    ALL_VENDORS = "AllVendors",
    ACTIVE_VENDORS = "ActiveVendors",
    IN_ACTIVE_VENDORS = "InActiveVendors"
}

const VendorView = () => {
    const navigation = useNavigate();
    const [key, setKey] = useState<string>(VENDOR_KEY.ALL_VENDORS);
    let vendors;
    const [allVendorsPageNo, setAllVendorsPageNo] = useState(0)
    const [activeVendorsPageNo, setActiveVendorsPageNo] = useState(0)
    const [inActiveVendorsPageNo, setInActiveVendorsPageNo] = useState(0)

    const columns = [{
        name: "ID",
        options: {
            display: false,
        }
    },
        'ShopName',
        'ShopAddress',
        'Status',
        {
            name: "Actions",
            options: {
                display: key === VENDOR_KEY.ACTIVE_VENDORS,
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <button className={'action close_action'} onClick={() => toInActive(tableMeta.rowData[0])}>
                            <AiIcons.AiFillCheckSquare/>
                        </button>
                    )
                }
            }
        },

        {
            name: "Actions",
            options: {
                display: key === VENDOR_KEY.IN_ACTIVE_VENDORS,
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action close_action'} onClick={() => toActive(tableMeta.rowData[0])}>
                            <AiIcons.AiFillCheckSquare/>
                        </button>
                    )
                }
            }
        },
    ];

    const {
        mutate: toActive,
        isLoading: isActive,
        isSuccess: activeSuccess,
        data: activeRes,
        reset: activeReset
    } = useToActiveVendors()

    const {
        mutate: toInActive,
        isLoading: isInActive,
        isSuccess: inActiveSuccess,
        data: inActiveRes,
        reset: inActiveReset
    } = useToInActiveVendors()

    const {
        data: allVendors,
        isLoading: allVendorsLoading,
        isSuccess: allVendorsSuccess,
        isError: allVendorsError
    } = useGetAllVendors(allVendorsPageNo)

    const {
        data: activeVendors,
        isLoading: activeVendorsLoading,
        isSuccess: activeVendorsSuccess,
        isError: activeVendorsError
    } = useGetActiveVendors(activeVendorsPageNo)

    const {
        data: inActiveVendors,
        isLoading: inActiveVendorsLoading,
        isSuccess: inActiveVendorsSuccess,
        isError: inActiveVendorsError
    } = useGetInActiveVendors(inActiveVendorsPageNo)

    if (allVendorsLoading || activeVendorsLoading || inActiveVendorsLoading || isActive || isInActive) {
        return <Loader/>
    }

    if (allVendorsError || activeVendorsError || inActiveVendorsError) {
        return <DisplayError/>
    }

    function resourceTable(resource: any, page: number, setPage: any, columns: any) {
        if (resource.data.data.length > 0) {
            return <MuiDataTable title="Total Vendors" data={resource.data} columns={columns}
                                 page={page} setPage={setPage}/>
        }
        return (
            <Card className={'py-3'}>
                <p className={'text-center'}>No Vendors Found</p>
            </Card>
        )
    }

    if (allVendorsSuccess || activeVendorsSuccess || inActiveVendorsSuccess) {
        vendors = (
            <Tabs
                activeKey={key}
                onSelect={(k) => {
                    if (k) {
                        setKey(k)
                    }
                }}
                className="mb-3 tabs"
            >
                <Tab eventKey={VENDOR_KEY.ALL_VENDORS} title="All Vendors" className={'w-100'}>
                    {resourceTable(allVendors, allVendorsPageNo, setAllVendorsPageNo, columns)}
                </Tab>

                <Tab eventKey={VENDOR_KEY.ACTIVE_VENDORS} title='Active Vendors' className={'w-100'}>
                    {resourceTable(activeVendors, activeVendorsPageNo, setActiveVendorsPageNo, columns)}
                </Tab>
                <Tab eventKey={VENDOR_KEY.IN_ACTIVE_VENDORS} title='In Active Vendors' className={'w-100'}>
                    {resourceTable(inActiveVendors, inActiveVendorsPageNo, setInActiveVendorsPageNo, columns)}
                </Tab>
            </Tabs>
        )
    }

    if (activeSuccess) {
        successNotify(activeRes.data.message);
        activeReset()
    }

    if (inActiveSuccess) {
        successNotify(inActiveRes.data.message);
        inActiveReset()
    }


    return (
        <div className={'page_responsive'}>
            {vendors}
        </div>
    );
};

export default VendorView;
