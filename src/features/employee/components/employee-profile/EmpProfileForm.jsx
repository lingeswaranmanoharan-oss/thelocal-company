import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, set } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Stepper from './Stepper';
import { stepSchemas } from './employeeSchema';
// import toaster from '../../../../services/toasterService';
import {
  buttonPrimary,
  buttonSecondary,
  formContainer,
  gridTwo,
  pageWrapper,
  sectionTitle,
} from './styles';
import { useNavigate } from 'react-router-dom';
import { getCompanyId } from '../../../../utils/functions';
import toaster from '../../../../services/toasterService';
import {
  StepAcademic,
  StepAddress,
  StepDependencyBank,
  StepDocumentDetails,
  StepEmployment,
  StepExperience,
  StepFamilyDetails,
  StepPassport,
  StepPersonal,
} from './EachFormSection';
import { EMPLOYEE_STEPS } from './EmployeeSteps';
import { familyDetails } from './formConfigs';
import { Button } from '../../../../components/Button/Button';
import UpdateProfilePopup from './UpdateProfilePopup/UpdateProfilePopup';
import useRouteInformation from '../../../../hooks/useRouteInformation';
import { getEmpById, putEmpData } from '../../services/services';

export default function EmpProfileForm() {
  const [step, setStep] = useState(0);
  const [empData, setEmpData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const navigate = useNavigate();
  const { pathParams } = useRouteInformation();
  const defaultAddress = [
    {
      addressType: 'CURRENT',
      city: '',
      state: '',
      pinCode: '',
      country: '',
      doorNum: '',
      landMark: '',
      areaDetails: '',
    },
    {
      addressType: 'PERMANENT',
      city: '',
      state: '',
      pinCode: '',
      country: '',
      doorNum: '',
      landMark: '',
      areaDetails: '',
    },
  ];

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(stepSchemas[step]),
    mode: 'onChange',
    defaultValues: {
      nationality: 'India',
      addresses: defaultAddress,
      experiences: [
        {
          companyName: '',
          totalExperience: '',
          experienceUrl: '',
          relivingUrl: '',
          paySlipUrl: '',
          bankStatementUrl: '',
        },
      ],
      employeeEducation: [
        {
          qualificationLevel: '',
          degreeName: '',
          specialization: '',
          institutionName: '',
          universityName: '',
          startYear: '',
          endYear: '',
          gradeOrPercentage: '',
          educationDocumentUrl: '',
          completionYear: '',
        },
      ],
      familyDetails: [
        {
          relationType: '',
          dob: '',
          contactNumber: '',
          emailId: '',
          aadharNumber: '',
          aadharUrl: '', // IMPORTANT for file upload
          memberName: '',
          occupation: '',
        },
      ],
      documents: [
        {
          documentName: '',
          documentNumber: '',
          documentUrl: '', // REQUIRED for inputImage upload
        },
      ],
    },
  });

  const steps = [
    <StepPersonal
      register={register}
      errors={errors}
      setValue={setValue}
      getValues={getValues}
      watch={watch}
      trigger={trigger}
    />,
    <StepAddress
      register={register}
      errors={errors}
      setValue={setValue}
      getValues={getValues}
      trigger={trigger}
    />,
    <StepFamilyDetails
      register={register}
      errors={errors}
      getValues={getValues}
      watch={watch}
      setValue={setValue}
      control={control}
    />,
    <StepAcademic
      register={register}
      errors={errors}
      control={control}
      getValues={getValues}
      setValue={setValue}
    />,
    // <StepEmployment
    //   register={register}
    //   errors={errors}
    //   setValue={setValue}
    //   getValues={getValues}
    // />,
    <StepExperience
      register={register}
      control={control}
      errors={errors}
      setValue={setValue}
      getValues={getValues}
      watch={watch}
    />,
    <StepDependencyBank register={register} control={control} errors={errors} />,
    <StepDocumentDetails
      register={register}
      control={control}
      errors={errors}
      getValues={getValues}
      setValue={setValue}
    />,
  ];
  const getStepData = (step) => {
    const v = getValues();

    if (step === 0) {
      return {
        employeeName: v.employeeName,
        dob: v.dob,
        gender: v.gender,
        maritalStatus: v.maritalStatus,
        bloodGroup: v.bloodGroup,
        nationality: v.nationality,
        personalEmail: v.personalEmail,
        contactNumber: v.contactNumber,
        aadhaarNumber: v.aadhaarNumber,
      };
    }

    if (step === 1) {
      return {
        currentAddressSelected: v.currentAddressSelected,
        addresses: v.addresses,
      };
    }
    if (step === 2) {
      return {
        familyDetails: v.familyDetails,
      };
    }
    if (step === 3) {
      return {
        employeeEducation: v.employeeEducation,
      };
    }
    if (step === 4) {
      return {
        employment: v.employment,
      };
    }
    if (step === 5) {
      return {
        experiences: v.experiences,
      };
    }
    if (step === 6) {
      return {
        bankAccHolderName: v.bankAccHolderName,
        bankAccNum: v.bankAccNum,
        bankBranch: v.bankBranch,
        bankName: v.bankName,
        ifscCode: v.ifscCode,
        panNumber: v.panNumber,
      };
    }
    if (step === 7) {
      return {
        documents: v.documents,
      };
    }

    return {};
  };

  const saveStepToLocalStorage = (step) => {
    const storageKey = 'EMP_PROFILE_FORM';
    const stepLabel = EMPLOYEE_STEPS[step];

    const existing = JSON.parse(localStorage.getItem(storageKey)) || {};

    const stepData = getStepData(step);

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...existing,
        ...stepData,
      }),
    );
  };
  const handleNext = async () => {
    const valid = await trigger();
    if (!valid) return;
    // const stepData = getStepData(step);

    // saveStepToLocalStorage(step);

    setStep(step + 1);
  };

  const handleStepClick = async (targetStep) => {
    if (targetStep <= step) {
      setStep(targetStep);
      return;
    }
    const valid = await trigger();
    if (valid) setStep(targetStep);
  };

  const fillFormFromApi = (data) => {
    // STEP 1 – PERSONAL
    setValue('firstName', data.firstName ?? '');
    setValue('lastName', data.lastName ?? '');
    setValue('dob', data.dob ?? '');
    setValue('gender', data.gender ?? '');
    setValue('maritalStatus', data.maritalStatus ?? '');
    setValue('bloodGroup', data.bloodGroup ?? '');
    setValue('nationality', data.nationality || 'India');
    setValue('personalEmail', data.personalEmail ?? '');
    setValue('religion', data.religion || '');
    setValue('contactNumber', data.contactNumber ?? '');
    setValue('aadhaarNumber', data.aadharNumber ?? '');
    setValue('profileUrl', data.profileUrl || '');
    setValue('emergencyContactPerson', data.emergencyContactPerson || '');
    setValue('emergencyContactNum', data.emergencyContactNum || '');

    // STEP 2 – ADDRESS
    const apiAddresses = data.addresses || [];

    const current = apiAddresses.find((a) => a.addressType === 'CURRENT');
    const permanent = apiAddresses.find((a) => a.addressType === 'PERMANENT');

    const currentAddressSelected = !!data.currentAddressSelected;

    setValue(
      'addresses',
      [
        {
          addressType: 'CURRENT',
          city: current?.city ?? '',
          state: current?.state ?? '',
          pinCode: current?.pinCode ?? '',
          country: current?.country ?? '',
          doorNum: current?.doorNum ?? '',
          landMark: current?.landMark ?? '',
          areaDetails: current?.areaDetails ?? '',
        },
        {
          addressType: 'PERMANENT',
          city: currentAddressSelected ? (current?.city ?? '') : (permanent?.city ?? ''),
          state: currentAddressSelected ? (current?.state ?? '') : (permanent?.state ?? ''),
          pinCode: currentAddressSelected ? (current?.pinCode ?? '') : (permanent?.pinCode ?? ''),
          country: currentAddressSelected ? (current?.country ?? '') : (permanent?.country ?? ''),
          doorNum: currentAddressSelected ? (current?.doorNum ?? '') : (permanent?.doorNum ?? ''),
          landMark: currentAddressSelected
            ? (current?.landMark ?? '')
            : (permanent?.landMark ?? ''),
          areaDetails: currentAddressSelected
            ? (current?.areaDetails ?? '')
            : (permanent?.areaDetails ?? ''),
        },
      ],
      { shouldDirty: false },
    );
    setValue('currentAddressSelected', currentAddressSelected);
    // setValue('panNumber', data.panNumber ?? '');
    setValue('bankName', data.bankName ?? '');
    setValue('bankAccHolderName', data.bankAccHolderName ?? '');
    setValue('bankAccNum', data.bankAccNum ?? '');
    setValue('bankBranch', data.bankBranch ?? '');
    setValue('ifscCode', data.ifscCode ?? '');
    setValue('uanNumber', data.uanNumber ?? '');
    setValue('esiNumber', data.esiNumber ?? '');

    setValue('employmentTypeId', data.employmentTypeId);
    setValue('departmentId', data.departmentId);
    setValue('designationId', data.designationId);
    setValue('officialEmail', data.officialEmail);
    setValue('doj', data.doj);

    if (Array.isArray(data.familyDetails)) {
      data.familyDetails.length > 0 &&
        setValue(
          'familyDetails',
          data.familyDetails.map((item) => ({
            relationType: item.relationType ?? '',
            dob: item.dob ?? '',
            contactNumber: item.contactNumber ?? '',
            emailId: item.emailId ?? '',
            aadharNumber: item.aadharNumber ?? '',
            aadharUrl: item.aadharUrl ?? '',
            occupation: item.occupation ?? '',
            memberName: item.memberName ?? '',
          })),
          { shouldDirty: false },
        );
    }
    if (Array.isArray(data.experiences)) {
      data.experiences.length > 0 &&
        setValue(
          'experiences',
          data.experiences.map((item) => ({
            companyName: item.companyName ?? '',
            totalExperience: item.totalExperience ?? '',
            experienceUrl: item.experienceUrl ?? '',
            relivingUrl: item.relivingUrl ?? '',
            paySlipUrl: item.paySlipUrl ?? '',
            bankStatementUrl: item.bankStatementUrl ?? '',
          })),
          { shouldDirty: false },
        );
    }
    if (Array.isArray(data.employeeEducation)) {
      data.employeeEducation.length > 0 &&
        setValue(
          'employeeEducation',
          data.employeeEducation.map((item) => ({
            qualificationLevel: item.qualificationLevel ?? '',
            degreeName: item.degreeName ?? '',
            specialization: item.specialization ?? '',
            institutionName: item.institutionName ?? '',
            universityName: item.universityName ?? '',
            startYear: item.startYear ?? '',
            endYear: item.endYear ?? '',
            gradeOrPercentage: item.gradeOrPercentage ?? '',
            educationDocumentUrl: item.educationDocumentUrl ?? '',
            completionYear: item.completionYear ?? '',
          })),
          { shouldDirty: false },
        );
    }
    if (Array.isArray(data.documents)) {
      data.documents.length > 0 && setValue('documents', data.documents, { shouldDirty: false });
    }
  };

  useEffect(() => {
    const storageKey = 'EMP_PROFILE_FORM';
    const stepLabel = EMPLOYEE_STEPS[step];

    const stored = JSON.parse(localStorage.getItem(storageKey)) || {};

    const stepData = stored[stepLabel];
    if (!stepData) return;

    Object.entries(stepData).forEach(([key, value]) => {
      setValue(key, value);
    });
  }, [step]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      try {
        const response = await getEmpById(pathParams.id);
        if (response && response.success && response.data) {
          setEmpData(response.data);
          fillFormFromApi(response.data);
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

    fetchCompanyData();
  }, [navigate]);

  const putEmployee = async (payload) => {
    setIsLoading(true);
    try {
      const response = await putEmpData(pathParams.id, payload);
      if (response && response.success && response.data) {
        toaster.success(response.message);
        setIsLoading(false);
        // navigate('/My-details', { replace: true });
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

  const onSubmit = () => {
    const formData = getValues();
    const familyDetails = formData.familyDetails.filter((e) => e.relationType);
    const employeeEducation = formData.employeeEducation.filter((e) => e.qualificationLevel);

    const payload = {
      ...formData,
      employeeId: pathParams.id,
      companyId: getCompanyId(),
      profileUpdatedFlag: confirmPopup, // 🔥 Important
      activeFlag: empData.activeFlag,
      employeeEducation,
      familyDetails,
    };
    setConfirmPopup('');
    console.log('FINAL PAYLOAD ✅', payload);
    putEmployee(payload);
  };

  return (
    <div className={pageWrapper}>
      <div className={formContainer}>
        <form key={step} onSubmit={handleSubmit(onSubmit)}>
          <Stepper currentStep={step} onStepClick={handleStepClick} />
          <div className="mt-6">{steps[step]}</div>

          <div className="flex justify-between mt-10 border-t pt-6">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className={buttonSecondary}>
                Back
              </button>
            )}

            {/* {step === steps.length - 1 ? (
              <div className="flex gap-4">
                <Button variant="outline" type="submit">
                  Save
                </Button>
                <Button type="submit">Send to HR Approval</Button>
              </div>
            ) : (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            )} */}

            {step === steps.length - 1 ? (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleSubmit(() => setConfirmPopup('N'))}
                  disabled={isLoading || empData?.profileUpdatedFlag === 'Y'}
                >
                  {isLoading ? 'submitting...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit(() => setConfirmPopup('Y'))}
                  disabled={isLoading || empData?.profileUpdatedFlag === 'Y'}
                >
                  {isLoading ? 'submitting...' : 'Send to HR Approval'}
                </Button>
              </div>
            ) : (
              <div className="flex justify-end w-full gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleSubmit(() => setConfirmPopup('N'))}
                  disabled={isLoading || empData?.profileUpdatedFlag === 'Y'}
                >
                  {isLoading ? 'submitting...' : 'Save'}
                </Button>
                <Button type="button" onClick={handleNext} disabled={isLoading}>
                  Next
                </Button>
              </div>
            )}
          </div>
        </form>
        <UpdateProfilePopup
          confirmPopup={confirmPopup}
          setConfirmPopup={setConfirmPopup}
          handleSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
