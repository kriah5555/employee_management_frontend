import React, { useEffect, useState } from "react";
import EmployeeIcon from "../../static/icons/Profile1.jpeg"
import PhoneIcon from "../../static/icons/phone.svg"
import EmailIcon from "../../static/icons/Email.svg"
import EditIcon from "../../static/icons/edit-dark.svg"
import DeleteIcon from "../../static/icons/delete.png"
import RSZIcon from "../../static/icons/ID.svg"
import DownArrow from "../../static/icons/DownArrow.svg"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import EmployeeUpdate from "./EmployeeUpdate";
import CalendarLayout from "../../utilities/calendar/CalendarLayout";
import CustomButton from "../atoms/CustomButton";
import Switch from "../atoms/Switch";
import AddContractPopup from "./AddContractPopup";
import { EmployeeApiUrl, EmployeeContractApiUrl , EmployeesContractsApiUrl} from "../../routes/ApiEndPoints";
import { APICALL as AXIOS } from "../../services/AxiosServices"
import UpdateEmployeeContractDetailsForm from "./UpdateEmployeeContractDetailsForm";
import EmployeeDetailsUpdateForm from "./EmployeeDetailsUpdateForm";

export default function EmployeeDetails({ eid }) {

    const [editStatus, setEditStatus] = useState(false);
    const [toggleOpen, setToggleOpen] = useState(false);
    const [popupOpen, setOpenPopup] = useState(false);
    const [employeeContractOptions, setEmployeeContractOptions] = useState([]);
    const [basicDetails, setBasicDetails] = useState(
        {
            name: '',
            phone: '',
            email: '',
            rsz: ''
        }
    );
    const [dataLeft, setDataLeft] = useState([]);
    const [dataRight, setDataRight] = useState([])
    const [response, setResponse] = useState({})
    const [showDetails, setShowDetails] = useState(false)
    const [showAddress, setShowAddress] = useState(false)
    const [dataRefresh, setDataRefresh] = useState(false)
    const [showExtraBenifits, setShowExtraBenefits] = useState(false)
    const [exrtraBenefitsLeftData, setExtraBenefitsLefttdata] = useState([])
    const [exrtraBenefitsRightData, setExtraBenefitsRightdata] = useState([])
    const [extraBenefitsData, setExtraBenefitsData] = useState({})

    const TabsData = [
        { tabHeading: ("Personal details"), tabName: 'personal' },
        { tabHeading: ("Contract details"), tabName: 'contracts' },
        { tabHeading: ("Counters"), tabName: 'counters' },
        { tabHeading: ("Documents"), tabName: 'documents' },
        { tabHeading: ("Availability"), tabName: 'availability' },
        { tabHeading: ("Extra benefits"), tabName: 'extra_benefits' }
    ]

    const tab2Data = [
        { label: 'Employee type', value: 'Student' },
        { label: 'Sub type', value: 'Daily contract' },
        { label: 'Start date', value: '20/04/2023' },
        { label: 'End date', value: '20/07/2023' },
        // { label: 'Function name', value: 'Chef' },
        // { label: 'Minimum salary', value: '€220.10' },
        // { label: 'Salary to be paid', value: '€235.20' },
        // { label: 'Contract number', value: '12345' },
        // { label: 'Social security number', value: '84071938582' },
        // { label: 'Weekly contract hours', value: '02 days' },
        // { label: 'Work days per week', value: '02 days' },
    ]

    const functions = {
        contract_id: 0,
        functions: [
            {
                function_name: 'chef',
                min_salary: '22',
                salary_paid: '20',

            }
        ]
    }
    // Employee type data
    const tab3Data = [
        { label: 'Employee type', value: 'Student' },
        { label: 'Contract type', value: 'Daily' }
    ]

    // Counters data
    const tab4Left = [
        { label: 'Public', value: '10 days' },
        { label: 'Optional', value: '05 days' }
    ]
    const tab4Right = [
        { label: 'Total', value: '100 days' },
        { label: 'Used', value: '40 days' },
        { label: 'Remaining', value: '60 days' }
    ]

    const contracts = [
        {
            id: 0,
            name: 'Contract 01',
            employee_type: "student",
            sub_type: "worker",
            start_date: "12-12-2023",
            end_date: "",
            weekly_contract_hours: "",
            work_days_per_week: "",
            functions: [
                {
                    'function_name': "chef",
                    'minimum_salary': "€220.10",
                    'salary_to_be_paid': "€232.10",
                },
                {
                    'function_name': "Assistant",
                    'minimum_salary': "€120.10",
                    'salary_to_be_paid': "€132.10",
                },
                {
                    'function_name': "Assistant",
                    'minimum_salary': "€120.10",
                    'salary_to_be_paid': "€132.10",
                },
                {
                    'function_name': "Assistant",
                    'minimum_salary': "€120.10",
                    'salary_to_be_paid': "€132.10",
                    'weekly_contract_hours': "",
                }

            ],
            employee_type_options: [
                { value: "student", label: "Student" },
                { value: "Long term flex", label: "ltf" },
                { value: "Long term student", label: "lts" },
                { value: "Normal employee", label: "ne" }
            ],
            functions_options: [
                { value: "01", label: "Assistant" },
                { value: "02", label: "Cleaning" },
                { value: "03", label: "Cooking" },
            ]

        },
        {
            id: 1,
            name: 'Contract 02',
            employee_type: "student",
            sub_type: "servant",
            start_date: "12-12-2023",
            end_date: "",
            weekly_contract_hours: "",
            work_days_per_week: "",
            functions: [
                {
                    'function_name': "chef",
                    'minimum_salary': "€220.10",
                    'salary_to_be_paid': "€232.10",
                }
            ]
        },
    ]

    useEffect(() => {
        AXIOS.service(EmployeeContractApiUrl + '/create', 'GET')
            .then((result) => {
                if (result?.success) {
                    setEmployeeContractOptions(result.data)
                } else {
                    // setErrors(result.message)
                }
            })
            .catch((error) => {
                console.log(error);
            })

        AXIOS.service(EmployeeApiUrl + '/' + eid, 'GET')
            .then((result) => {
                if (result?.success) {
                    let basic_details = {
                        name: result.data.first_name + ' ' + result.data.last_name,
                        phone: result.data.phone_number,
                        email: result.data.email,
                        rsz: result.data.social_security_number
                    }
                    setBasicDetails(basic_details)
                    setResponse(result.data)
                    let data_left = [
                        { label: 'First name', value: result.data.first_name },
                        { label: 'Last name', value: result.data.last_name },
                        { label: 'Mobile number', value: result.data.phone_number },
                        { label: 'Email', value: result.data.email },
                        { label: 'Gender', value: result.data.gender.name },
                        { label: 'DOB', value: result.data.date_of_birth },
                        { label: 'Place of birth', value: result.data.place_of_birth },
                        { label: 'Nationality', value: result.data.nationality },
                        { label: 'Address', value: result.data.street_house_no + ", " + result.data.city + ", " + result.data.country + ", " + result.data.postal_code },

                    ]
                    let data_right = [
                        { label: 'Social security number', value: result.data.social_security_number },
                        { label: 'Expiry date', value: result.data.license_expiry_date },
                        { label: 'Bank account number', value: result.data.account_number },
                        { label: 'Language', value: result.data.language.name },
                        { label: 'Marital status', value: result.data.marital_status.name },
                        { label: 'Dependant spouse', value: result.data.dependent_spouse.name },
                        { label: 'Childrens', value: result.data.children },
                    ]
                    setDataLeft(data_left);
                    setDataRight(data_right)
                    // setBasicDetails(result.data)

                } else {
                    // setErrors(result.message)
                }
            })
            .catch((error) => {
                console.log(error);
            })

            AXIOS.service(EmployeesContractsApiUrl+"/1", 'GET')
            .then((result) => {
                if (result?.success) {
                    // setContracts(result.data)
                    console.log(result.data);
                } else {
                    // setErrors(result.message)
                }
            })
            .catch((error) => {
                console.log(error);
            })

    // }, [])
        // call api and set values 
        // AXIOS.service(EmployeeExtraBenefitsApiUrl + '/' + eid, 'GET')
        //     .then((result) => {
        //         if (result?.success) {

        let data = {
            "fuel_card": "yes",
            "company_car": "yes",
            "clothing_compensation": "2000",
            "meal_voucher_amount": "2000",
            "meal_voucher_id": "1",
            "social_secretary_number": "12345678901",
            "contract_number": "1239872321",
        }
        setExtraBenefitsData(data)

        let data_right = [
            // { label: 'Social secretary number', value: "12345678901"},
            // { label: 'Contact number', value: "1239872321" },
        ]

        let data_left = [
            { label: 'Social secretary number', value: "12345678901" },
            { label: 'Contract number', value: "1239872321" },
            { label: 'Company car', value: "yes" },
            { label: 'Company fuel card', value: "yes" },
            { label: 'Clothing componsation', value: "2000" },
            { label: 'Meal voucher', value: "Sudexo" },
            { label: 'Meal voucher amount', value: "2000" },
        ]

        setExtraBenefitsLefttdata(data_left)
        setExtraBenefitsRightdata(data_right)
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })
    }, [eid, dataRefresh])


    return (
        <div>
            {popupOpen && <AddContractPopup
                onConfirm={() => setOpenPopup(false)}
                onHide={() => setOpenPopup(false)}
                employeeContractOptions={employeeContractOptions}
            ></AddContractPopup>}

            <div className="col-md-12 row m-0 pb-1 pt-4 px-4 border-bottom">
                <img className="employee-icon rounded-circle mx-2 " src={EmployeeIcon}></img>
                <div className="width-22 px-2">
                    <p className="mb-1 font-22">{basicDetails.name}</p>
                    <p className="text-secondary font-18"></p>
                </div>
                <div className="width-22 px-2">
                    <p className="mb-1"><img className="mr-2" src={PhoneIcon}></img>{basicDetails.phone}</p>
                    <p className="mb-1"><img className="mr-2" src={EmailIcon}></img> {basicDetails.email}</p>
                </div>
                <div className="width-22 px-2">
                    <p className="mb-1"><img className="mr-2" src={RSZIcon}></img>{basicDetails.rsz}</p>
                </div>
            </div>
            <div className="col-md-12 p-0 employee-detail">
                <Tabs onSelect={() => setEditStatus(false)}>
                    <TabList>
                        {TabsData.map((val) => {
                            return (
                                <Tab key={val.tabName} >{val.tabHeading}</Tab> //selectedClassName="selected_emp_tab"
                            )
                        })}
                    </TabList>
                    <TabPanel>
                        <div className="customscroll employee-detail-height py-3 px-0 border m-3">
                            {!editStatus && <img className="float-right pr-3 pt-0" src={EditIcon} onClick={() => setShowDetails(true)}></img>}
                            {!showDetails && <EmployeeUpdate tab="tab1" edit={editStatus} setEditStatus={setEditStatus} dataLeft={dataLeft} dataRight={dataRight} setDataLeft={setDataLeft} setDataRight={setDataRight} setShowDetails={setShowDetails} ></EmployeeUpdate>}
                            {showDetails && <EmployeeDetailsUpdateForm tab="tab1" eid={eid} response={response} setShowAddress={setShowAddress} setShowDetails={setShowDetails} showAddress={showAddress} showDetails={showDetails} setDataRefresh={setDataRefresh} dataRefresh={dataRefresh} showExtraBenifits={showExtraBenifits} setShowExtraBenefits={setShowExtraBenefits}></EmployeeDetailsUpdateForm>}
                        </div>
                    </TabPanel>

                    <TabPanel>

                        <div className="customscroll employee-detail-height py-3 px-0 border m-3">
                            <div className="d-flex">
                                <CustomButton buttonName={'Create'} ActionFunction={() => setOpenPopup(true)} CustomStyle="mx-3 mb-2"></CustomButton>
                                <Switch label="Past contracts" id="switch4" styleClass="col-md-5 align-self-center row m-0" ></Switch>
                            </div>
                            {contracts.map((contract, index) => {
                                return (
                                    <div className="border shadow-sm rounded mx-3 px-2 my-2" key={contract.id}>
                                        <div className={"d-flex mx-4 mb-0 justify-content-between" + (toggleOpen === contract.id ? " border-bottom mb-2" : "")}><h5 className="pt-1">{"Contract " + (index + 1)}</h5><img className="shortcut-icon" src={DownArrow} onClick={() => { setToggleOpen(toggleOpen === contract.id ? "" : contract.id); setEditStatus(false) }}></img></div>
                                        {!editStatus && toggleOpen === contract.id && <>
                                            <img className="float-right pr-5 pt-2" src={EditIcon} onClick={() => setEditStatus(true)}></img>
                                            <img className="float-right profile-icon pr-2 pb-2" src={DeleteIcon} onClick={() => console.log()}></img>
                                        </>}
                                        {/* {toggleOpen === contract.id && <EmployeeUpdate tab="tab2" edit={editStatus} setEditStatus={setEditStatus} dataLeft={tab2Data} dataRight={[]} setDataLeft={setDataLeft} setDataRight={setDataRight} ></EmployeeUpdate>} */}
                                        {toggleOpen === contract.id && <UpdateEmployeeContractDetailsForm edit={editStatus} setEditStatus={setEditStatus} data={contract} employeeContractOptions={employeeContractOptions} setToggleOpen={setToggleOpen}></UpdateEmployeeContractDetailsForm>}
                                    </div>
                                )
                            })}
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="customscroll employee-detail-height py-3 px-0 border m-3">
                            <div className="border mx-3 px-2">
                                <div className={"d-flex mx-4 my-1 mb-0 justify-content-between" + (toggleOpen ? " border-bottom mb-2" : "")}><h4 className="pt-2">Holidays counter</h4><img className="profile-icon" src={DownArrow} onClick={() => setToggleOpen(!toggleOpen)}></img></div>
                                {!editStatus && toggleOpen && <img className="float-right pr-5 pt-2" src={EditIcon} onClick={() => setEditStatus(true)}></img>}
                                {toggleOpen && <EmployeeUpdate tab="tab3" edit={editStatus} setEditStatus={setEditStatus} dataLeft={tab3Data} dataRight={[]} setDataLeft={setDataLeft} setDataRight={setDataRight} ></EmployeeUpdate>}
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="customscroll employee-detail-height py-3 px-0 border m-3">
                            {!editStatus && <img className="float-right pr-3 pt-0" src={EditIcon} onClick={() => setEditStatus(true)}></img>}
                            <EmployeeUpdate tab="tab4" edit={editStatus} setEditStatus={setEditStatus} dataLeft={tab4Left} dataRight={tab4Right} setDataLeft={setDataLeft} setDataRight={setDataRight}></EmployeeUpdate>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="customscroll employee-detail-height py-3 px-0 border m-3">
                            {<img className="float-right pr-3 pt-0" src={EditIcon} onClick={() => setEditStatus(true)}></img>}
                            <CalendarLayout view={'availability'}></CalendarLayout>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="customscroll employee-detail-height py-3 px-0 border m-3">
                            {!editStatus && <img className="float-right pr-3 pt-0" src={EditIcon} onClick={() => { setShowExtraBenefits(true); setShowDetails(false); setShowAddress(false) }}></img>}
                            {!showExtraBenifits && <EmployeeUpdate tab="tab1" edit={editStatus} setEditStatus={setEditStatus} dataLeft={exrtraBenefitsLeftData} dataRight={exrtraBenefitsRightData} setDataLeft={setDataLeft} setDataRight={setDataRight} setShowDetails={setShowDetails}></EmployeeUpdate>}
                            {showExtraBenifits && <EmployeeDetailsUpdateForm tab="tab6" eid={eid} response={extraBenefitsData} setShowAddress={setShowAddress} setShowDetails={setShowDetails} showAddress={showAddress} showDetails={showDetails} setDataRefresh={setDataRefresh} dataRefresh={dataRefresh} showExtraBenifits={showExtraBenifits} setShowExtraBenefits={setShowExtraBenefits} ></EmployeeDetailsUpdateForm>}
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    )
}
