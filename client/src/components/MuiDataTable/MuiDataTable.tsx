import React from 'react';
import MUIDataTable, {FilterType} from "mui-datatables";
import {PAGINATION_LIMIT} from "../../lib/helper";


const MuiDataTable: React.FC<any> = ({data: {count, data},columns, title, page, setPage}) => {

    const changePage = (newTableState: any) => {
        setPage(newTableState.page)
    }

    const options: FilterType | any  = {
        filter: false,
        search: false,
        rowsPerPageOptions: [],
        rowsPerPage: PAGINATION_LIMIT,
        count,
        serverSide: true,
        jumpToPage: false,
        page,
        print: false,
        onTableChange:(action: string, newTableState: any) => {
            switch (action) {
                case 'changePage':
                    changePage(newTableState);
                    break;
            }
        },
        viewColumns: false,
        responsive: 'standard',
        filterType: "checkbox",
        selectableRows: 'none',
    };

    return (
        <div>
            <MUIDataTable
                title={title}
                data={data}
                columns={columns}
                options={options}
            />
        </div>
    );
};

export default MuiDataTable;
