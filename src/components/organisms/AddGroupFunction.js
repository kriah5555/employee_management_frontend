import React, { useEffect, useState } from "react";
import Forms from "../molecules/Forms";
import { FunctionApiUrl, GroupFunctionApiUrl, SectorApiUrl } from "../../routes/ApiEndPoints";
import { APICALL as AXIOS } from "../../services/AxiosServices"
import ModalPopup from "../../utilities/popup/Popup";
import { useNavigate, useParams } from "react-router-dom";

export default function AddGroupFunction() {

    const [active, setActive] = useState(true);
    const [inactive, setInactive] = useState(false);

    const [sector, setSector] = useState('');
    const [description, setDescription] = useState('');
    const [functionCategory, setFunctionCategory] = useState('');
    const [groupName, setGroupName] = useState('')
    const [successMessage, setSuccessMessage] = useState('');

    const[sectorList, setSectorList] = useState([])
    const categoriesList = []
    let count = 1
    while (count <= 20) {
        categoriesList.push({ value: count, label: count })
        count = count + 1
    }

    const navigate = useNavigate();
    const params = useParams();

    // Checkbox status data
    const changeCheckbox = (type) => {
        if (type === 'active') {
            setActive(true);
            setInactive(false);
        } else {
            setActive(false);
            setInactive(true);
        }
    }
    const checkboxList = [
        {
            name: 'Active',
            key: 'active',
            checked: active,
        },
        {
            name: 'Inactive',
            key: 'inactive',
            checked: inactive,
        }
    ]

    //Fetch dropdown data of sectors
    useEffect(() => {
        AXIOS.service(SectorApiUrl, 'GET')
            .then((result) => {
                console.log(result);
                if (result.length !== sectorList.length){
                    result.map((val, index) => {
                        sectorList.push({ value: val.id, label: val.name })
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    // Fetch sector data based on param id to add default inputs
    useEffect(() => {
        if (params.id) {
            let editApiUrl = GroupFunctionApiUrl
            AXIOS.service(editApiUrl, 'GET')
                .then((result) => {
                    result.map((val) => {
                        if (val.id === Number(params.id)) {
                            setGroupName(val.name);
                            setDescription(val.description);
                            setFunctionCategory({value: val.category, label:val.category})
                            if (val.status) { setActive(true) } else { setInactive(true); setActive(false) }
                            sectorList.map((sector) => {
                                if (sector.value === val.sector_id) {
                                    setSector(sector);
                                }
                            })
                        }
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }, [])

    // Function to stop the rendering till the data gets updated
    if (params.id && groupName === '') {
        return
    }


    // Fields data
    const group_function_name = {
        title: 'Group function name',
        name: 'function_name',
        placeholder: 'Enter function name',
        required: true,
        value: groupName,
    }
    const sectors = {
        title: 'Sector',
        name: 'sector',
        placeholder: '',
        required: true,
        value: sector,
        options: sectorList,
        isMulti: false
    }
    const function_category = {
        title: 'Function category',
        name: 'function_category',
        placeholder: '',
        required: true,
        value: functionCategory,
        options: categoriesList,
        isMulti: false
    }
    const group_function_desc = {
        title: 'Description',
        name: 'sector_desc',
        required: false,
        value: description
    }
    const group_function_status = {
        title: 'Status',
        required: true
    }

    
    // Type:
    // 1: Group function name
    // 3: Sector
    // 4: Function category
    // 5: Description
    // 6: Active status

    const SetValues = (value, type) => {
        if (type === 1){
            setGroupName(value);
        } else if (type === 3) {
            setSector(value);
        } else if (type === 4) {
            setFunctionCategory(value);
        } else {
            setDescription(value);
        }
    }


    // On submit function for create and update group function
    const OnSave = () => {
        let status = 1
        if (inactive) { status = 0 }

        let data = {
            'name': groupName,
            'category': functionCategory.value,
            'description': description,
            'sector_id': sector.value,
            'status': status
        }

        // Creation url and method
        let url = GroupFunctionApiUrl
        let method = 'POST'

        // Updation url and method
        if (params.id !== undefined) {
            url = GroupFunctionApiUrl + '/' + params.id
            method = 'PUT'
        }

        // APICall for creating and updating group function
        AXIOS.service(url, method, data)
            .then((result) => {
                if (result && result.status === 200) {
                    console.log(result.message);
                } else {
                    setSuccessMessage(result.message);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className="right-container">
            {successMessage && <ModalPopup
                title={('SUCCESS')}
                body={(successMessage)}
                onHide={() => navigate('/manage-configurations/group_functions')}
            ></ModalPopup>}
            <Forms
                formTitle={'Add Group Function'}
                redirectURL={'/manage-configurations/group_functions'}
                changeCheckbox={changeCheckbox}
                checkboxList={checkboxList}
                field1={group_function_name}
                field3={sectors}
                field4={function_category}
                field5={group_function_desc}
                field6={group_function_status}
                SetValues={SetValues}
                onSave={OnSave}
                view={'group_function'}
            ></Forms>
        </div>
    )
}