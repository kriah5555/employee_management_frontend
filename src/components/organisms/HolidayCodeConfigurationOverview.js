import React, { useEffect, useState } from "react";
import Table from "../atoms/Table";
import AddIcon from "../../static/icons/add.png";
import { useNavigate, useParams } from "react-router-dom";
import { HolidayCodeApiUrl } from "../../routes/ApiEndPoints";
import { APICALL as AXIOS } from "../../services/AxiosServices"
import BackIcon from "../../static/icons/BackIcon.png";
import ManageSalaries from "../molecules/ManageSalaries";
import { ToastContainer, toast } from 'react-toastify';
import ModalPopup from "../../utilities/popup/Popup";

export default function HolidayCodeConfigurationOverview() {

    const navigate = useNavigate();
    let params = useParams();
    let overviewContent = params.type
    const [dataRefresh, setDataRefresh] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [deleteUrl, setDeleteUrl] = useState('');


    // Header data for Holiday code
    const holiday_code_headers = [
        {
            title: 'title',
            field: 'holiday_code_name',
            size: 200,
        },
        {
            title: 'Description',
            field: 'description',
            size: 200,
        },
        {
            title: 'Internal Code',
            field: 'internal_code',
            size: 200,
        },
        {
            title: 'Status',
            field: 'status',
            size: 200,
        },
    ]

    const [headers, setHeaders] = useState(holiday_code_headers);
    const [listData, setListData] = useState([]);
    const [title, setTitle] = useState('Manage holiday code');
    const [addTitle, setAddTitle] = useState('Add holiday code');
    const [addUrl, setAddUrl] = useState('/add-holiday-code');

    useEffect(() => {
        let apiUrl;
        // Header data for Function overview
        if (overviewContent === 'holiday_code') {
            apiUrl = HolidayCodeApiUrl
            setHeaders(holiday_code_headers); setTitle('Manage holiday code'); setAddTitle('Add holiday code'); setAddUrl('/add-holiday-code');
        }

        // Api call to get list data
        AXIOS.service(apiUrl, 'GET')
            .then((result) => {
                if (result?.success) {
                    setListData(result.data);
                }
            })
            .catch((error) => {
                console.log(error);
            })

    }, [overviewContent, dataRefresh])


    // Api call to delete item from table
    const DeleteApiCall = () => {
        // APICall for create and updation of employee types
        AXIOS.service(deleteUrl, 'DELETE')
            .then((result) => {
                if (result?.success) {
                    setDataRefresh(!dataRefresh);
                    setWarningMessage('')
                    toast.success(result.message[0], {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // Function for onclick of actions in the overview tables
    const viewAction = (data, action) => {
        if (action === 'delete') {
            setWarningMessage('Are you sure you want to delete this item?')
        }
        if (overviewContent === 'holiday_code') {
            if (action === 'edit') {
                navigate('/add-holiday-code/' + data.id)
            } else {
                setDeleteUrl(HolidayCodeApiUrl + '/' + data.id)
            }

        }
    }

    return (
        <div className="right-container">
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {warningMessage && <ModalPopup
                title={('WARNING')}
                body={(warningMessage)}
                onConfirm={DeleteApiCall}
                onHide={() => setWarningMessage('')}
            ></ModalPopup>}
            {/* All configurations */}
            <div className="company-tab-width mt-3 border bg-white">
                <div className={"d-flex col-md-12 justify-content-between py-3 border-thick"}>
                    <h4 className="text-color mb-0"><img className="shortcut-icon mr-2 mb-1" onClick={() => navigate("/configurations")} src={BackIcon}></img>{title}</h4>
                    <div className="row m-0">
                        {addTitle && <p className="text-color mb-0 pointer" onClick={() => navigate(addUrl)}>
                            <img src={AddIcon} className="header-icon mr-1"></img>{addTitle}
                        </p>}
                    </div>
                </div>
                <div className="tablescroll">
                    <Table columns={headers} rows={listData} setRows={setListData} tableName={'function'} viewAction={viewAction} height={'calc(100vh - 162px)'} ></Table>
                </div>
            </div>
        </div>

    )
}
