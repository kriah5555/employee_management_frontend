import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { t } from "../../translations/Translation";
import CompanyOverviews from "../molecules/CompanyOverviews";
import 'react-tabs/style/react-tabs.css';
import AddCompanyIcon from "../../static/icons/AddCompany.svg";
import FilterIcon from "../../static/icons/Filter.svg";
import ExportIcon from "../../static/icons/Export.svg";
import AddLocationIcon from "../../static/icons/AddLocation.svg"
import AddWorkstationIcon from "../../static/icons/Workstation.svg"
import { ToastContainer } from 'react-toastify';
import SalariesIcon from "../../static/icons/Salaries.svg";

export default function OverviewTabs() {

    const [addIcon, setAddIcon] = useState(AddCompanyIcon);
    const [addTitle, setAddTitle] = useState('Add company');
    const [addUrl, setAddUrl] = useState('/manage-companies/company/0');
    const [tabIndex, setTabIndex] = useState(0);


    useEffect(() => {
        if (window.location.hash !== '' && window.location.hash !== '#') {
            // setTabIndex(parseInt(window.location.hash.split('#')[1]));
            if (window.location.hash === '#location') {
                setTabIndex(1);
                getRightHeaderContent('location');
                window.location.hash = ''
            } else if (window.location.hash === '#workstation') {
                setTabIndex(2);
                getRightHeaderContent('workstation');
                window.location.hash = ''
            } else if (window.location.hash === '#cost_center') {
                setTabIndex(3)
                getRightHeaderContent('cost center');
                window.location.hash = ''
            }
            window.location.hash = ''
        }
    }, [])


    const getRightHeaderContent = (tabName) => {

        if (tabName === 'company') {
            setAddIcon(AddCompanyIcon);
            setAddTitle('Add company');
            setAddUrl('/manage-companies/company/0');
        } else if (tabName === 'location') {
            setAddIcon(AddLocationIcon);
            setAddTitle('Add location');
            setAddUrl('/manage-companies/location/0')
        } else if (tabName === 'workstation') {
            setAddIcon(AddWorkstationIcon);
            setAddTitle('Add workstation');
        setAddUrl('/manage-companies/workstation/0')
        } else if (tabName === 'cost center') {
            setAddIcon(SalariesIcon);
            setAddTitle('Add cost center');
            setAddUrl('/manage-companies/cost_center/0')
        } else {
            setAddIcon('');
            setAddTitle('');
        }
    }

    const TabsData = [
        { tabHeading: t("COMPANY"), tabName: 'company' },
        { tabHeading: t("LOCATIONS"), tabName: 'location' },
        { tabHeading: t("WORKSTATION"), tabName: 'workstation' },
        { tabHeading: t("COST_CENTER"), tabName: 'cost center' },
        { tabHeading: t("CONTRACTS"), tabName: 'contracts' },
        { tabHeading: t("DIMONA"), tabName: 'dimona' },
        { tabHeading: t("RULES"), tabName: 'rules' },
    ]


    return (
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
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
            <TabList>
                {TabsData.map((val) => {
                    return (
                        <Tab key={val.tabName} onClick={() => getRightHeaderContent(val.tabName)} >{val.tabHeading}</Tab>
                    )
                })}
                {addIcon && <div className="react-tabs__tab border-0 float-right">
                    <div className="d-flex justify-content-start">
                        {<a href={addUrl}><p className="mb-0 text-dark text-nowrap"><img className="header-icon mr-2" src={addIcon}></img>{addTitle}</p></a>}
                        {/* {addTitle !== 'Add company' &&<p className="mb-0 mr-3 text-dark"><img className="header-icon mr-2" src={addIcon}></img>{addTitle}</p>} */}
                        {/* <img src={FilterIcon} className="header-icon ml-2"></img>
                        <img src={ExportIcon} className="header-icon ml-2"></img> */}
                    </div>
                </div>}
            </TabList>

            <TabPanel>
                <div className="tablescroll"><CompanyOverviews overviewContent={'company'}></CompanyOverviews></div>
            </TabPanel>

            <TabPanel>
                <div className="tablescroll"><CompanyOverviews overviewContent={'location'}></CompanyOverviews></div>
            </TabPanel>

            <TabPanel>
                <div className="tablescroll"><CompanyOverviews overviewContent={'workstation'}></CompanyOverviews></div>
            </TabPanel>
            <TabPanel>
                <div className="tablescroll"><CompanyOverviews overviewContent={'cost center'}></CompanyOverviews></div>
            </TabPanel>

            <TabPanel>
                <h3 className="text-center mt-3">Contracts Overview</h3>
            </TabPanel>

            <TabPanel>
                <h3 className="text-center mt-3 ">Dimona</h3>
            </TabPanel>

            <TabPanel>
                <h3 className="text-center mt-3">Rules</h3>
            </TabPanel>
        </Tabs>
    )
}
