import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../routes/ApiEndPoints";
import { APICALL as AXIOS } from "../../services/AxiosServices"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import TextInput from "../atoms/formFields/TextInput";
import BackIcon from "../../static/icons/BackIcon.png"
import CustomButton from "../atoms/CustomButton";
import { t } from "../../translations/Translation";

export default function LinkHolidayCodeToSocialSecretary() {

    const navigate = useNavigate()
    const params = useParams();
    const [listData, setListData] = useState([])
    const [formData, setFormData] = useState({
        "social_secretary_id": params.id,
        "social_secretary_codes": [],
    })
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState([]);

    let redirectURL = "/manage-configurations/social_secretary";

    useEffect(() => {

        let apiUrl = BASE_URL + '/masterdata/social-secretary-holiday-configuration/' + params.id
        // Api call to get list data
        AXIOS.service(apiUrl, 'GET')
            .then((result) => {
                if (result?.success) {
                    let response = result.data.details
                    setListData(response);
                    //this is to remove holiday_code_name and holiday_code from response to set formData
                    let ss_codes_array = response.map((data) => {
                        const { holiday_code_name, holiday_code, ...rest } = data;
                        return rest;
                    })
                    formData['social_secretary_codes'] = ss_codes_array;
                }
            })
            .catch((error) => {
                console.log(error);
            })

    }, [])

    //setting values
    const SetValues = (id, value, index) => {
        let form_data = { ...formData }
        form_data['social_secretary_codes'][index]['social_secretary_code'] = value
        setFormData(form_data)
    }

    function OnSave() {

        let apiUrl = BASE_URL + '/masterdata/social-secretary-holiday-configuration'
        // APICall for create and updation of social secretary
        AXIOS.service(apiUrl, 'PUT', formData)
            .then((result) => {
                if (result?.success) {
                    setSuccessMessage(result.message);
                    navigate(redirectURL);
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
        <div className="right-container">
            {/* {errors !== undefined && errors.length !== 0 && <ErrorPopup
                title={('Validation error!')}
                body={(errors)}
                onHide={() => setErrors([])}
            ></ErrorPopup>} */}
            <div className="form-container my-3 border bg-white">
                <h3 className="col-md-12 px-3 pt-4 mb-0 ml-0 text-color"><img className="shortcut-icon mr-2 mb-1 pointer" onClick={() => navigate(redirectURL)} src={BackIcon}></img>{t("LINK_HOLIDAY_CODE")}</h3>
                <div className="row m-0 my-3 px-5 pt-3 table-head-bg">
                    <div className="col-md-4 text-start">
                        <h5>{t("HOLIDAY_CODE_NAME")}</h5>
                    </div>
                    <div className="col-md-4">
                        <h5>{t("INETRNAL_CODE")}</h5>
                    </div>
                    <div className="col-md-4">
                        <h5>{t("SOCIAL_SECRETARY_CODE")}</h5>
                    </div>
                </div>
                {listData.map((val, i) => {
                    return (<div className="row m-0  px-5 mx-3 mb-2" key={val.holiday_code_name}>
                        <div className="col-md-4">
                            <h6 className="p-2">{val.holiday_code_name}</h6>
                        </div>
                        <div className="col-md-4">
                            <p className="p-2 text-secondary">{val.holiday_code}</p>
                        </div>
                        <div className="col-md-4 p-2">
                            <TextInput setValue={(e) => SetValues(val.id, e, i)} value={formData['social_secretary_codes'][i]['social_secretary_code']} />
                        </div>
                    </div>)
                })}
                <div className="col-md-12 mb-3 text-right pr-5 my-5">
                    <CustomButton buttonName={t("SAVE")} ActionFunction={() => OnSave()} CustomStyle=""></CustomButton>
                    <CustomButton buttonName={t("BACK_LINK")} ActionFunction={() => navigate(redirectURL)} CustomStyle="mr-3"></CustomButton>
                </div>
            </div>
        </div>
    );
}