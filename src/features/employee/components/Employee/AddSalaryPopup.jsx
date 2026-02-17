import { useState } from 'react';
import * as yup from 'yup';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';

const salaryBreakupSchema = yup.object().shape({
  basic: yup
    .number()
    .nullable()
    .required('Basic is required')
    .min(0, 'Basic must be 0 or greater'),
  houseRentAllowancePct: yup
    .number()
    .nullable()
    .required('House Rent Allowance is required')
    .min(0, 'House Rent Allowance must be 0 or greater')
    .max(100, 'House Rent Allowance must not exceed 100'),
  conveyanceAllowancePct: yup
    .number()
    .nullable()
    .required('Conveyance Allowance is required')
    .min(0, 'Conveyance Allowance must be 0 or greater')
    .max(100, 'Conveyance Allowance must not exceed 100'),
  medicalAllowancePct: yup
    .number()
    .nullable()
    .required('Medical Allowance is required')
    .min(0, 'Medical Allowance must be 0 or greater')
    .max(100, 'Medical Allowance must not exceed 100'),
  adhocAllowancePct: yup
    .number()
    .nullable()
    .required('Adhoc Allowance is required')
    .min(0, 'Adhoc Allowance must be 0 or greater')
    .max(100, 'Adhoc Allowance must not exceed 100'),
  foodAllowancePct: yup
    .number()
    .nullable()
    .required('Food Allowance is required')
    .min(0, 'Food Allowance must be 0 or greater')
    .max(100, 'Food Allowance must not exceed 100'),
  travelAllowancePct: yup
    .number()
    .nullable()
    .required('Travel Allowance is required')
    .min(0, 'Travel Allowance must be 0 or greater')
    .max(100, 'Travel Allowance must not exceed 100'),
  ltaPct: yup
    .number()
    .nullable()
    .required('LTA (Leave Travel Allowance) is required')
    .min(0, 'LTA (Leave Travel Allowance) must be 0 or greater')
    .max(100, 'LTA (Leave Travel Allowance) must not exceed 100'),
  bonusPct: yup
    .number()
    .nullable()
    .required('Bonus is required')
    .min(0, 'Bonus must be 0 or greater')
    .max(100, 'Bonus must not exceed 100'),
  employerPf: yup
    .number()
    .nullable()
    .required('Employers cont. to Provident Fund is required')
    .min(0, 'Employers cont. to Provident Fund must be 0 or greater'),
  employerEsic: yup
    .number()
    .nullable()
    .required('Employers cont. to ESIC is required')
    .min(0, 'Employers cont. to ESIC must be 0 or greater'),
  employeePf: yup
    .number()
    .nullable()
    .required('Employees cont. to Provident Fund is required')
    .min(0, 'Employees cont. to Provident Fund must be 0 or greater'),
  employeeEsic: yup
    .number()
    .nullable()
    .required('Employees cont. to ESIC is required')
    .min(0, 'Employees cont. to ESIC must be 0 or greater'),
  professionTax: yup
    .number()
    .nullable()
    .required('Profession Tax is required')
    .min(0, 'Profession Tax must be 0 or greater'),
});

const PERCENTAGE_FIELDS = [
  { key: 'houseRentAllowancePct', label: 'House Rent Allowance' },
  { key: 'conveyanceAllowancePct', label: 'Conveyance Allowance' },
  { key: 'medicalAllowancePct', label: 'Medical Allowance' },
  { key: 'adhocAllowancePct', label: 'Adhoc Allowance' },
  { key: 'foodAllowancePct', label: 'Food Allowance' },
  { key: 'travelAllowancePct', label: 'Travel Allowance' },
  { key: 'ltaPct', label: 'LTA (Leave Travel Allowance)' },
  { key: 'bonusPct', label: 'Bonus' },
];

const defaultFormData = {
  basic: null,
  houseRentAllowancePct: null,
  conveyanceAllowancePct: null,
  medicalAllowancePct: null,
  adhocAllowancePct: null,
  foodAllowancePct: null,
  travelAllowancePct: null,
  ltaPct: null,
  bonusPct: null,
  employerPf: null,
  employerEsic: null,
  employeePf: null,
  employeeEsic: null,
  professionTax: null,
};

const FormRow = ({ label, children, className = '', error }) => (
  <div className={className}>
    <div className="flex items-center gap-4 py-2">
      <label className="w-56 flex-shrink-0 text-sm font-medium text-gray-700">{label}</label>
      <div className="flex-1 flex items-center justify-end gap-2 flex-wrap">{children}</div>
    </div>
    {error && (
      <div className="flex items-center gap-4">
        <span className="w-56 flex-shrink-0" />
        <div className="flex-1 text-sm text-red-600 mt-1 text-right">{error}</div>
      </div>
    )}
  </div>
);

const AddSalaryPopup = ({ employeeId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = async (field, value) => {
    try {
      await salaryBreakupSchema.validateAt(field, { [field]: value });
      setErrors((prev) => ({ ...prev, [field]: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [field]: error.message }));
    }
  };

  const handleChange = async (field, value) => {
    const numValue =
      value === '' || value == null
        ? null
        : (() => {
            const n = Number(value);
            return Number.isNaN(n) ? null : n;
          })();
    setFormData((prev) => ({ ...prev, [field]: numValue }));
    await validateField(field, numValue);
  };

  const handleNumberChange = (field, e) => {
    handleChange(field, e.target.value);
  };

  const basic = formData.basic || 0;

  const percentageAmounts = {};

  PERCENTAGE_FIELDS.forEach((field) => {
    percentageAmounts[field.key] = Math.round((basic * (formData[field.key] || 0)) / 100);
  })

  var total = 0;

  PERCENTAGE_FIELDS.forEach((field, i) => {
    total += percentageAmounts[PERCENTAGE_FIELDS[i].key];
  })

  // for (let i = 0; i < PERCENTAGE_FIELDS.length; i++) {
  //   total += percentageAmounts[PERCENTAGE_FIELDS[i].key];
  // }
  const grossSalary = basic + total;

  const { employerPf, employerEsic, employeePf, employeeEsic, professionTax } = formData;
  const ctc = grossSalary + (employerPf || 0) + (employerEsic || 0);
  const netTakeHome = grossSalary - (employeePf || 0) - (employeeEsic || 0) - (professionTax || 0);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErrors({});
    setIsLoading(true);
    try {
      await salaryBreakupSchema.validate(formData, { abortEarly: false });
      onSuccess?.();
      onClose?.();
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach(({ path, message }) => {
          if (path) validationErrors[path] = message;
        });
        setErrors(validationErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-h-[70vh] pt-2">
      <form className="flex flex-col min-h-0 flex-1 flex" onSubmit={handleSubmit}>
        <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
          <FormRow label="Basic">
            <Input
              type="number"
              min={0}
              value={formData.basic ?? ''}
              onChange={(e) => handleNumberChange('basic', e)}
              error={errors.basic}
              className="max-w-[140px]"
            />
          </FormRow>
          {PERCENTAGE_FIELDS.map(({ key, label }) => (
            <FormRow key={key} label={label} error={errors[key]}>
              <Input
                type="number"
                min={0}
                max={100}
                value={formData[key] ?? ''}
                onChange={(e) => handleNumberChange(key, e)}
                className="min-w-[120px] w-[120px]"
                rightIcon={<span className="text-gray-500 text-sm font-medium">%</span>}
              />
              <Input
                type="number"
                value={percentageAmounts[key] ?? ''}
                disabled
                className="max-w-[140px] bg-gray-100"
              />
            </FormRow>
          ))}
          <FormRow label="Gross Salary">
            <Input type="number" value={grossSalary} disabled className="max-w-[140px] bg-gray-100" />
          </FormRow>

        <hr className="my-4 border-gray-200" />

        <div className="text-sm font-medium text-gray-700 mb-2">Add:</div>
        <div className="space-y-1">
          <FormRow label="Employers cont. to Provident Fund" error={errors.employerPf}>
            <Input
              type="number"
              min={0}
              value={formData.employerPf ?? ''}
              onChange={(e) => handleNumberChange('employerPf', e)}
              className="max-w-[140px]"
            />
          </FormRow>
          <FormRow label="Employers cont. to ESIC" error={errors.employerEsic}>
            <Input
              type="number"
              min={0}
              value={formData.employerEsic ?? ''}
              onChange={(e) => handleNumberChange('employerEsic', e)}
              className="max-w-[140px]"
            />
          </FormRow>
          <FormRow label="Cost to Company (CTC) per month">
            <Input type="number" value={ctc} disabled className="max-w-[140px] bg-gray-100" />
          </FormRow>
        </div>

        <hr className="my-4 border-gray-200" />

        <div className="text-sm font-medium text-gray-700 mb-2">Less:</div>
        <div className="space-y-1">
          <FormRow label="Employees cont. to Provident Fund" error={errors.employeePf}>
            <Input
              type="number"
              min={0}
              value={formData.employeePf ?? ''}
              onChange={(e) => handleNumberChange('employeePf', e)}
              className="max-w-[140px]"
            />
          </FormRow>
          <FormRow label="Employees cont. to ESIC" error={errors.employeeEsic}>
            <Input
              type="number"
              min={0}
              value={formData.employeeEsic ?? ''}
              onChange={(e) => handleNumberChange('employeeEsic', e)}
              className="max-w-[140px]"
            />
          </FormRow>
          <FormRow label="Profession Tax" error={errors.professionTax}>
            <Input
              type="number"
              min={0}
              value={formData.professionTax ?? ''}
              onChange={(e) => handleNumberChange('professionTax', e)}
              className="max-w-[140px]"
            />
          </FormRow>
          <FormRow label="Net take home salary monthly">
            <Input type="number" value={netTakeHome} disabled className="max-w-[140px] bg-gray-100" />
          </FormRow>
        </div>
        </div>

        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSalaryPopup;
