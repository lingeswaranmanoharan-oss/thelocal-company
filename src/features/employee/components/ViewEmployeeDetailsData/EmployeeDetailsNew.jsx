import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import Accordion from '../../../../components/Accordion/Accordion';
import { icons } from '../../../../Utils/constants';
import { IconButton } from '@mui/material';
import { CompanyLogo } from '../../../../components/CompanyLogo/CompanyLogo';
import { getDateToDDMMYYYYformat } from '../../../../utils/functions';
import { getEmpById } from '../../services/services';
import apiEndpoints from '../../../../services/apiEndPoints';
import useRouteInformation from '../../../../hooks/useRouteInformation';
import HttpService from '../../../../services/httpService';
import { Link } from 'react-router-dom';
import './employeeDetailsnew.scss';
import SalaryDetails from './SalaryDetails';
import toaster from '../../../../services/toasterService';

// const empProjects = [
//   {
//     id: 1,
//     title: 'World Health',
//     iconColor: 'blue',
//     tasksTotal: 8,
//     tasksCompleted: 15,
//     deadline: '31 July 2025',
//     leadName: 'Leona',
//     leadAvatar: '',
//   },
//   {
//     id: 2,
//     title: 'Hospital Administration',
//     iconColor: 'purple',
//     tasksTotal: 8,
//     tasksCompleted: 15,
//     deadline: '31 July 2025',
//     leadName: 'Leona',
//     leadAvatar: '',
//   },
// ];

// const empAssets = [
//   {
//     id: 1,
//     name: 'Dell Laptop',
//     assetId: '#343556656',
//     assetCode: 'AST - 001',
//     assignedOn: '22 Nov, 2022 10:32AM',
//     assignedByName: 'Andrew Symon',
//     assignedByAvatar: '',
//     iconColor: 'yellow',
//   },
//   {
//     id: 2,
//     name: 'Bluetooth Mouse',
//     assetId: '#478878',
//     assetCode: 'AST - 001',
//     assignedOn: '22 Nov, 2022 10:32AM',
//     assignedByName: 'Andrew Symon',
//     assignedByAvatar: '',
//     iconColor: 'purple',
//   },
// ];

const DocumentCard = ({ label, icon, href }) => {
  return (
    <a
      href={href}
      className="border p-2 rounded-md flex items-center justify-between
                 text-gray-500 text-sm bg-[var(--bg-primary)] hover:bg-gray-50 transition"
      target="_blank"
    >
      <span>{label}</span>
      <Icon icon={icon} style={{ color: '#f26522' }} className="w-5 h-5 flex-shrink-0" />
    </a>
  );
};

const AddressBlock = ({ title, address, startIcon }) => {
  if (!address) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-gray-600 text-sm flex items-center gap-2">
        {startIcon && (
          <span className="text-[var(--dark-green)] bg-[var(--grey-green)] p-1 rounded-md">
            <Icon icon={startIcon} />
          </span>
        )}
        {title}
      </p>

      {/* Line 1 */}
      <div className="flex flex-col gap-1 text-[13px] text-gray-600">
        <p>
          Flat / House No :{' '}
          <span className="font-medium text-gray-800">{address?.doorNum || '-'}</span>
        </p>

        <p>
          Area / Street :{' '}
          <span className="font-medium text-gray-800">{address?.areaDetails || '-'}</span>
        </p>

        <p>
          Landmark : <span className="font-medium text-gray-800">{address?.landMark || '-'}</span>
        </p>
      </div>

      {/* Line 2 */}
      <div className="flex flex-wrap gap-4 text-[13px] text-gray-600">
        <p>
          City : <span className="font-medium text-gray-800">{address?.city || '-'}</span>
        </p>

        <p>
          State : <span className="font-medium text-gray-800">{address?.state || '-'}</span>
        </p>

        <p>
          Country : <span className="font-medium text-gray-800">{address?.country || '-'}</span>
        </p>

        <p>
          Pincode : <span className="font-medium text-gray-800">{address?.pinCode || '-'}</span>
        </p>
      </div>
    </div>
  );
};
const EmployeeDetailsNew = () => {
  const [empData, setEmpData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { pathParams } = useRouteInformation();
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    const getEmployeeDetails = async () => {
      setIsLoading(true);
      try {
        const response = await HttpService.get(
          apiEndpoints.getEmployeeReqDetails(pathParams.companyId),
        );
        if (response && response.success && response.data) {
          setEmpData(response.data);
          // fillFormFromApi(response.data);
        }
      } catch (error) {
        if (error.response) {
          const { message } = error.response.data?.error || {};
          toaster.error(message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    getEmployeeDetails();
  }, [pathParams?.companyId]);

  console.log(empData);

  const handleViewDocument = (url) => {
    if (!url) {
      toaster.error('Document not available');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (error || !empData) {
    return (
      <div className="view-employee-details flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">{error && 'Failed to load employee details.'}</p>
      </div>
    );
  }

  const fullName = empData ? `${empData.firstName ?? ''} ${empData.lastName ?? ''}` : '';
  const permanentAdd = empData?.addresses?.find((each) => each.addressType === 'PERMANENT');
  const currentAdd = empData?.addresses?.find((each) => each.addressType === 'CURRENT');

  return (
    <div className="bg-white p-4 border">
      <div className="flex items-center gap-2 text-lg font-semibold mb-2">
        <Icon icon="mdi:hand-wave-outline" className="text-orange-500 text-xl" />
        <span>
          Welcome {fullName} {empData?.employeeId && `(${empData?.employeeId})`}
        </span>
      </div>
      <div className="view-employee-details ">
        <div className="view-employee-details-left">
          <div className="employee-profile-card border">
            <div className="employee-profile-card-banner" />
            <div className="employee-profile-card-body">
              <CompanyLogo
                logoUrl={empData.profileUrl}
                companyName={empData.firstName + ' ' + empData.lastName}
                className="employee-profile-card-avatar"
                rounded="full"
              />
              <h1 className="employee-profile-card-name">
                {empData.firstName + ' ' + empData.lastName || '--'}
                <Icon icon={icons.checkCircle} className="w-5 h-5 text-green-500 flex-shrink-0" />
              </h1>
              <div className="employee-profile-card-badges">
                <span className="employee-profile-card-badge employee-profile-card-badge-role">
                  {empData.designationName || '--'}
                </span>{' '}
                <span className="employee-profile-card-badge employee-profile-card-badge-role !bg-[var(--grey-green)] !text-[var(--dark-green)]">
                  {empData.employmentTypeName || '--'}
                </span>
                {/* <span className="employee-profile-card-badge employee-profile-card-badge-experience">
                {empData.experienceFlag === 'Y' ? 'Experience' : '--'}
              </span> */}
              </div>
              <ul className="employee-profile-card-meta">
                <li className="employee-profile-card-meta-item">
                  <Icon icon={icons.cardAccount} className="employee-profile-card-meta-icon" />
                  <span className="employee-profile-card-meta-value">
                    <span>Client ID:</span>
                    <span className="font-medium">{empData.id || '--'}</span>
                  </span>
                </li>
                <li className="employee-profile-card-meta-item">
                  <Icon icon={icons.star} className="employee-profile-card-meta-icon" />
                  <span className="employee-profile-card-meta-value">
                    <span>Team:</span>
                    <span className="font-medium">{empData.departmentName || '--'}</span>
                  </span>
                </li>
                <li className="employee-profile-card-meta-item">
                  <Icon icon={icons.calendar} className="employee-profile-card-meta-icon" />
                  <span className="employee-profile-card-meta-value">
                    <span>Date Of Join:</span>
                    <span className="font-medium">
                      {empData?.doj ? getDateToDDMMYYYYformat(empData.doj) : '--'}
                    </span>
                  </span>
                </li>
                <li className="employee-profile-card-meta-item">
                  <Icon icon={icons.officeBuilding} className="employee-profile-card-meta-icon" />
                  <span className="employee-profile-card-meta-value">
                    <CompanyLogo
                      logoUrl={empData.companyLogoUrl}
                      className="employee-profile-card-meta-avatar"
                      rounded="full"
                    />
                    <span className="font-medium">{empData.companyName || '--'}</span>
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
                  <span className="info-card-value">{empData.contactNumber || '--'}</span>
                </li>
                <li className="info-card-row">
                  <Icon icon={icons.email} className="info-card-icon" />
                  <span className="info-card-label">Email</span>
                  <span className="info-card-value info-card-value-inline">
                    {empData.personalEmail || '--'}
                  </span>
                </li>
                <li className="info-card-row">
                  <Icon icon={icons.gender} className="info-card-icon" />
                  <span className="info-card-label">Gender</span>
                  <span className="info-card-value">{empData.gender || '--'}</span>
                </li>
                <li className="info-card-row">
                  <Icon icon={icons.birthday} className="info-card-icon" />
                  <span className="info-card-label">Birthday</span>
                  <span className="info-card-value">
                    {empData?.dob ? getDateToDDMMYYYYformat(empData.dob, false) : '--'}
                  </span>
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
                  <Icon icon={icons.gender} className="info-card-icon" />
                  <span className="info-card-label">Nationality</span>
                  <span className="info-card-value">{empData.nationality || '--'}</span>
                </li>
                <li className="info-card-row">
                  <Icon icon={icons.religion} className="info-card-icon" />
                  <span className="info-card-label">Religion</span>
                  <span className="info-card-value">{empData.religion || '--'}</span>
                </li>
                <li className="info-card-row">
                  <Icon icon={icons.marital} className="info-card-icon" />
                  <span className="info-card-label">Marital status</span>
                  <span className="info-card-value">{empData.maritalStatus || '--'}</span>
                </li>
                <li className="info-card-row">
                  <Icon icon={icons.blood} className="info-card-icon" />
                  <span className="info-card-label">Blood Group</span>
                  <span className="info-card-value">{empData.bloodGroup || '--'}</span>
                </li>
              </ul>
            </div>

            <div className="info-card">
              <div className="info-card-header">
                <h2 className="info-card-title">Emergency Contact Number</h2>
              </div>
              <div className="emergency-contact-card">
                <div className="emergency-contact-item">
                  {/* <span className="emergency-contact-label">Primary</span> */}
                  <div className="emergency-contact-row">
                    <div className="emergency-contact-name-relation">
                      <span className="emergency-contact-name">
                        {empData.emergencyContactPerson || '--'}
                      </span>
                      {/* <span className="emergency-contact-sep" /> */}
                      <span className="emergency-contact-relation">
                        {/* {primaryContact?.relationType || '--'} */}
                      </span>
                    </div>
                    <span className="emergency-contact-number">
                      {empData.emergencyContactNum || '--'}
                    </span>
                  </div>
                </div>
                {/* <div className="emergency-contact-item">
                <span className="emergency-contact-label">Secondary</span>
                <div className="emergency-contact-row">
                  <div className="emergency-contact-name-relation">
                    <span className="emergency-contact-name">
                      {secondaryContact ? secondaryContact.memberName : '--'}
                    </span>
                    <span className="emergency-contact-sep" />
                    <span className="emergency-contact-relation">
                      {secondaryContact?.relationType || '--'}
                    </span>
                  </div>
                  <span className="emergency-contact-number">
                    {secondaryContact?.contactNumber || '--'}
                  </span>
                </div>
              </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="view-employee-details-right">
          {/* <Accordion title="About Employee">
          <p className="text-gray-600 text-sm">--</p>
        </Accordion> */}

          <Accordion title="Bank Information" startIcon={icons.bank}>
            <p className="flex items-center text-sm gap-2">
              <Icon icon={icons.profile} />
              Account Holder Name : {empData.bankAccHolderName}
            </p>
            <table className="family-table">
              <thead>
                <tr>
                  <th>Bank Name</th>
                  <th>Bank Acc No.</th>
                  <th>IFSC Code</th>
                  <th>Branch</th>
                  <th>view</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{empData.bankName || '--'}</td>
                  <td>{empData.bankAccNum || '--'}</td>
                  <td>{empData.ifscCode || '--'}</td>
                  <td>{empData.bankBranch || '--'}</td>
                  <td>
                    <Icon
                      icon="mdi:eye-outline"
                      style={{ color: '#dc2626' }}
                      className="cursor-pointer w-5 h-5"
                      onClick={() => handleViewDocument(empData.bankPassbookUrl)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Accordion>
          <div className="accordions-row">
            {/* <SalaryDetails /> */}
            <Accordion title="Statutory" startIcon={icons.cardAccount}>
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-sm">UAN</p>
                <span>-</span> <span className="text-[12px]">{empData.uanNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-sm">ESI</p>
                <span>-</span> <span className="text-[12px]">{empData.esiNumber || '--'}</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-sm">PF</p>
                <span>-</span> <span className="text-[12px]">{empData.pfNumber || '--'}</span>
              </div>
            </Accordion>
          </div>

          <Accordion title="Address" startIcon={icons.address} defaultExpanded>
            <div className="border-b pb-3">
              <AddressBlock
                title="Permanent Address"
                startIcon={icons.home}
                address={permanentAdd}
              />
            </div>

            <div className="pt-3">
              <AddressBlock
                title="Current Address"
                startIcon={icons.location}
                address={currentAdd}
              />
            </div>
          </Accordion>
          <Accordion title="Documents" startIcon={icons.doc}>
            <table className="family-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Documents Number</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {empData.documents?.length > 0 ? (
                  empData.documents.map((row, i) => (
                    <tr key={i}>
                      <td>{row.documentName || '--'}</td>
                      <td>{row.documentNumber || '--'}</td>
                      <td>
                        <Icon
                          icon="mdi:eye-outline"
                          style={{ color: '#dc2626' }}
                          className="cursor-pointer w-5 h-5"
                          onClick={() => handleViewDocument(row.documentUrl)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-gray-500 text-sm text-center">
                      --
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Accordion>

          <Accordion title="Family Information" startIcon={icons.family}>
            {empData.familyDetails?.length > 0 ? (
              <table className="family-table">
                <thead>
                  <tr>
                    <th>Relationship</th>
                    <th>Name</th>
                    <th>Date of birth</th>
                    <th>Phone</th>
                    <th>Aadhar</th>
                  </tr>
                </thead>
                <tbody>
                  {empData.familyDetails.map((row, i) => (
                    <tr key={i}>
                      <td>{row.relationType || '--'}</td>
                      <td>{row.memberName || '--'}</td>
                      <td>{row.dob ? getDateToDDMMYYYYformat(row.dob, false) : '--'}</td>
                      <td>{row.contactNumber || '--'}</td>
                      <td>
                        {row.aadharNumber || '--'}
                        {row.aadharUrl && (
                          <a href={row.aadharUrl} target="_blank">
                            <IconButton>
                              <Icon
                                icon={icons.eyeIcon}
                                style={{ color: '#f26522' }}
                                className="cursor-pointer w-5 h-5 flex-shrink-0"
                                title="View salary"
                              />
                            </IconButton>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm">--</p>
            )}
          </Accordion>

          <div className="accordions-row">
            <Accordion title="Education Details" startIcon={icons.education}>
              {empData.employeeEducation?.length > 0 ? (
                <ul className="education-details-list">
                  {empData.employeeEducation.map((education, i) => {
                    const yearRange =
                      education.startYear && education.endYear
                        ? `${education.startYear} - ${education.endYear}`
                        : education.completionYear || '--';
                    return (
                      <li key={i} className="education-details-entry">
                        <div className="education-details-content">
                          <div className="education-details-institution flex justify-between">
                            {education.institutionName || '--'}
                            <i>{yearRange}</i>
                          </div>
                          <div className="education-details-degree flex items-center justify-between">
                            <p className="flex items-center gap-2">
                              {education.qualificationLevel || '--'}
                              <span className="emergency-contact-sep" />
                              {education.degreeName || '--'}
                              <span className="emergency-contact-sep" />
                              {education.specialization || '--'}
                            </p>
                            <p className="text-[var(--status-green)] flex items-center text-sm">
                              <Icon icon={icons.starContain} />
                              {''} <span>{education.gradeOrPercentage}</span>
                            </p>
                          </div>
                        </div>
                        {/* <div className="education-details-years">{yearRange}</div> */}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">--</p>
              )}
            </Accordion>
            <Accordion title="Experience" startIcon={icons.exper}>
              {empData.experiences?.length > 0 ? (
                <ul className="experience-details-list">
                  {empData.experiences.map((exp, i) => {
                    return (
                      <li key={exp.id || i} className="experience-details-entry">
                        <div className="experience-details-content flex flex-col gap-3">
                          <div className="experience-details-company">
                            {exp.companyName || '--'}
                            <span className="text-[var(--dark-green)]">
                              {' '}
                              ({exp.totalExperience})
                            </span>
                          </div>
                          <DocumentCard
                            label="Relieving Letter"
                            icon={icons.eyeIcon}
                            href={exp.relivingUrl}
                          />
                          <DocumentCard
                            label="Experience Letter"
                            icon={icons.eyeIcon}
                            href={exp.experienceUrl}
                          />
                          <DocumentCard
                            label="Pay Slip"
                            icon={icons.eyeIcon}
                            href={exp.paySlipUrl}
                          />
                          <DocumentCard
                            label="Bank Statement"
                            icon={icons.eyeIcon}
                            href={exp.bankStatementUrl}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">--</p>
              )}
            </Accordion>
          </div>

          {/* <div className="projects-assets-card">
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
                      <span className="project-card-tasks-total">{project.tasksTotal} tasks</span>
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
                    <button type="button" className="asset-card-menu" aria-label="More options">
                      <Icon icon="mdi:dots-vertical" className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsNew;
