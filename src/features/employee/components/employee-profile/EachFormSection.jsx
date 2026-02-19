import { useEffect, useState } from 'react';
import {
  addressFields,
  bankFields,
  documentDetails,
  employeeEducation,
  employmentFields,
  experienceFields,
  familyDetails,
  passportFields,
  personalFieldsConfig,
} from './formConfigs';
import {
  buttonPrimary,
  buttonSecondary,
  formContainer,
  gridTwo,
  pageWrapper,
  sectionTitle,
} from './styles';
import { useFieldArray } from 'react-hook-form';

import dayjs from 'dayjs';
import ProfileImageUpload from '../../../../components/ProfileImageUpload/ProfileImageUpload';

import { getCompanyId } from '../../../../utils/functions';
import { ErrorMsg, Input } from '../../../../components/Input/Input';
import { Dropdown } from '../../../../components/Dropdown/Dropdown';
import DateInput from '../../../../components/DateInput/DateInput';
import { getDepartments, getDesignations, getEmployeTypes } from '../../services/services';
import CustomFormTextImageInput from '../../../../components/ImageUpload-Input/ImageUploadInput';
import { Button } from '../../../../components/Button/Button';
import FileUpload from '../../../../components/ImageUpload-Input/ImageUpload';

export const StepPersonal = ({ register, errors, setValue, getValues, watch, trigger }) => {
  const handleImageUpload = (value) => {
    setValue('profileUrl', value);
    trigger('profileUrl');
  };
  const handleDateInput = (field) => (values) => {
    setValue(field.name, values);
    trigger(field.name);
  };

  return (
    <>
      <h2 className={sectionTitle}>Personal Details</h2>
      <ProfileImageUpload value={watch('profileUrl')} onChange={handleImageUpload} />
      {errors?.profileUrl?.message && <ErrorMsg>{errors?.profileUrl?.message}</ErrorMsg>}
      <br />
      <div className={gridTwo}>
        {personalFieldsConfig.map((field) => {
          if (field.type === 'input') {
            if (field.inputType === 'date') {
              return (
                <DateInput
                  key={field.name}
                  label={field.label}
                  maxDate={dayjs()}
                  placeholder="Select DOB"
                  format="DD-MM-YYYY"
                  value={watch(field.name)}
                  handleChange={handleDateInput(field)}
                  error={errors[field.name]?.message}
                />
              );
            }
            return (
              <Input
                key={field.name}
                type={field.inputType || 'text'}
                label={field.label}
                {...register(field.name)}
                error={errors[field.name]?.message}
              />
            );
          }
          if (field.type === 'dropdown') {
            return (
              <Dropdown
                key={field.name}
                label={field.label}
                items={field.options}
                selectedValue={watch(field.name)}
                onSelect={(value) =>
                  setValue(field.name, value, {
                    shouldValidate: true,
                    shouldTouch: true,
                  })
                }
                // onSelect={(value) => handleDropdownChange(field.name, value)}
                error={errors[field.name]?.message}
              />
            );
          }

          return null;
        })}
      </div>{' '}
      <br />
      <StepEmployment getValues={getValues} watch={watch} register={register} errors={errors} />
    </>
  );
};

export const StepAddress = ({ register, errors, setValue, getValues, trigger }) => {
  const addressTypes = [
    { type: 'CURRENT', title: 'Current Address' },
    { type: 'PERMANENT', title: 'Permanent Address' },
  ];
  const currentAddressSelected = getValues('currentAddressSelected');
  const EMPTY_ADDRESS = {
    city: '',
    state: '',
    pinCode: '',
    country: '',
    doorNum: '',
    landMark: '',
    areaDetails: '',
  };

  const addresses = getValues('addresses');
  const handleSameAsCurrent = (checked) => {
    const current = addresses.find((a) => a.addressType === 'CURRENT');
    const permenentIndex = addresses.findIndex((a) => a.addressType === 'PERMANENT');

    setValue('currentAddressSelected', checked, { shouldDirty: true });

    setValue(
      'addresses',
      addresses.map((a) => {
        if (a.addressType !== 'PERMANENT') return a;

        // ✅ CHECKED → copy current → permanent
        if (checked && current) {
          return {
            ...a,
            city: current.city,
            state: current.state,
            pinCode: current.pinCode,
            country: current.country,
            doorNum: current.doorNum,
            landMark: current.landMark,
            areaDetails: current.areaDetails,
          };
        }

        // ✅ UNCHECKED → clear permanent + enable editing
        return {
          ...a,
          ...EMPTY_ADDRESS,
        };
      }),
      { shouldDirty: true, shouldTouch: true },
    );
    trigger(`addresses.${permenentIndex}`);
  };

  const currentIndex = addresses.findIndex((a) => a.addressType === 'CURRENT');

  const permanentIndex = addresses.findIndex((a) => a.addressType === 'PERMANENT');

  const syncPermanentAddress = (fieldName, value) => {
    if (!currentAddressSelected) return;
    if (currentIndex === -1 || permanentIndex === -1) return;

    setValue(`addresses.${permanentIndex}.${fieldName}`, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      {addressTypes.map(({ type, title }) => {
        const index = getValues('addresses').findIndex((a) => a.addressType === type);
        return (
          <div key={type} className="mb-4">
            <h2 className={sectionTitle}>{title}</h2>

            <div className={gridTwo}>
              {addressFields.map((field) => (
                <Input
                  key={`${type}-${field.name}`}
                  label={field.label}
                  {...register(`addresses.${index}.${field.name}`, {
                    onChange: (e) => {
                      if (type === 'CURRENT') {
                        syncPermanentAddress(field.name, e.target.value);
                      }
                    },
                  })}
                  error={errors.addresses?.[index]?.[field.name]?.message}
                  readOnly={type === 'PERMANENT' && currentAddressSelected}
                />
              ))}
            </div>

            {type === 'CURRENT' && (
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('currentAddressSelected')}
                  onChange={(e) => handleSameAsCurrent(e.target.checked)}
                />
                <label className="text-sm">Permanent address same as current address</label>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export const StepPassport = ({ register, errors, setValue, getValues }) => {
  return (
    <>
      <h2 className={sectionTitle}>Passport Details</h2>

      <div className={gridTwo}>
        {passportFields.map((field) => (
          <Input
            key={field.name}
            type={field.type || 'text'}
            label={field.label}
            {...register(`${field.name}`)}
            error={errors?.[field.name]?.message}
          />
        ))}
      </div>
    </>
  );
};
export const StepAcademic = ({ control, register, errors, setValue, getValues }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'employeeEducation',
  });

  return (
    <>
      <h2 className={sectionTitle}>Academic Details</h2>

      {fields.map((item, index) => (
        <div key={item.id} className={`${gridTwo} mb-4 pb-4 border-b border-b-gray-300 flex`}>
          {employeeEducation.map((field) => {
            if (field.type === 'file') {
              return (
                <FileUpload
                  key={field.name}
                  label={field.label}
                  value={getValues(`employeeEducation.${index}.educationDocumentUrl`)}
                  // ref={(el) => (item.educationDocumentRef = el)}
                  onChange={(val) =>
                    setValue(`employeeEducation.${index}.educationDocumentUrl`, val, {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  errormsg={errors.employeeEducation?.[index]?.educationDocumentUrl?.message}
                />
              );
            } else if (
              field.type === 'number' ||
              field.type === 'number' ||
              field.type === 'number'
            ) {
              return (
                <Input
                  key={field.name}
                  type="number"
                  label={field.label}
                  {...register(`employeeEducation.${index}.${field.name}`)}
                  error={errors.employeeEducation?.[index]?.[field.name]?.message}
                />
              );
            } else if (field.type === 'dropdown') {
              return (
                <Dropdown
                  key={field.name}
                  label={field.label}
                  items={field.options}
                  selectedValue={getValues(`employeeEducation.${index}.${field.name}`)}
                  onSelect={(value) =>
                    setValue(`employeeEducation.${index}.${field.name}`, value, {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  // error={errors.employeeEducation.${index}?.[field.name]?.message}
                />
              );
            } else {
              return (
                <Input
                  key={field.name}
                  type="text"
                  label={field.label}
                  {...register(`employeeEducation.${index}.${field.name}`)}
                  error={errors.employeeEducation?.[index]?.[field.name]?.message}
                />
              );
            }
          })}
          <div className="mt-6 flex justify-start">
            <Button
              type="button"
              onClick={() => remove(index)}
              size="sm"
              variant="outline"
              className={`col-span-2 w-fit`}
            >
              Remove Academic
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={() =>
          append({
            qualificationLevel: '',
            degreeName: '',
            specialization: '',
            institutionName: '',
            universityName: '',
            startYear: '',
            endYear: '',
            completionYear: '',
            gradeOrPercentage: '',
            educationDocumentUrl: '',
          })
        }
        size="sm"
      >
        + Add Academic
      </Button>
    </>
  );
};

export const StepEmployment = ({ register, errors, setValue, getValues }) => {
  const [typeOptions, setTypeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  useEffect(() => {
    // Fetch Employment Types
    const fetchTypes = async () => {
      try {
        const res = await getEmployeTypes({ companyId: getCompanyId() });
        if (res.success) {
          setTypeOptions(res.data.map((item) => ({ label: item.typeName, value: item.id })));
        }
      } catch (err) {
        console.error('Failed to fetch employment types', err);
      }
    };

    // Fetch Departments
    const fetchDepartments = async () => {
      try {
        const res = await getDepartments({ companyId: getCompanyId() });
        if (res.success) {
          setDepartmentOptions(
            res.data.map((item) => ({ label: item.departmentName, value: item.id })),
          );
        }
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    };

    const fetchDesignations = async () => {
      try {
        const res = await getDesignations(getCompanyId());
        if (res.success) {
          setDesignationOptions(
            res.data.map((item) => ({ label: item.designationName, value: item.id })),
          );
        }
      } catch (err) {
        console.error('Failed to fetch designations', err);
      }
    };

    fetchTypes();
    fetchDepartments();
    fetchDesignations();
  }, []);

  const getDropdownOptions = (fieldName) => {
    switch (fieldName) {
      case 'employmentTypeId':
        return typeOptions;
      case 'departmentId':
        return departmentOptions;
      case 'designationId':
        return designationOptions;
      default:
        return [];
    }
  };

  return (
    <>
      <div className={gridTwo}>
        {employmentFields.map((field) => {
          if (field.type === 'input') {
            return (
              <Input
                key={field.name}
                type={field.inputType || 'text'} // use inputType if defined
                label={field.label}
                {...register(field.name)}
                error={errors?.[field.name]?.message}
              />
            );
          } else if (field.type === 'dropdown') {
            return (
              <Dropdown
                key={field.name}
                label={field.label}
                items={getDropdownOptions(field.name)}
                selectedValue={getValues(field.name)}
                onSelect={(value) => {
                  setValue(field.name, value, {
                    shouldValidate: true,
                    shouldTouch: true,
                  });
                }}
                error={errors?.[field.name]?.message}
                disabled
              />
            );
          } else {
            return null; // in case of an unknown field type
          }
        })}
      </div>
    </>
  );
};

export const StepExperience = ({ control, register, errors, setValue, getValues, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  });

  return (
    <>
      <h2 className={sectionTitle}>Work Experience</h2>
      {fields.map((_, index) => (
        <div key={index} className={`${gridTwo} mb-4 pb-4 border-b border-b-gray-300 flex`}>
          {experienceFields.map((field) => {
            const fieldPath = `experiences.${index}.${field.name}`;

            /** FILE UPLOAD */
            if (field.type === 'file') {
              return (
                // <div key={field.name} className="col-span-2">
                <FileUpload
                  key={field.name}
                  label={field.label}
                  value={getValues(fieldPath)}
                  onChange={(val) =>
                    setValue(fieldPath, val, {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  errormsg={errors.experiences?.[index]?.[field.name]?.message}
                />
                // </div>
              );
            }

            /** NORMAL INPUT */
            return (
              <Input
                key={field.name}
                type={field.type || 'text'}
                label={field.label}
                {...register(fieldPath)}
                error={errors.experiences?.[index]?.[field.name]?.message}
              />
            );
          })}

          {/* REMOVE BUTTON */}
          <div className="mt-6 flex justify-start">
            <Button
              type="button"
              onClick={() => remove(index)}
              variant="outline"
              size="sm"
              className={`col-span-2 w-fit`}
            >
              Remove Experience
            </Button>
          </div>
        </div>
      ))}

      {/* ADD BUTTON */}
      <Button
        type="button"
        onClick={() =>
          append({
            companyName: '',
            totalExperience: '',
            experienceUrl: '',
            relivingUrl: '',
            paySlipUrl: '',
            bankStatementUrl: '',
          })
        }
        size="sm"
      >
        + Add Experience
      </Button>
    </>
  );
};

export const StepFamilyDetails = ({ control, register, errors, getValues, setValue, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'familyDetails',
  });

  const handleDateInput = (field) => (values) => {
    setValue(field, values);
  };

  return (
    <>
      <h2 className={sectionTitle}>Family Details</h2>
      {fields.map((fieldItem, index) => (
        <div key={fieldItem.id} className={`${gridTwo} mb-4 pb-4 border-b border-gray-300 flex`}>
          {familyDetails.map((field) => {
            const fieldPath = `familyDetails.${index}.${field.name}`;
            if (field.type === 'inputImage') {
              return (
                <CustomFormTextImageInput
                  label="Aadhar Number"
                  numberValue={getValues(`familyDetails.${index}.aadharNumber`)}
                  onNumberChange={(val) =>
                    setValue(`familyDetails.${index}.aadharNumber`, val, {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  fileValue={getValues(`familyDetails.${index}.aadharUrl`)}
                  onFileChange={(val) =>
                    setValue(`familyDetails.${index}.aadharUrl`, val, {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  error={
                    errors.familyDetails?.[index]?.aadharNumber?.message ||
                    errors.familyDetails?.[index]?.aadharUrl?.message
                  }
                />
              );
            }

            if (field.type === 'date') {
              return (
                <DateInput
                  label={field.label}
                  maxDate={dayjs()}
                  placeholder="Select DOB"
                  value={watch(`familyDetails.${index}.dob`)}
                  handleChange={handleDateInput(`familyDetails.${index}.dob`)}
                  error={errors.familyDetails?.[index]?.[field.name]?.message}
                />
              );
            }

            if (field.type === 'dropdown') {
              return (
                <Dropdown
                  key={field.name}
                  label={field.label}
                  items={field.options}
                  selectedValue={getValues(`familyDetails.${index}.${field.name}`)}
                  onSelect={(value) =>
                    setValue(`familyDetails.${index}.${field.name}`, value, {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  error={errors.familyDetails?.[index]?.[field.name]?.message}
                />
              );
            }

            return (
              <Input
                key={fieldPath}
                label={field.label}
                {...register(fieldPath)}
                error={errors.familyDetails?.[index]?.[field.name]?.message}
              />
            );
          })}
          <div className="mt-6 flex justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
              className={`col-span-2 w-fit`}
            >
              Remove Family Member
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={() =>
          append({
            relationType: '',
            memberName: '',
            occupation: '',
            dob: '',
            contactNumber: '',
            emailId: '',
            aadharNumber: '',
            aadharUrl: '',
          })
        }
        size="sm"
      >
        + Add Family Member
      </Button>
    </>
  );
};

export const StepDependencyBank = ({ control, register, errors, setValue, getValues }) => {
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'dependents',
  // });

  return (
    <>
      <h2 className={`${sectionTitle} mt-6`}>Bank Details</h2>
      <div className={gridTwo}>
        {bankFields.slice(0, bankFields.length - 2).map((field) => (
          <Input
            key={field.name}
            label={field.label}
            {...register(`${field.name}`)}
            error={errors?.[field.name]?.message}
          />
        ))}
      </div>
      <h2 className={`${sectionTitle} mt-6`}>Statutory Details</h2>{' '}
      <div className={gridTwo}>
        {bankFields.slice(bankFields.length - 2, bankFields.length).map((field) => (
          <Input
            key={field.name}
            label={field.label}
            {...register(`${field.name}`)}
            error={errors?.[field.name]?.message}
          />
        ))}
      </div>
    </>
  );
};

export const StepDocumentDetails = ({ control, register, errors, getValues, setValue }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents',
  });

  return (
    <>
      <h2 className={sectionTitle}>Document Details</h2>

      {fields.map((_, index) => (
        <div key={index} className={`${gridTwo} mb-4 pb-4 border-b border-gray-300 flex`}>
          {documentDetails.map((field) => {
            const fieldPath = `documents.${index}.${field.name}`;

            // 📸 Image / upload input
            if (field.type === 'inputImage') {
              if (getValues(`documents.${index}.documentName`) === 'Resume') {
                return (
                  <FileUpload
                    key={field.name}
                    label={'Resume File'}
                    value={getValues(`documents.${index}.documentUrl`)}
                    onChange={(val) =>
                      setValue(`documents.${index}.documentUrl`, val, {
                        shouldValidate: true,
                        shouldTouch: true,
                      })
                    }
                    errormsg={errors.documents?.[index]?.documentUrl?.message}
                  />
                );
              }
              return (
                <CustomFormTextImageInput
                  label="Document Number"
                  numberValue={getValues(`documents.${index}.documentNumber`)}
                  onNumberChange={(val) =>
                    setValue(`documents.${index}.documentNumber`, val, {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  fileValue={getValues(`documents.${index}.documentUrl`)}
                  onFileChange={(val) =>
                    setValue(`documents.${index}.documentUrl`, val, {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  error={
                    errors.documents?.[index]?.documentNumber?.message ||
                    errors.documents?.[index]?.documentUrl?.message
                  }
                />
              );
            }

            if (field.type === 'dropdown') {
              return (
                <Dropdown
                  key={field.name}
                  label={field.label}
                  items={field.options}
                  selectedValue={getValues(`documents.${index}.${field.name}`)}
                  onSelect={(value) =>
                    setValue(`documents.${index}.${field.name}`, value, {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  error={errors.documents?.[index]?.[field.name]?.message}
                />
              );
            }
            return (
              <Input
                key={fieldPath}
                label={field.label}
                {...register(fieldPath)}
                error={errors.documents?.[index]?.[field.name]?.message}
              />
            );
          })}
          <div className="mt-6 flex justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={`col-span-2 w-fit h-fit`}
              onClick={() => remove(index)}
            >
              Remove Document
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={() =>
          append({
            documentName: '',
            documentNumber: '',
            documentUrl: '',
          })
        }
        size="sm"
      >
        + Add Document
      </Button>
      <ErrorMsg>{errors?.documents?.message}</ErrorMsg>
    </>
  );
};
