import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ErrorPopup from "../../utilities/popup/ErrorPopup";
import { t } from "../../translations/Translation";
import BackIcon from "../../static/icons/BackIcon.png";
import CustomButton from "../atoms/CustomButton";
import AddEmployeePersonalDetails from "../molecules/AddEmployeePersonalDetails";
import { EmployeeApiUrl } from "../../routes/ApiEndPoints";
import { toast } from 'react-toastify';
import { APICALL as AXIOS } from "../../services/AxiosServices"
import AddEmployeeContractTypes from "../molecules/AddEmployeeContractTypes";
import AddEmployeeFunctionSalaries from "../molecules/AddEmployeeFunctionSalaries";
import AddEmployeeAdditionalInfo from "../molecules/AddEmployeeAdditionalInfo";



export default function EmployeeCreation() {

    const navigate = useNavigate();
    const params = useParams();
    const [tabIndex, setTabIndex] = useState(0);

    const [gender, setGender] = useState()
    const [language, setLanguage] = useState();
    const [maritalStatus, setMaritalStatus] = useState();
    const [fuelCard, setFuelCard] = useState();
    const [companyCar, setCompanyCar] = useState();
    const [mealVoucher, setMealVoucher] = useState();
    const [functions, setFunctions] = useState([]);
    const [locations, setLocations] = useState([]);
    const [commute, setCommute] = useState([]);
    const [dependantSpouse, setDependantSpouse] = useState([]);
    const [selectedEmpTypeCategory, setSelectedEmpTypeCategory] = useState();
    const [displaySubType, setDisplaySubType] = useState(false);


    const [functionSalaries, setFunctionSalaries] = useState([{ 'function_id': '', 'salary': '', 'experience': '' }]);
    const [locationTransport, setLocationTransport] = useState([{ 'location_id': '', 'commute_type_id': '', 'distance': '' }])
    const [employeeContracts, setEmployeeContracts] = useState(
        {
            "employee_type_id": '',
            "sub_type": "",
            "schedule_type": "",
            "employement_type": "",
            "start_date": "",
            "end_date": "",
            "weekly_contract_hours": "",
            "work_days_per_week": ''
        }
    )

    const [errors, setErrors] = useState([]);

    const [options, setOptions] = useState([]);
    const MaximumChildren = 10;
    let count = 1
    let childrenOptions = [];
    while (count <= MaximumChildren) {
        childrenOptions.push({ value: count, label: count })
        count = count + 1
    }

    useEffect(() => {
        AXIOS.service(EmployeeApiUrl + '/create/1', 'GET')
            .then((result) => {
                if (result?.success) {
                    setOptions(result.data)
                } else {
                    // setErrors(result.message)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    // Tabs data array for super admin
    const TabsData = [
        { tabHeading: t("PERSONAL_DETAILS"), tabName: 'personal_details' },
        { tabHeading: t("EMPLOYEE_CONTRACT_TYPE"), tabName: 'employee_contract_type' },
        { tabHeading: t("FUNCTION_SALARIES"), tabName: 'function_salaries' },
        { tabHeading: t("TRANSPORTATION_DETAILS"), tabName: 'function_salaries' },
        { tabHeading: t("ADDITIONAL_INFO"), tabName: 'additional_info' },
    ]

    const [employeeData, setEmployeeData] = useState({
        "first_name": "",
        "last_name": "",
        "date_of_birth": "",
        "gender_id": "",
        "marital_status_id": "",
        "email": "",
        "phone_number": "",
        "social_security_number": "",
        "license_expiry_date": "",
        "language": "",
        "street_house_no": "",
        "postal_code": "",
        "city": "",
        "country": "",
        "bank_account_number": "",
        "fuel_card": "",
        "company_car": "",
        "clothing_compensation": "",
        "meal_voucher_amount":"",
        "meal_voucher_id":"",
        "social_secretary_number": "",
        "contract number": "",
        "extra_info":"",
    });


    const OnSave = () => {
        employeeData['employee_function_details'] = functionSalaries
        employeeData['employee_commute_details'] = locationTransport
        employeeData['employee_contract_details'] = employeeContracts
        let ApiUrl = EmployeeApiUrl + '/store/1'
        let Method = 'POST'
        let requestData = employeeData

        AXIOS.service(ApiUrl, Method, requestData)
            .then((result) => {
                if (result?.success) {
                    navigate('/manage-employees')
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
                } else {
                    setErrors(result.message)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }


    return (
        <div className="right-creation-container ">
            <div className="company-tab-width mt-3 mb-1 mx-auto pt-2 pl-2 border bg-white">
                <h4 className="mb-0 text-color">
                    <img className="shortcut-icon mr-2 mb-1" onClick={() => navigate('/manage-employees')} src={BackIcon}></img>
                    {/* {(params.id !== '' ? 'Edit ' : 'Create ') + "employees"} */}
                    Create employee
                </h4>
            </div>
            {errors !== undefined && errors.length !== 0 && <ErrorPopup
                title={('Validation error!')}
                body={(errors)}
                onHide={() => setErrors([])}
            ></ErrorPopup>}
            {/* Employee creation multi step form */}
            <div className="company-tab-width company_creation mt-2 mb-3 mx-auto border bg-white">
                <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                    <TabList>
                        {TabsData.map((val) => {
                            return (
                                <Tab key={val.tabName} >{val.tabHeading}</Tab>
                            )
                        })}
                    </TabList>

                    <TabPanel>
                        <div className="">
                            <AddEmployeePersonalDetails
                                tabIndex={tabIndex}
                                gender={gender} setGender={setGender}
                                language={language} setLanguage={setLanguage}
                                maritalStatus={maritalStatus} setMaritalStatus={setMaritalStatus}
                                dependantSpouse={dependantSpouse} setDependantSpouse={setDependantSpouse}
                                employeeData={employeeData} setEmployeeData={setEmployeeData}
                                options={options}
                                childrenOptions={childrenOptions}
                            ></AddEmployeePersonalDetails>
                        </div>
                        <CustomButton buttonName={'Back'} ActionFunction={() => navigate('/manage-companies')} CustomStyle="my-3 float-left"></CustomButton>
                        <CustomButton buttonName={'Next'} ActionFunction={() => setTabIndex(1)} CustomStyle="my-3 float-right"></CustomButton>
                    </TabPanel>

                    <TabPanel>
                        <div className="">
                            <AddEmployeeContractTypes
                                tabIndex={tabIndex} options={options}
                                setEmployeeContracts={setEmployeeContracts} employeeContracts={employeeContracts}
                                displaySubType={displaySubType} setDisplaySubType={setDisplaySubType}
                                selectedEmpTypeCategory={selectedEmpTypeCategory} setSelectedEmpTypeCategory={setSelectedEmpTypeCategory}
                            ></AddEmployeeContractTypes>
                        </div>
                        <CustomButton buttonName={'Back'} ActionFunction={() => navigate('/manage-companies')} CustomStyle="my-3 float-left"></CustomButton>
                        <CustomButton buttonName={'Next'} ActionFunction={() => setTabIndex(2)} CustomStyle="my-3 float-right"></CustomButton>
                        <CustomButton buttonName={'Prev'} ActionFunction={() => setTabIndex(0)} CustomStyle="mr-3 my-3 float-right"></CustomButton>
                    </TabPanel>

                    <TabPanel>
                        <div className="">
                            <AddEmployeeFunctionSalaries
                                tabIndex={tabIndex}
                                functionSalaries={functionSalaries} setFunctionSalaries={setFunctionSalaries}
                                functions={functions} setFunctions={setFunctions}
                                options={options}
                            ></AddEmployeeFunctionSalaries>
                        </div>
                        <CustomButton buttonName={'Back'} ActionFunction={() => navigate('/manage-companies')} CustomStyle="my-3 ml-0 float-left"></CustomButton>
                        <CustomButton buttonName={'Next'} ActionFunction={() => setTabIndex(3)} CustomStyle="my-3 float-right"></CustomButton>
                        <CustomButton buttonName={'Prev'} ActionFunction={() => setTabIndex(1)} CustomStyle="mr-3 my-3 float-right"></CustomButton>
                    </TabPanel>

                    <TabPanel>
                        <div className="">
                            <AddEmployeeFunctionSalaries
                                tabIndex={tabIndex}
                                locationTransport={locationTransport} setLocationTransport={setLocationTransport}
                                locations={locations} setLocations={setLocations}
                                commute={commute} setCommute={setCommute}
                                options={options}
                            ></AddEmployeeFunctionSalaries>
                        </div>                        <CustomButton buttonName={'Back'} ActionFunction={() => navigate('/manage-companies')} CustomStyle="my-3 ml-0 float-left"></CustomButton>
                        <CustomButton buttonName={'Next'} ActionFunction={() => setTabIndex(4)} CustomStyle="my-3 float-right"></CustomButton>
                        <CustomButton buttonName={'Prev'} ActionFunction={() => setTabIndex(2)} CustomStyle="mr-3 my-3 float-right"></CustomButton>
                    </TabPanel>

                    <TabPanel>
                        <div className="">
                            <AddEmployeeAdditionalInfo
                                tabIndex={tabIndex}
                                options={options}
                                fuelCard={fuelCard} setFuelCard={setFuelCard}
                                companyCar={companyCar} setCompanyCar={setCompanyCar}
                                mealVoucher={mealVoucher} setMealVoucher={setMealVoucher}
                                employeeData={employeeData} setEmployeeData={setEmployeeData}
                            ></AddEmployeeAdditionalInfo>
                        </div>
                        <CustomButton buttonName={'Back'} ActionFunction={() => navigate('/manage-companies')} CustomStyle="my-3 ml-0 float-left"></CustomButton>
                        <CustomButton buttonName={'Save'} ActionFunction={() => OnSave()} CustomStyle="my-3 float-right"></CustomButton>
                        <CustomButton buttonName={'Prev'} ActionFunction={() => setTabIndex(3)} CustomStyle="mr-3 my-3 float-right"></CustomButton>
                    </TabPanel>

                </Tabs>
            </div>
        </div>
    )
}
