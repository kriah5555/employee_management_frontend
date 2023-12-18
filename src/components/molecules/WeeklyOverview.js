import React, { useEffect, useState } from "react";
import { getDatesForWeek } from "../../utilities/CommonFunctions";
import WorkStationIcon from "../../static/icons/Workstation.svg";
import { t } from "../../translations/Translation";
import DeleteIcon from "../../static/icons/Delete.svg";
import CostIcon from "../../static/icons/Euro.svg";
import ContractHoursIcon from "../../static/icons/Contract.svg";
import EditShiftIcon from "../../static/icons/EditShift.png";

import Dropdown from "../atoms/Dropdown";
import PlanItem from "./PlanItem";
import CreatePlanPopup from "./CreatePlanPopup";
import { APICALL as AXIOS } from "../../services/AxiosServices";
import { DeleteWeekPlans, GetEmployeeOptionsApiUrl, GetWeeklyPlanningApiUrl } from "../../routes/ApiEndPoints";
import { ToastContainer, toast } from 'react-toastify';


export default function WeeklyOverview({ enableShifts, weekNumber, year, locId, wsIds, EmpTypeIds }) {

    // Const for days
    const days = [t('MONDAY'), t('TUESDAY'), t('WEDNESDAY'), t('THURSDAY'), t('FRIDAY'), t('SATURDAY'), t('SUNDAY')]
    const dates = getDatesForWeek(weekNumber, year)
    const [weekData, setWeekData] = useState([]);
    const [planPopup, setPlanPopup] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const [employeeId, setEmployeeId] = useState();
    const [planningDate, setPlanningDate] = useState();
    const [planWid, setPlanWid] = useState();
    const [planningDetails, setPlanningDetails] = useState([]);
    const [dropDownData, setDropDownData] = useState({});
    const [updatePlan, setUpdatePlan] = useState(false)
    const [dataRefresh, setDataRefresh] = useState(false)

    // Dummy data for shifts dropdown
    const shiftOptions = {
        1: [
            { value: '1', label: 'Shift 1' },
            { value: '2', label: 'Shift 2' },
            { value: '3', label: 'Shift 3' }
        ],
        2: [
            { value: '1', label: 'Shift 1' },
            { value: '2', label: 'Shift 2' },
            { value: '3', label: 'Shift 3' }
        ]
    }


    useEffect(() => {
        let request_Data = {
            "week_number": weekNumber,
            "year": year
        }
        let employees
        AXIOS.service(GetEmployeeOptionsApiUrl, 'POST', request_Data)
            .then((result) => {
                if (result?.success) {
                    employees = result.data
                    setEmployeeList(result.data);
                }
            })
            .catch((error) => {
                console.log(error);
            })

        // Setting the weekly plans data
        let requestData = {
            'location': locId,
            'workstations': wsIds,
            'employee_types': EmpTypeIds,
            'week': weekNumber,
            'year': year
        }

        AXIOS.service(GetWeeklyPlanningApiUrl, 'POST', requestData)
            .then((result) => {
                if (result?.success) {
                    // setWeekData(result.data);
                    let arr = []
                    result.data.map((val, i) => {
                        if (val.employee.length === 0) {
                            // addNewRow(val.workstation_id, i === 0 ? result.data : [])
                            val.employee = [{
                                employee_name: <Dropdown options={employees} onSelectFunction={(e) => setEmployeeId(e.value)}></Dropdown>,
                                // employee_id: employeeId,
                                total: '',
                                plans: [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }]
                            }]
                            arr.push(val)
                        } else {
                            arr.push(val)
                        }
                    })
                    setWeekData(arr)
                }
            })
            .catch((error) => {
                console.log(error);
            })
        // let data = [
        //     {
        //         workstation_id: 1,
        //         workstation_name: 'Workstation 1',
        //         shiftOptions: shiftOptions,
        //         employees: [
        //             {
        //                 employee_id: 1,
        //                 employee_name: 'Employee 1',
        //                 total: { cost: '120', contract_hours: '30' },
        //                 plans: {
        //                     "12-12-2023": {
        //                         planning_time: ['09:00-12:00', '12:30-15:00'],
        //                         contract_hours: '8',
        //                         cost: '120'
        //                     },
        //                     "19-10-2023": {
        //                         planning_time: ['09:00-12:00', '12:30-15:00'],
        //                         contract_hours: '8',
        //                         cost: '120'
        //                     },
        //                     "22-10-2023": {
        //                         planning_time: ['09:00-12:00', '12:30-15:00'],
        //                         contract_hours: '8',
        //                         cost: '120'
        //                     },
        //                 }
        //             }
        //         ]
        //     },
        // ]
        // setWeekData(data)
    }, [dataRefresh])

    // Dummy data for weekly planning total cost and contract hours
    const totalData = [
        { cost: '124', contract_hours: '25' },
        { cost: '126', contract_hours: '30' },
        { cost: '130', contract_hours: '26' },
        { cost: '135', contract_hours: '28' },
        { cost: '111', contract_hours: '34' },
        { cost: '200', contract_hours: '44' },
        { cost: '122', contract_hours: '18' },
        { cost: '230', contract_hours: '50' },
    ]


    // Function to add new row for adding new employee
    const addNewRow = (wid, weekArrData) => {
        let week_arr = weekArrData.length === 0 ? [...weekData] : [...weekArrData]
        week_arr.map((data, index) => {
            if (data.workstation_id === wid) {
                let data_arr = { ...data }
                let emp_arr = [...data.employee]
                emp_arr.push({
                    employee_name: <Dropdown options={employeeList} onSelectFunction={(e) => setEmployeeId(e.value)}></Dropdown>,
                    // employee_id: employeeId,
                    total: '',
                    plans: [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }]
                })
                data_arr.employee = emp_arr
                week_arr[index] = data_arr
            }
        })
        setWeekData(week_arr)
    }

    // Function to delete plan row for adding new employee
    const removeRow = (wid, row_index, eid) => {
        if (row_index !== 0) {
            let week_arr = [...weekData]
            weekData.map((data, index) => {
                if (data.workstation_id === wid) {
                    let data_arr = { ...data }
                    let emp_arr = [...data.employee]
                    emp_arr.splice(row_index, 1)
                    data_arr.employee = emp_arr
                    week_arr[index] = data_arr
                }
            })
            setWeekData(week_arr)

            let requestData = {
                "employee_id": eid,
                "location_id": locId,
                "workstation_id": wid,
                "week": weekNumber,
                "year": year
            }

            AXIOS.service(DeleteWeekPlans, 'POST', requestData)
                .then((result) => {
                    if (result?.success) {
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

    }

    // Function to return total data element
    const getTotalData = (index, data) => {
        return (
            <td key={data.cost} className={index === 7 ? " border-0" : "px-2"}>
                <div className="d-flex justify-content-between">
                    <small><img src={CostIcon} className="plan-icon mr-1"></img>{data.cost}</small>
                    <small><img src={ContractHoursIcon} className="plan-icon mr-1"></img>{data.contract_hours}</small>
                </div>
            </td>
        )
    }

    const openCreatePlanPopup = (eid, date, ws, planData) => {
        if (eid) { setEmployeeId(eid); setPlanPopup(true); }

        setPlanningDate(date)
        setPlanWid(ws);

        if (planData && planData[date] !== undefined) {
            setDropDownData({
                'employee_type': planData[date]['employee_type'],
                'function': planData[date]['function']
            })
            planData[date]['planning'].map((val) => {
                val['start_time'] = val.timings.split(' ')[0]
                val['end_time'] = val.timings.split(' ')[1]
            })
        }
        setPlanningDetails(planData && planData[date] !== undefined ? planData[date]['planning'] : [])
        setUpdatePlan(planData && planData[date] !== undefined ? true : false)
    }


    return (
        <div className="col-md-12 p-0 text-center">
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
            {planPopup && <CreatePlanPopup setPlanPopup={setPlanPopup} wid={planWid} employeeId={employeeId} planningDate={planningDate} locId={locId} planData={planningDetails} dropDownData={dropDownData} updatePlan={updatePlan} dataRefresh={dataRefresh} setDataRefresh={setDataRefresh}></CreatePlanPopup>}
            <table className="table table-bordered mb-0">
                <thead className="sticky">
                    <tr>
                        <th><img className="shortcut-icon" src={WorkStationIcon}></img></th>
                        <th className="py-4">Employees</th>
                        {days.map((val, index) => {
                            return (
                                <th key={val}>
                                    <div>{val}</div>
                                    <div>{dates[index]}</div>
                                </th>
                            )
                        })}
                        <th className="py-4">Total</th>
                        <th className="py-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        weekData.map((ws, index) => {
                            return (
                                ws.employee.map((ws_employee, ws_emp_index) => {
                                    return (
                                        <tr key={ws_employee.employee_name}>
                                            {/* Workstation column data */}
                                            {ws_emp_index === 0 && <td key={ws.workstation_id} className="justify-content-center py-3" rowSpan={ws.employee.length}>
                                                <p className="mb-0">{ws.workstation_name}</p>
                                                <h2 className="pointer" onClick={() => addNewRow(ws.workstation_id, [])}>+</h2>
                                                {enableShifts && <div className="row m-0 justify-content-center p-0">
                                                    <Dropdown
                                                        CustomStyle="p-0"
                                                        options={shiftOptions[ws.workstation_id]}
                                                    ></Dropdown>
                                                    <img className="shortcut-icon ml-2" src={EditShiftIcon}></img>
                                                </div>}
                                            </td>}
                                            {/* Employee and plan data rows */}
                                            <td>{ws_employee.employee_name}</td>
                                            <PlanItem PlansData={ws_employee.plans} wid={ws.workstation_id} Dates={dates} employeeId={ws_employee.employee_id !== undefined ? ws_employee.employee_id : employeeId} openCreatePlanPopup={openCreatePlanPopup}></PlanItem>
                                            <td>
                                                <div className="d-flex mt-3 justify-content-between">
                                                    {ws_employee.total.cost && <small>
                                                        <img src={CostIcon} className="plan-icon mr-1"></img>
                                                        {ws_employee.total.cost}
                                                    </small>}
                                                    {ws_employee.total.contract_hours && <small>
                                                        <img src={ContractHoursIcon} className="plan-icon mr-1"></img>
                                                        {ws_employee.total.contract_hours}
                                                    </small>}
                                                </div>
                                            </td>
                                            <td>
                                                <img className="shortcut-icon" onClick={() => removeRow(ws.workstation_id, ws_emp_index, ws_employee.employee_id)} src={DeleteIcon}></img>
                                            </td>
                                        </tr>
                                    )
                                })
                            )
                        })
                    }
                    {/* Below code is to display total data at the bottom row */}
                    <tr>
                        <td className="border-0">Total</td>
                        <td className="border-0"></td>
                        {
                            totalData.map((data, index) => {
                                return (getTotalData(index, data))
                            })
                        }
                        <td className="border-0"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
