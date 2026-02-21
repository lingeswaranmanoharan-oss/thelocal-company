import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import { addEmployeeSalary } from '../../services/services';
import toaster from '../../../../services/toasterService';

const basciMaxDigit = 999999999
const maxDigit = 99999999

const salaryBreakupSchema = yup.object().shape({
  basic: yup
    .number()
    .nullable()
    .required('Basic is required')
    .min(0, 'Basic must be 0 or greater')
    .max(basciMaxDigit, 'Basic must not exceed 9 digits'),
  houseRentAllowancePct: yup
    .number()
    .nullable()
    .required('House Rent Allowance is required')
    .min(0, 'House Rent Allowance must be 0 or greater')
    .max(100, 'House Rent Allowance must not exceed 100'),
  conveyance: yup
    .number()
    .nullable()
    .required('Conveyance Allowance is required')
    .min(0, 'Conveyance Allowance must be 0 or greater')
    .max(maxDigit, 'Conveyance Allowance must not exceed 8 digits'),
  medical: yup
    .number()
    .nullable()
    .required('Medical Allowance is required')
    .min(0, 'Medical Allowance must be 0 or greater')
    .max(maxDigit, 'Medical Allowance must not exceed 8 digits'),
  adhoc: yup
    .number()
    .nullable()
    .required('Adhoc Allowance is required')
    .min(0, 'Adhoc Allowance must be 0 or greater')
    .max(maxDigit, 'Adhoc Allowance must not exceed 8 digits'),
  food: yup
    .number()
    .nullable()
    .required('Food Allowance is required')
    .min(0, 'Food Allowance must be 0 or greater')
    .max(maxDigit, 'Food Allowance must not exceed 8 digits'),
  travel: yup
    .number()
    .nullable()
    .required('Travel Allowance is required')
    .min(0, 'Travel Allowance must be 0 or greater')
    .max(maxDigit, 'Travel Allowance must not exceed 8 digits'),
  lta: yup
    .number()
    .nullable()
    .required('LTA (Leave Travel Allowance) is required')
    .min(0, 'LTA (Leave Travel Allowance) must be 0 or greater')
    .max(maxDigit, 'LTA (Leave Travel Allowance) must not exceed 8 digits'),
  bonus: yup
    .number()
    .nullable()
    .required('Bonus is required')
    .min(0, 'Bonus must be 0 or greater')
    .max(maxDigit, 'Bonus must not exceed 8 digits'),
  employerPfPct: yup
    .number()
    .nullable()
    .required('Employers cont. to Provident Fund (%) is required')
    .min(0, 'Employers cont. to Provident Fund must be 0 or greater')
    .max(100, 'Employers cont. to Provident Fund must not exceed 100'),
  employeePfPct: yup
    .number()
    .nullable()
    .required('Employees cont. to Provident Fund (%) is required')
    .min(0, 'Employees cont. to Provident Fund must be 0 or greater')
    .max(100, 'Employees cont. to Provident Fund must not exceed 100'),
  employerEsic: yup
    .number()
    .nullable()
    .required('Employers cont. to ESIC is required')
    .min(0, 'Employers cont. to ESIC must be 0 or greater')
    .max(maxDigit, 'Employers cont. to ESIC must not exceed 8 digits'),
  employeeEsic: yup
    .number()
    .nullable()
    .required('Employees cont. to ESIC is required')
    .min(0, 'Employees cont. to ESIC must be 0 or greater')
    .max(maxDigit, 'Employees cont. to ESIC must not exceed 8 digits'),
  professionTax: yup
    .number()
    .nullable()
    .required('Profession Tax is required')
    .min(0, 'Profession Tax must be 0 or greater')
    .max(maxDigit, 'Profession Tax must not exceed 8 digits'),
});

const HRA_PCT_FIELD = { key: 'houseRentAllowancePct', label: 'House Rent Allowance' };

const MANUAL_AMOUNT_FIELDS = [
  { key: 'conveyance', label: 'Conveyance Allowance' },
  { key: 'medical', label: 'Medical Allowance' },
  { key: 'adhoc', label: 'Adhoc Allowance' },
  { key: 'food', label: 'Food Allowance' },
  { key: 'travel', label: 'Travel Allowance' },
  { key: 'lta', label: 'LTA (Leave Travel Allowance)' },
  { key: 'bonus', label: 'Bonus' },
];

const defaultFormData = {
  basic: null,
  houseRentAllowancePct: null,
  conveyance: null,
  medical: null,
  adhoc: null,
  food: null,
  travel: null,
  lta: null,
  bonus: null,
  employerPfPct: null,
  employeePfPct: null,
  employerEsic: null,
  employeeEsic: null,
  professionTax: null,
};

const FormRow = ({ label, children, yearlyValue, className = '', error }) => (
  <div className={className}>
    <div className="flex items-stretch gap-4 py-2">
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <label className={"w-56 flex-shrink-0 text-sm font-medium text-gray-700"}>{label}</label>
        <div className="flex-1 flex items-center justify-end gap-2 flex-wrap min-w-0">{children}</div>
      </div>
      <div className="w-36 flex-shrink-0 flex items-center justify-end">
        {yearlyValue != null && (
          <Input type="number" value={yearlyValue} disabled className="w-full bg-gray-50 text-right" />
        )}
      </div>
    </div>
    {error && (
      <div className="flex items-center gap-4">
        <span className="w-56" />
        <div className="flex-1 text-sm text-red-600 mt-1 text-right">{error}</div>
        <div className="w-36 flex-shrink-0" />
      </div>
    )}
  </div>
);

const mapApiDataToFormData = (data) => {
  if (!data || typeof data !== 'object') return defaultFormData;
  const basic = data.basic || 0;
  const form = {
    basic,
    houseRentAllowancePct: ((data.hra) || 0) / basic * 100,
    conveyance: data.conveyance ?? null,
    medical: data.medical ?? null,
    adhoc: data.adhoc ?? null,
    food: data.food ?? null,
    travel: data.travel ?? null,
    lta: data.lta ?? null,
    bonus: data.bonus ?? null,
    employerPfPct:(data.employerPf / basic) * 100,
    employeePfPct:(data.employerPf / basic) * 100,
    employerEsic: data.employerEsic ?? null,
    employeeEsic: data.employeeEsic ?? null,
    professionTax: data.professionalTax ?? null,
  };
  return form;
};

const AddSalaryPopup = ({ employeeId, onClose, onSuccess, viewMode = false, initialData = null }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(mapApiDataToFormData(initialData));
    }
  }, [initialData]);

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
    const isPfPct = field === 'employerPfPct' || field === 'employeePfPct';
    setFormData((prev) => {
      const next = { ...prev, [field]: numValue };
      if (isPfPct) next.employerPfPct = next.employeePfPct = numValue;
      return next;
    });
    if (isPfPct) {
      await validateField('employerPfPct', numValue);
      await validateField('employeePfPct', numValue);
    } else {
      await validateField(field, numValue);
    }
  };

  const handleNumberChange = (field, e) => {
    handleChange(field, e.target.value);
  };

  const basic = formData.basic || 0;
  const hraAmount = Math.round((basic * (formData.houseRentAllowancePct || 0)) / 100);
  const employerPfAmount = Math.round((basic * (formData.employerPfPct || 0)) / 100);
  const employeePfAmount = Math.round((basic * (formData.employeePfPct || 0)) / 100);

  const allowanceTotal =
    (formData.conveyance || 0) +
    (formData.medical || 0) +
    (formData.adhoc || 0) +
    (formData.food || 0) +
    (formData.travel || 0) +
    (formData.lta || 0) +
    (formData.bonus || 0);
  const grossSalary = basic + hraAmount + allowanceTotal;

  const { employerEsic, employeeEsic, professionTax } = formData;
  const ctc = grossSalary + employerPfAmount + (employerEsic || 0);
  const netTakeHome = grossSalary - employeePfAmount - (employeeEsic || 0) - (professionTax || 0);

  const yearly = (value) => (value * 12);

  const submitSalaryData = async () => {
    try {
      const payload = {
        employeeId: employeeId,
        basic,
        hra: hraAmount,
        conveyance: formData.conveyance ?? 0,
        medical: formData.medical ?? 0,
        adhoc: formData.adhoc ?? 0,
        food: formData.food ?? 0,
        travel: formData.travel ?? 0,
        lta: formData.lta ?? 0,
        bonus: formData.bonus ?? 0,
        gross: grossSalary,
        employerPf: employerPfAmount,
        employerEsic: employerEsic ?? 0,
        employeePf: employeePfAmount,
        employeeEsic: employeeEsic ?? 0,
        professionalTax: professionTax ?? 0,
      };
      const response = await addEmployeeSalary(payload);
      if (response?.success) {
        toaster.success(response?.message);
        onSuccess?.();
        onClose?.();
      } else {
        toaster.error(response?.message);
      }
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data?.error || {};
        toaster.error(message);
      } else if (error.data) {
        const { message } = error.data.error || {};
        toaster.error(message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErrors({});
    setIsLoading(true);
    try {
      await salaryBreakupSchema.validate(formData, { abortEarly: false });
      await submitSalaryData();
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          if (err.path) validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-h-[70vh] pt-2">
      <form className="flex flex-col min-h-0 flex-1 flex" onSubmit={viewMode ? (e) => e.preventDefault() : handleSubmit}>
        <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
          <div className="flex items-center gap-4 py-2 border-b border-gray-200">
            <div className="flex-1 flex items-center gap-4 min-w-0">
              <span className={"w-56 flex-shrink-0 text-sm font-semibold text-gray-700"}>Monthly</span>
              <div className="flex-1" />
            </div>
            <div className="w-36 flex-shrink-0 text-right text-sm font-semibold text-gray-700">Yearly</div>
          </div>

          <FormRow label="Basic" yearlyValue={yearly(formData.basic)}>
            <Input
              type="number"
              min={0}
              value={formData.basic ?? ''}
              onChange={(e) => !viewMode && handleNumberChange('basic', e)}
              error={errors.basic}
              className="max-w-[140px]"
              disabled={viewMode}
            />
          </FormRow>
          <FormRow label={HRA_PCT_FIELD.label} yearlyValue={yearly(hraAmount)} error={errors.houseRentAllowancePct}>
            <Input
              type="number"
              min={0}
              max={100}
              value={formData.houseRentAllowancePct ?? ''}
              onChange={(e) => !viewMode && handleNumberChange('houseRentAllowancePct', e)}
              className="min-w-[120px] w-[120px]"
              rightIcon={<span className="text-gray-500 text-sm font-medium">%</span>}
              disabled={viewMode}
            />
            <Input
              type="number"
              value={hraAmount ?? ''}
              disabled
              className="max-w-[140px] bg-gray-100"
            />
          </FormRow>
          {MANUAL_AMOUNT_FIELDS.map(({ key, label }) => (
            <FormRow key={key} label={label} yearlyValue={yearly(formData[key])} error={errors[key]}>
              <Input
                type="number"
                min={0}
                value={formData[key] ?? ''}
                onChange={(e) => !viewMode && handleNumberChange(key, e)}
                className="max-w-[140px]"
                disabled={viewMode}
              />
            </FormRow>
          ))}
          <FormRow label="Gross Salary" yearlyValue={yearly(grossSalary)}>
            <Input type="number" value={grossSalary} disabled className="max-w-[140px] bg-gray-100" />
          </FormRow>

          <hr className="my-4 border-gray-200" />

          <div className="text-sm font-medium text-gray-700 mb-2">Add:</div>
          <div className="space-y-1">
            <FormRow label="Employers cont. to Provident Fund" yearlyValue={yearly(employerPfAmount)} error={errors.employerPfPct}>
              <Input
                type="number"
                min={0}
                max={100}
                value={formData.employerPfPct ?? ''}
                onChange={(e) => !viewMode && handleNumberChange('employerPfPct', e)}
                className="min-w-[120px] w-[120px]"
                rightIcon={<span className="text-gray-500 text-sm font-medium">%</span>}
                disabled={viewMode}
              />
              <Input
                type="number"
                value={employerPfAmount ?? ''}
                disabled
                className="max-w-[140px] bg-gray-100"
              />
            </FormRow>
            <FormRow label="Employers cont. to ESIC" yearlyValue={yearly(employerEsic)} error={errors.employerEsic}>
              <Input
                type="number"
                min={0}
                value={formData.employerEsic ?? ''}
                onChange={(e) => !viewMode && handleNumberChange('employerEsic', e)}
                className="max-w-[140px]"
                disabled={viewMode}
              />
            </FormRow>
            <FormRow label="Cost to Company (CTC) per month" yearlyValue={yearly(ctc)}>
              <Input type="number" value={ctc} disabled className="max-w-[140px] bg-gray-100" />
            </FormRow>
          </div>

          <hr className="my-4 border-gray-200" />

          <div className="text-sm font-medium text-gray-700 mb-2">Less:</div>
          <div className="space-y-1">
            <FormRow label="Employees cont. to Provident Fund" yearlyValue={yearly(employeePfAmount)} error={errors.employeePfPct}>
              <Input
                type="number"
                min={0}
                max={100}
                value={formData.employeePfPct ?? ''}
                onChange={(e) => !viewMode && handleNumberChange('employeePfPct', e)}
                className="min-w-[120px] w-[120px]"
                rightIcon={<span className="text-gray-500 text-sm font-medium">%</span>}
                disabled={viewMode}
              />
              <Input
                type="number"
                value={employeePfAmount ?? ''}
                disabled
                className="max-w-[140px] bg-gray-100"
              />
            </FormRow>
            <FormRow label="Employees cont. to ESIC" yearlyValue={yearly(employeeEsic)} error={errors.employeeEsic}>
              <Input
                type="number"
                min={0}
                value={formData.employeeEsic ?? ''}
                onChange={(e) => !viewMode && handleNumberChange('employeeEsic', e)}
                className="max-w-[140px]"
                disabled={viewMode}
              />
            </FormRow>
            <FormRow label="Profession Tax" yearlyValue={yearly(professionTax)} error={errors.professionTax}>
              <Input
                type="number"
                min={0}
                value={formData.professionTax ?? ''}
                onChange={(e) => !viewMode && handleNumberChange('professionTax', e)}
                className="max-w-[140px]"
                disabled={viewMode}
              />
            </FormRow>
            <FormRow label="Net take home salary monthly" yearlyValue={yearly(netTakeHome)}>
              <Input type="number" value={netTakeHome} disabled className="max-w-[140px] bg-gray-100" />
            </FormRow>
          </div>
        </div>

        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
          {viewMode ? (
            <Button type="button" variant="primary" onClick={onClose}>
              Close
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddSalaryPopup;
