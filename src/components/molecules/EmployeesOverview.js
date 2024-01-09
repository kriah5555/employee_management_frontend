import React, { useEffect, useState } from "react";
import Table from "../atoms/Table";
import EmployeeIcon from "../../static/icons/Profile1.jpeg"
import { ToastContainer } from 'react-toastify';
import { APICALL as AXIOS } from "../../services/AxiosServices"
import { EmployeeApiUrl } from "../../routes/ApiEndPoints";
import { toast } from 'react-toastify';
import { t } from "../../translations/Translation";


export default function EmployeesOverview({ setShowDetails, showDetails, eid, setEid }) {

    const [parentId, setParentId] = useState('');
    // const [eid, setEid] = useState('');
    const [listData, setListData] = useState([]);


    // Header data for employee overview
    const employeeHeaders = [
        {
            title: t("EMPLOYEE_TITLE"),
            field: 'employee',
            sorting: false
        },
        {
            title: t("MOBILE_NUMBER"),
            field: 'number',
            sorting: false
        },
        {
            title: t("EMAIL_ADDRESS"),
            field: 'email',
            sorting: false
        },
        {
            title: t("SSN"),
            field: 'ssn',
            sorting: false
        },
    ];

    //Header for employee list in employee details view
    const hidingHeaders = [
        {
            title: t("SEARCH_TEXT"),
            field: 'employee',
            size: 100,
        }
    ]

    const [headers, setHeaders] = useState(employeeHeaders)

    //Function to redirect to employee details page
    const viewAction = (data) => {
        setParentId(data.parentId);
        setEid(data.id);
        setShowDetails(true);
    }


    useEffect(() => {
        if (showDetails) {
            setHeaders(hidingHeaders);
        } else {
            setHeaders(employeeHeaders);
        }

    }, [showDetails])


    useEffect(() => {
        let ApiUrl = EmployeeApiUrl
        let Method = 'GET'

        AXIOS.service(ApiUrl, Method)
            .then((result) => {
                if (result?.success) {
                    let arr = []
                    result.data.map((val, index) => {
                        let group_id = "group"+index;
                        let data = {
                            employee: val.employee_type,
                            id: group_id,
                            type: 'type',
                            parentOnly: val.employee_type,
                        }
                        arr.push(data)
                        val.employees.map((emp, i) => {
                            let employee = {
                                // employee: getEmployeeWithIcon(emp.user.user_basic_details.first_name, val.employee_type),
                                employee: getEmployeeWithIcon(emp.user.user_basic_details.first_name + " " + emp.user.user_basic_details.last_name, emp.user.username, emp.id),
                                number: emp.user.user_contact_details.phone_number,
                                email: emp.user.user_contact_details.email,
                                ssn: emp.user.social_security_number,
                                id: emp.id,
                                parentId: group_id
                            }
                            arr.push(employee)

                        })
                    })

                    setListData(arr)
                } else {
                    // setErrors(result.message)
                }
            })
            .catch((error) => {
                console.log(error);
            })


    }, [])

    const showUserDetails = (id) => {
        setShowDetails(true);
        setEid(id)
    }

    //Function to render employee name with image
    const getEmployeeWithIcon = (name, username, id) => {
        return (
            <div key={id} className="row m-0" onClick={() => showUserDetails(id)}>
                {!showDetails && <div><img className="employee-icon mr-2 rounded-circle" src={EmployeeIcon}></img></div>}
                <div><h6 className="mb-0 font-inherit">{name}</h6><p className="mb-0 mt-1 font-12 text-secondary">{username}</p></div>
            </div>
        )
    }


    return (
        <>
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
            {!showDetails && <Table columns={headers} rows={listData} tableName="employee" viewAction={viewAction}></Table>}
            {showDetails && <Table columns={headers} rows={listData} tableName="employee" showDetails={showDetails} empId={eid} parentId={parentId}></Table>}

        </>
    )
}
