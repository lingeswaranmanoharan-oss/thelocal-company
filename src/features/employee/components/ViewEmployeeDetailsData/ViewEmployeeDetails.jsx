import React, { useCallback, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Accordion } from '../../../../components/Accordion/Accordion';
import { Button } from '../../../../components/Button/Button';
import { CompanyLogo } from '../../../../components/CompanyLogo/CompanyLogo';
import { icons } from '../../../../utils/constants';
import HttpService from '../../../../services/httpService';
import apiEndpoints from '../../../../services/apiEndPoints';
import toaster from '../../../../services/toasterService';
import useRouteInformation from '../../../../hooks/useRouteInformation';
import { getDateToDDMMYYYYformat } from '../../../../utils/functions';
import Popup from '../../../../components/Popup/Popup';
import AddSalaryPopup from '../Employee/AddSalaryPopup';
import { getEmployeeSalary } from '../../services/services';
import './ViewEmployeeDetails.scss';

const empProjects = [
    {
        id: 1,
        title: 'World Health',
        iconColor: 'blue',
        tasksTotal: 8,
        tasksCompleted: 15,
        deadline: '31 July 2025',
        leadName: 'Leona',
        leadAvatar: '',
    },
    {
        id: 2,
        title: 'Hospital Administration',
        iconColor: 'purple',
        tasksTotal: 8,
        tasksCompleted: 15,
        deadline: '31 July 2025',
        leadName: 'Leona',
        leadAvatar: '',
    },
];

const empAssets = [
    {
        id: 1,
        name: 'Dell Laptop',
        assetId: '#343556656',
        assetCode: 'AST - 001',
        assignedOn: '22 Nov, 2022 10:32AM',
        assignedByName: 'Andrew Symon',
        assignedByAvatar: '',
        iconColor: 'yellow'
    },
    {
        id: 2,
        name: 'Bluetooth Mouse',
        assetId: '#478878',
        assetCode: 'AST - 001',
        assignedOn: '22 Nov, 2022 10:32AM',
        assignedByName: 'Andrew Symon',
        assignedByAvatar: '',
        iconColor: 'purple'
    },
];

const ViewEmployeesDetail = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const { pathParams } = useRouteInformation();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [salaryPopupOpen, setSalaryPopupOpen] = useState(false);
    const [salaryData, setSalaryData] = useState(null);
    const [salaryError, setSalaryError] = useState(null);

    const getEmployeeDetails = useCallback(async () => {
        if (!pathParams?.companyId) return;
        setError(null);
        try {
            const response = await HttpService.get(
                apiEndpoints.getEmployeeReqDetails(pathParams.companyId)
            );
            if (response?.success && response?.data) {
                setData(response.data);
            } else {
                setError(true);
                toaster.error(response?.message);
            }
        } catch (err) {
            setError(true);
            if (err?.response?.data?.error?.message) {
                toaster.error(err.response.data.error.message);
            } else if (err?.data?.error?.message) {
                toaster.error(err.data.error.message);
            } else {
                toaster.error(err?.message);
            }
        } finally {
        }
    }, [pathParams?.companyId]);

    useEffect(() => {
        getEmployeeDetails();
    }, [getEmployeeDetails]);

    const fetchSalaryOnLoad = useCallback(async () => {
        if (!pathParams?.companyId) return;
        setSalaryError(null);
        setSalaryData(null);
        try {
            const response = await getEmployeeSalary(pathParams.companyId);
            if (response?.success) {
                setSalaryData(response?.data);
            } else {
                setSalaryError(response?.message);
            }
        } catch (err) {
            const message = err?.data?.error?.message;
            setSalaryError(message);
            setSalaryData(null);
        }
    }, [pathParams?.companyId]);

    useEffect(() => {
        fetchSalaryOnLoad();
    }, [fetchSalaryOnLoad]);

    const handleViewDocument = (url) => {
        if (!url) {
            toaster.error("Document not available");
            return;
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const handleViewSalary = () => {
        setSalaryPopupOpen(true);
    };


    const primaryContact = data?.familyDetails?.[0];
    const secondaryContact = data?.familyDetails?.[1];

    if (error || !data) {
        return (
            <div className="view-employee-details flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">
                    {error && 'Failed to load employee details.'}
                </p>
            </div>
        );
    }

    return (
        <div className="view-employee-details">
            <div className="view-employee-details-left">
                <div className="employee-profile-card">
                    <div className="employee-profile-card-banner" />
                    <div className="employee-profile-card-body">
                        <CompanyLogo
                            logoUrl={data.profileUrl}
                            companyName={data.firstName + " " + data.lastName}
                            className="employee-profile-card-avatar"
                            rounded="full"
                        />
                        <h1 className="employee-profile-card-name">
                            {data.firstName + " " + data.lastName || '--'}
                            <Icon icon={icons.checkCircle} className="w-5 h-5 text-green-500 flex-shrink-0" />
                        </h1>
                        <div className="employee-profile-card-badges">
                            <span className="employee-profile-card-badge employee-profile-card-badge-role">
                                {data.designationName || '--'}
                            </span>
                            <span className="employee-profile-card-badge employee-profile-card-badge-experience">
                                {data.experienceFlag === 'Y' ? 'Experience' : '--'}
                            </span>
                        </div>
                        <ul className="employee-profile-card-meta">
                            <li className="employee-profile-card-meta-item">
                                <Icon icon={icons.cardAccount} className="employee-profile-card-meta-icon" />
                                <span className="employee-profile-card-meta-value">
                                    <span>Client ID:</span>
                                    <span className="font-medium">{data.id || '--'}</span>
                                </span>
                            </li>
                            <li className="employee-profile-card-meta-item">
                                <Icon icon={icons.star} className="employee-profile-card-meta-icon" />
                                <span className="employee-profile-card-meta-value">
                                    <span>Team:</span>
                                    <span className="font-medium">{data.departmentName || '--'}</span>
                                </span>
                            </li>
                            <li className="employee-profile-card-meta-item">
                                <Icon icon={icons.calendar} className="employee-profile-card-meta-icon" />
                                <span className="employee-profile-card-meta-value">
                                    <span>Date Of Join:</span>
                                    <span className="font-medium">{data?.doj
                                        ? getDateToDDMMYYYYformat(data.doj, false)
                                        : '--'}</span>
                                </span>
                            </li>
                            <li className="employee-profile-card-meta-item">
                                <Icon icon={icons.officeBuilding} className="employee-profile-card-meta-icon" />
                                <span className="employee-profile-card-meta-value">
                                    <CompanyLogo
                                        logoUrl={data.companyLogoUrl}
                                        className="employee-profile-card-meta-avatar"
                                        rounded="full"
                                    />
                                    <span className="font-medium">{data.companyName || '--'}</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <hr />
                    <div className="info-card">
                        <div className="info-card-header">
                            <h2 className="info-card-title">Basic information</h2>
                        </div>
                        <ul className="info-card-list">
                            <li className="info-card-row">
                                <Icon icon={icons.phone} className="info-card-icon" />
                                <span className="info-card-label">Phone</span>
                                <span className="info-card-value">{data.contactNumber || '--'}</span>
                            </li>
                            <li className="info-card-row">
                                <Icon icon={icons.email} className="info-card-icon" />
                                <span className="info-card-label">Email</span>
                                <span className="info-card-value info-card-value-inline">{data.personalEmail || '--'}</span>
                            </li>
                            <li className="info-card-row">
                                <Icon icon={icons.gender} className="info-card-icon" />
                                <span className="info-card-label">Gender</span>
                                <span className="info-card-value">{data.gender || '--'}</span>
                            </li>
                            <li className="info-card-row">
                                <Icon icon={icons.birthday} className="info-card-icon" />
                                <span className="info-card-label">Birthday</span>
                                <span className="info-card-value">{data?.dob
                                    ? getDateToDDMMYYYYformat(data.dob, false)
                                    : '--'}</span>
                            </li>
                            <li className="info-card-row">
                                <Icon icon={icons.mapMarker} className="info-card-icon" />
                                <span className="info-card-label">Address</span>
                                <span className="info-card-value">--</span>
                            </li>
                        </ul>
                    </div>
                    <hr />
                    <div className="info-card">
                        <div className="info-card-header">
                            <h2 className="info-card-title">Personal Information</h2>
                        </div>
                        <ul className="info-card-list">
                            <li className="info-card-row">
                                <Icon icon={icons.passport} className="info-card-icon" />
                                <span className="info-card-label">Passport No</span>
                                <span className="info-card-value">--</span>
                            </li>
                            <li className="info-card-row">
                                <Icon icon={icons.calendar} className="info-card-icon" />
                                <span className="info-card-label">Passport Exp Date</span>
                                <span className="info-card-value">--</span>
                            </li>
                            <li className="info-card-row">
                                <Icon icon={icons.gender} className="info-card-icon" />
                                <span className="info-card-label">Nationality</span>
                                <span className="info-card-value">{data.nationality || '--'}</span>
                            </li>
                            <li className="info-card-row">
                                <Icon icon={icons.religion} className="info-card-icon" />
                                <span className="info-card-label">Religion</span>
                                <span className="info-card-value">{data.religion || '--'}</span>
                            </li>
                            <li className="info-card-row">
                                <Icon icon={icons.marital} className="info-card-icon" />
                                <span className="info-card-label">Marital status</span>
                                <span className="info-card-value">{data.maritalStatus || '--'}</span>
                            </li>
                            <li className="info-card-row">
                                <Icon icon={icons.briefcase} className="info-card-icon" />
                                <span className="info-card-label">Employment of spouse</span>
                                <span className="info-card-value">{data.employmentOfSpouse || '--'}</span>
                            </li>
                            <li className="info-card-row">
                                <Icon icon={icons.children} className="info-card-icon" />
                                <span className="info-card-label">No. of children</span>
                                <span className="info-card-value">{data.numberOfChildren || '--'}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <div className="info-card-header">
                            <h2 className="info-card-title">Emergency Contact Number</h2>
                        </div>
                        <div className="emergency-contact-card">
                            <div className="emergency-contact-item">
                                <span className="emergency-contact-label">Primary</span>
                                <div className="emergency-contact-row">
                                    <div className="emergency-contact-name-relation">
                                        <span className="emergency-contact-name">
                                            {primaryContact
                                                ? primaryContact.memberName : '--'}
                                        </span>
                                        <span className="emergency-contact-sep" />
                                        <span className="emergency-contact-relation">
                                            {(primaryContact?.relationType) || '--'}
                                        </span>
                                    </div>
                                    <span className="emergency-contact-number">
                                        {(primaryContact?.contactNumber) || '--'}
                                    </span>
                                </div>
                            </div>
                            <div className="emergency-contact-item">
                                <span className="emergency-contact-label">Secondary</span>
                                <div className="emergency-contact-row">
                                    <div className="emergency-contact-name-relation">
                                        <span className="emergency-contact-name">
                                            {secondaryContact
                                                ? secondaryContact.memberName : '--'}
                                        </span>
                                        <span className="emergency-contact-sep" />
                                        <span className="emergency-contact-relation">
                                            {(secondaryContact?.relationType) || '--'}
                                        </span>
                                    </div>
                                    <span className="emergency-contact-number">
                                        {(secondaryContact?.contactNumber) || '--'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="view-employee-details-right">
                <Accordion title="About Employee">
                    <p className="text-gray-600 text-sm">--</p>
                </Accordion>

                <Accordion title="Bank Information">
                    <table className="family-table">
                        <thead>
                            <tr>
                                <th>Bank Name</th>
                                <th>Bank Acc No.</th>
                                <th>IFSC Code</th>
                                <th>Branch</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{data.bankName || '--'}</td>
                                <td>{data.bankAccNum || '--'}</td>
                                <td>{data.ifscCode || '--'}</td>
                                <td>{data.bankBranch || '--'}</td>
                            </tr>
                        </tbody>
                    </table>
                </Accordion>
                <Accordion title="Salary">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-600 text-sm">Salary details</span>
                        {salaryError ? (
                            <p className="text-sm text-red-600 m-0">{salaryError}</p>
                        ) : (
                            <Icon
                                icon="mdi:eye-outline"
                                style={{ color: '#f26522' }}
                                className="cursor-pointer w-5 h-5 flex-shrink-0"
                                onClick={handleViewSalary}
                                title="View salary"
                            />
                        )}
                    </div>
                </Accordion>
                <Accordion title="Documents">
                    <table className="family-table">
                        <thead>
                            <tr>
                                <th>Document Name</th>
                                <th>Documents Number</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.documents?.length > 0 ? (
                                data.documents.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row.documentName || '--'}</td>
                                        <td>{row.documentNumber || '--'}</td>
                                        <td>
                                            <Icon
                                                icon="mdi:eye-outline"
                                                style={{ color: "#dc2626" }}
                                                className="cursor-pointer w-5 h-5"
                                                onClick={() => handleViewDocument(row.documentUrl)}
                                            />

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">--</p>
                            )}
                        </tbody>
                    </table>
                </Accordion>


                <Accordion title="Family Information" defaultExpanded>
                    {data.familyDetails?.length > 0 ? (
                        <table className="family-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Relationship</th>
                                    <th>Date of birth</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.familyDetails.map((row, i) => (
                                    <tr key={i}>
                                        <td>
                                            {row.memberName || '--'}
                                        </td>
                                        <td>{row.relationType || '--'}</td>
                                        <td>
                                            {row.dob ? getDateToDDMMYYYYformat(row.dob, false) : '--'}
                                        </td>
                                        <td>{row.contactNumber || '--'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-sm">--</p>
                    )}
                </Accordion>

                <div className="accordions-row">
                    <Accordion title="Education Details">
                        {data.employeeEducation?.length > 0 ? (
                            <ul className="education-details-list">
                                {data.employeeEducation.map((education, i) => {
                                    const yearRange =
                                        education.startYear && education.endYear
                                            ? `${education.startYear} - ${education.endYear}`
                                            : education.completionYear || '--';
                                    return (
                                        <li key={i} className="education-details-entry">
                                            <div className="education-details-content">
                                                <div className="education-details-institution">
                                                    {education.institutionName || '--'}
                                                </div>
                                                <div className="education-details-degree">{education.qualificationLevel || '--'}</div>
                                            </div>
                                            <div className="education-details-years">{yearRange}</div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">--</p>
                        )}
                    </Accordion>
                    <Accordion title="Experience">
                        {data.experiences?.length > 0 ? (
                            <ul className="experience-details-list">
                                {data.experiences.map((exp, i) => {
                                    return (
                                        <li key={exp.id || i} className="experience-details-entry">
                                            <div className="experience-details-content">
                                                <div className="experience-details-company">
                                                    {exp.companyName || '--'}
                                                </div>
                                                <div className="experience-details-badge">
                                                    <span className="experience-details-badge-dot" />
                                                    <span>{'--'}</span>
                                                </div>
                                            </div>
                                            <div className="experience-details-duration">{exp.totalExperience || '--'}</div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">--</p>
                        )}
                    </Accordion>
                </div>

                <div className="projects-assets-card">
                    <div className="projects-assets-tabs">
                        <button
                            type="button"
                            className={`projects-assets-tab ${activeTab === 'projects' ? 'active' : ''}`}
                            onClick={() => setActiveTab('projects')}
                        >
                            Projects
                        </button>
                        <button
                            type="button"
                            className={`projects-assets-tab ${activeTab === 'assets' ? 'active' : ''}`}
                            onClick={() => setActiveTab('assets')}
                        >
                            Assets
                        </button>
                    </div>

                    {activeTab === 'projects' && (
                        <div className="projects-grid">
                            {empProjects.map((project) => (
                                <div key={project.id} className="project-card">
                                    <div className="project-card-header">
                                        <CompanyLogo
                                            companyName={project.title}
                                            className="asset-card-assigned-avatar"
                                            rounded="full"
                                        />
                                        <span className="project-card-title">{project.title}</span>
                                    </div>
                                    <div className="project-card-tasks">
                                        <span className="project-card-tasks-total">
                                            {project.tasksTotal} tasks
                                        </span>
                                        <span className="project-card-tasks-sep" />
                                        <span className="project-card-tasks-completed">
                                            {project.tasksCompleted} Completed
                                        </span>
                                    </div>
                                    <div className="project-card-divider" />
                                    <div className="project-card-meta">
                                        <div className="project-card-meta-item">
                                            <span className="project-card-meta-label">Deadline</span>
                                            <span className="project-card-meta-value">{project.deadline}</span>
                                        </div>
                                        <div className="project-card-meta-item">
                                            <span className="project-card-meta-label">Project Lead</span>
                                            <div className="project-card-meta-lead">
                                                <CompanyLogo
                                                    companyName={project.leadName}
                                                    className="project-card-lead-avatar"
                                                    rounded="full"
                                                />
                                                <span>{project.leadName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'assets' && (
                        <ul className="assets-list">
                            {empAssets.map((asset) => (
                                <li key={asset.id} className="asset-card">
                                    <div className="asset-card-icon-wrap">
                                        <CompanyLogo
                                            companyName={asset.name}
                                            className="asset-card-assigned-avatar"
                                            rounded="full"
                                        />
                                    </div>
                                    <div className="asset-card-content">
                                        <div className="asset-card-name">
                                            {asset.name} - {asset.assetId}
                                        </div>
                                        <div className="asset-card-meta">
                                            <span className="asset-card-code">{asset.assetCode}</span>
                                            <span className="asset-card-meta-sep" />
                                            <span className="asset-card-date">Assigned on {asset.assignedOn}</span>
                                        </div>
                                    </div>
                                    <div className="asset-card-assigned">
                                        <span className="asset-card-assigned-label">Assigned by</span>
                                        <div className="asset-card-assigned-user">
                                            <CompanyLogo
                                                companyName={asset.assignedByName}
                                                className="asset-card-assigned-avatar"
                                                rounded="full"
                                            />
                                            <span>{asset.assignedByName}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="asset-card-menu"
                                        aria-label="More options"
                                    >
                                        <Icon icon="mdi:dots-vertical" className="w-5 h-5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {salaryPopupOpen && (
                <Popup
                    open={salaryPopupOpen}
                    onClose={() => {
                        setSalaryPopupOpen(false);
                        setSalaryData(null);
                    }}
                    header="Salary Break Up"
                    maxWidth="sm"
                >
                    <AddSalaryPopup
                        employeeId={pathParams?.companyId}
                        onClose={() => {
                            setSalaryPopupOpen(false);
                            setSalaryData(null);
                        }}
                        viewMode
                        initialData={salaryData}
                    />
                </Popup>
            )}
        </div>
    );
};

export default ViewEmployeesDetail;
