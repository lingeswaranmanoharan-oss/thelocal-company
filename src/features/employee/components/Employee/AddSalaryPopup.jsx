import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import { addEmployeeSalary } from '../../services/services';
import toaster from '../../../../services/toasterService';

const basciMaxDigit = 999999999;
const maxDigit = 99999999;

const salaryBreakupSchema = yup.object().shape({
  basicMonthly: yup
    .number()
    .nullable()
    .required('Basic is required')
    .min(0, 'Basic must be 0 or greater')
    .max(basciMaxDigit, 'Basic must not exceed 9 digits'),
  hraMonthly: yup
    .number()
    .transform((value, originalValue) => {
      // handle empty input OR invalid number
      return isNaN(value) ? null : value;
    })
    .nullable()
    .required('House Rent Allowance is required')
    .min(0, 'House Rent Allowance must be 0 or greater')
    .max(100, 'House Rent Allowance must not exceed 100'),
  conveyanceMonthly: yup
    .number()
    .nullable()
    .required('Conveyance Allowance is required')
    .min(0, 'Conveyance Allowance must be 0 or greater')
    .max(maxDigit, 'Conveyance Allowance must not exceed 8 digits'),
  medicalMonthly: yup
    .number()
    .nullable()
    .required('Medical Allowance is required')
    .min(0, 'Medical Allowance must be 0 or greater')
    .max(maxDigit, 'Medical Allowance must not exceed 8 digits'),
  adhocMonthly: yup
    .number()
    .nullable()
    .required('Adhoc Allowance is required')
    .min(0, 'Adhoc Allowance must be 0 or greater')
    .max(maxDigit, 'Adhoc Allowance must not exceed 8 digits'),
  foodMonthly: yup
    .number()
    .nullable()
    .required('Food Allowance is required')
    .min(0, 'Food Allowance must be 0 or greater')
    .max(maxDigit, 'Food Allowance must not exceed 8 digits'),
  travelMonthly: yup
    .number()
    .nullable()
    .required('Travel Allowance is required')
    .min(0, 'Travel Allowance must be 0 or greater')
    .max(maxDigit, 'Travel Allowance must not exceed 8 digits'),
  ltaMonthly: yup
    .number()
    .nullable()
    .required('LTA (Leave Travel Allowance) is required')
    .min(0, 'LTA (Leave Travel Allowance) must be 0 or greater')
    .max(maxDigit, 'LTA (Leave Travel Allowance) must not exceed 8 digits'),
  bonusMonthly: yup
    .number()
    .nullable()
    .required('Bonus is required')
    .min(0, 'Bonus must be 0 or greater')
    .max(maxDigit, 'Bonus must not exceed 8 digits'),
  employerPfMonthly: yup
    .number()
    .transform((value, originalValue) => {
      return isNaN(value) ? null : value;
    })
    .nullable()
    .required('Employers cont. to Provident Fund (%) is required')
    .min(0, 'Employers cont. to Provident Fund must be 0 or greater')
    .max(100, 'Employers cont. to Provident Fund must not exceed 100'),
  employeePfMonthly: yup
    .number()
    .transform((value, originalValue) => {
      return isNaN(value) ? null : value;
    })
    .nullable()
    .required('Employees cont. to Provident Fund (%) is required')
    .min(0, 'Employees cont. to Provident Fund must be 0 or greater')
    .max(100, 'Employees cont. to Provident Fund must not exceed 100'),
  employerEsicMonthly: yup
    .number()
    .nullable()
    .required('Employers cont. to ESIC is required')
    .min(0, 'Employers cont. to ESIC must be 0 or greater')
    .max(maxDigit, 'Employers cont. to ESIC must not exceed 8 digits'),
  employeeEsicMonthly: yup
    .number()
    .nullable()
    .required('Employees cont. to ESIC is required')
    .min(0, 'Employees cont. to ESIC must be 0 or greater')
    .max(maxDigit, 'Employees cont. to ESIC must not exceed 8 digits'),
  professionalTaxMonthly: yup
    .number()
    .nullable()
    .required('Profession Tax is required')
    .min(0, 'Profession Tax must be 0 or greater')
    .max(maxDigit, 'Profession Tax must not exceed 8 digits'),
});

const HRA_PCT_FIELD = { key: 'houseRentAllowancePct', label: 'House Rent Allowance' };

const MANUAL_AMOUNT_FIELDS = [
  { key: 'conveyanceMonthly', label: 'Conveyance Allowance' },
  { key: 'medicalMonthly', label: 'Medical Allowance' },
  { key: 'adhocMonthly', label: 'Adhoc Allowance' },
  { key: 'foodMonthly', label: 'Food Allowance' },
  { key: 'travelMonthly', label: 'Travel Allowance' },
  { key: 'ltaMonthly', label: 'LTA (Leave Travel Allowance)' },
  { key: 'bonusMonthly', label: 'Bonus' },
];

const defaultFormData = {
  basicMonthly: null,
  hraMonthly: null,
  conveyanceMonthly: null,
  medicalMonthly: null,
  adhocMonthly: null,
  foodMonthly: null,
  travelMonthly: null,
  ltaMonthly: null,
  bonusMonthly: null,
  employerPfMonthly: null,
  employeePfMonthly: null,
  employerEsicMonthly: null,
  employeeEsicMonthly: null,
  professionalTaxMonthly: null,
};

const calculatePercentage = (amount, basic) => {
  if (!amount || !basic) return null;
  return Number(((amount / basic) * 100).toFixed(2));
};

const FormRow = ({ label, children, yearlyValue, className = '', error }) => (
  <div className={className}>
    <div className="flex items-stretch gap-4 py-2 ">
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <label className={'w-56 flex-shrink-0 text-sm font-medium text-gray-700'}>{label}</label>
        <div className="flex-1 flex items-center justify-end gap-2 flex-wrap min-w-0">
          {children}
        </div>
      </div>
      <div className="w-36 flex-shrink-0 flex items-center justify-end">
        {yearlyValue != null && (
          <Input
            type="number"
            value={yearlyValue}
            disabled
            className="w-full bg-gray-50 text-right"
          />
        )}
      </div>
    </div>
    {error && (
      <div className="flex items-center gap-4">
        <span className="w-56" />
        <div className="flex-1 text-xs text-red-600 mt-1 text-right">{error}</div>
        <div className="w-36 flex-shrink-0" />
      </div>
    )}
  </div>
);
const mapApiDataToFormData = (data) => {
  if (!data) return defaultFormData;
  const basic = data.basicMonthly ?? 0;

  return {
    basicMonthly: data.basicMonthly ?? null,
    hraMonthly: calculatePercentage(data.hraMonthly, basic),
    conveyanceMonthly: data.conveyanceMonthly ?? null,
    medicalMonthly: data.medicalMonthly ?? null,
    adhocMonthly: data.adhocMonthly ?? null,
    foodMonthly: data.foodMonthly ?? null,
    travelMonthly: data.travelMonthly ?? null,
    ltaMonthly: data.ltaMonthly ?? null,
    bonusMonthly: data.bonusMonthly ?? null,
    employerPfMonthly: calculatePercentage(data.employerPfMonthly, basic),
    employeePfMonthly: calculatePercentage(data.employeePfMonthly, basic),
    employerEsicMonthly: data.employerEsicMonthly ?? null,
    employeeEsicMonthly: data.employeeEsicMonthly ?? null,
    professionalTaxMonthly: data.professionalTaxMonthly ?? null,
  };
};

const AddSalaryPopup = ({
  employeeId,
  onClose,
  onSuccess,
  viewMode = false,
  initialData = null,
}) => {
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
    const isPfPct = field === 'employerPfMonthly' || field === 'employeePfMonthly';
    const isEsic = field === 'employerEsicMonthly' || field === 'employeeEsicMonthly';
    setFormData((prev) => {
      const next = { ...prev, [field]: numValue };
      if (isPfPct) {
        next.employerPfMonthly = numValue;
        next.employeePfMonthly = numValue;
      }
      if (isEsic) {
        next.employerEsicMonthly = numValue;
        next.employeeEsicMonthly = numValue;
      }
      return next;
    });
    if (isPfPct) {
      await validateField('employerPfMonthly', numValue);
      await validateField('employeePfMonthly', numValue);
    } else {
      await validateField(field, numValue);
    }
  };

  const handleNumberChange = (field, e) => {
    handleChange(field, e.target.value);
  };

  const basic = formData.basicMonthly || 0;
  const hraAmount = Math.round((basic * (formData.hraMonthly || 0)) / 100);
  const employerPfAmount = Math.round((basic * (formData.employerPfMonthly || 0)) / 100);
  const employeePfAmount = Math.round((basic * (formData.employeePfMonthly || 0)) / 100);

  const allowanceTotal =
    (formData.conveyanceMonthly || 0) +
    (formData.medicalMonthly || 0) +
    (formData.adhocMonthly || 0) +
    (formData.foodMonthly || 0) +
    (formData.travelMonthly || 0) +
    (formData.ltaMonthly || 0) +
    (formData.bonusMonthly || 0);
  const grossSalary = basic + hraAmount + allowanceTotal;

  const { employerEsicMonthly, employeeEsicMonthly, professionalTaxMonthly } = formData;
  const ctc = grossSalary + employerPfAmount + (employerEsicMonthly || 0);
  const netTakeHome =
    grossSalary - employeePfAmount - (employeeEsicMonthly || 0) - (professionalTaxMonthly || 0);

  const yearly = (value) => (value ?? 0) * 12;

  const addAnnualFields = (monthlyData) => {
    const payload = { ...monthlyData };

    Object.entries(monthlyData).forEach(([key, value]) => {
      if (key.endsWith('Monthly')) {
        const annualKey = key.replace('Monthly', 'Annual');
        payload[annualKey] = value == null ? null : yearly(value);
      }
    });

    return payload;
  };

  const buildSalaryPayload = (formData, employeeId) => {
    const basic = formData.basicMonthly ?? 0;

    // 🔥 convert percentage → amount
    const convertedData = {
      ...formData,

      hraMonthly: Math.round((basic * (formData.hraMonthly ?? 0)) / 100),

      employerPfMonthly: Math.round((basic * (formData.employerPfMonthly ?? 0)) / 100),

      employeePfMonthly: Math.round((basic * (formData.employeePfMonthly ?? 0)) / 100),
    };

    return {
      employeeId,
      ...addAnnualFields(convertedData),
    };
  };

  const submitSalaryData = async () => {
    try {
      // const payload = {
      //   ...formData,
      //   employeeId: employeeId,
      //   basicMonthly: basic,
      //   hraMonthly: hraAmount,
      //   grossMonthly: grossSalary,
      //   // conveyance: formData.conveyance ?? 0,
      //   // medical: formData.medical ?? 0,
      //   // adhoc: formData.adhoc ?? 0,
      //   // food: formData.food ?? 0,
      //   // travel: formData.travel ?? 0,
      //   // lta: formData.lta ?? 0,
      //   // bonus: formData.bonus ?? 0,
      //   // gross: grossSalary,
      //   // employerPf: employerPfAmount,
      //   // employerEsic: employerEsic ?? 0,
      //   // employeePf: employeePfAmount,
      //   // employeeEsic: employeeEsic ?? 0,
      //   // professionalTax: professionTax ?? 0,
      // };

      const payload = buildSalaryPayload(formData, employeeId);
      console.log('Final payload is ', payload);
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
      <form
        className="flex flex-col min-h-0 flex-1 flex"
        onSubmit={viewMode ? (e) => e.preventDefault() : handleSubmit}
      >
        <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
          <div className="flex items-center gap-4 py-2 border-b border-gray-200">
            <div className="flex-1 flex items-center justify-end gap-6 min-w-0">
              <span
                className={'w-56 flex-shrink-0 text-sm font-semibold text-gray-700 text-end'}
              ></span>
              <div className="flex-1" />
            </div>
            <div className=" flex items-center justify-end gap-6 min-w-0">
              <span className={'w-56 flex-shrink-0 text-sm font-semibold text-gray-700 text-end'}>
                Monthly
              </span>
              <div className="flex-1" />
            </div>
            <div className="w-36 flex-shrink-0  text-sm font-semibold text-gray-700 text-center">
              Yearly
            </div>
          </div>

          <FormRow label="Basic" yearlyValue={yearly(formData.basicMonthly)}>
            <Input
              type="number"
              min={0}
              value={formData.basicMonthly ?? ''}
              onChange={(e) => !viewMode && handleNumberChange('basicMonthly', e)}
              error={errors.basicMonthly}
              className="max-w-[140px]"
              disabled={viewMode}
            />
          </FormRow>
          <FormRow
            label={HRA_PCT_FIELD.label}
            yearlyValue={yearly(hraAmount)}
            error={errors.hraMonthly}
          >
            <div className="flex gap-3">
              <Input
                type="number"
                min={0}
                max={100}
                value={formData.hraMonthly ?? ''}
                onChange={(e) => !viewMode && handleNumberChange('hraMonthly', e)}
                className="w-[100px]"
                rightIcon={<span className="text-gray-500 text-sm font-medium">%</span>}
                disabled={viewMode}
              />
              <Input
                type="number"
                value={hraAmount ?? ''}
                disabled
                className="w-[140px] bg-gray-100"
              />
            </div>
          </FormRow>
          {MANUAL_AMOUNT_FIELDS.map(({ key, label }) => (
            <FormRow
              key={key}
              label={label}
              yearlyValue={yearly(formData[key])}
              error={errors[key]}
            >
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
            <Input
              type="number"
              value={grossSalary}
              disabled
              className="max-w-[140px] bg-gray-100"
            />
          </FormRow>

          <hr className="my-4 border-gray-200" />

          <div className="text-sm font-medium text-gray-700 mb-2">Add:</div>
          <div className="space-y-1">
            <FormRow
              label="Employers cont. to Provident Fund"
              yearlyValue={yearly(employerPfAmount)}
              error={errors.employerPfMonthly}
            >
              <div className="flex gap-3">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.employerPfMonthly ?? ''}
                  onChange={(e) => !viewMode && handleNumberChange('employerPfMonthly', e)}
                  className="w-[100px]"
                  rightIcon={<span className="text-gray-500 text-sm font-medium">%</span>}
                  disabled={viewMode}
                />
                <Input
                  type="number"
                  value={employerPfAmount ?? ''}
                  disabled
                  className="max-w-[150px] bg-gray-100"
                />
              </div>
            </FormRow>
            <FormRow
              label="Employers cont. to ESIC"
              yearlyValue={yearly(employerEsicMonthly)}
              error={errors.employerEsicMonthly}
            >
              <Input
                type="number"
                min={0}
                value={formData.employerEsicMonthly ?? ''}
                onChange={(e) => !viewMode && handleNumberChange('employerEsicMonthly', e)}
                className="max-w-[100px]"
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
            <FormRow
              label="Employees cont. to Provident Fund"
              yearlyValue={yearly(employeePfAmount)}
              error={errors.employeePfMonthly}
            >
              <div className="flex gap-3">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.employeePfMonthly ?? ''}
                  onChange={(e) => !viewMode && handleNumberChange('employeePfMonthly', e)}
                  className="w-[100px]"
                  rightIcon={<span className="text-gray-500 text-sm font-medium">%</span>}
                  disabled={viewMode}
                />
                <Input
                  type="number"
                  value={employeePfAmount ?? ''}
                  disabled
                  className="max-w-[140px] bg-gray-100"
                />
              </div>
            </FormRow>
            <FormRow
              label="Employees cont. to ESIC"
              yearlyValue={yearly(employeeEsicMonthly)}
              error={errors.employeeEsicMonthly}
            >
              <Input
                type="number"
                min={0}
                value={formData.employeeEsicMonthly ?? ''}
                onChange={(e) => !viewMode && handleNumberChange('employeeEsicMonthly', e)}
                className="max-w-[140px]"
                disabled={viewMode}
              />
            </FormRow>
            <FormRow
              label="Profession Tax"
              yearlyValue={yearly(professionalTaxMonthly)}
              error={errors.professionalTaxMonthly}
            >
              <Input
                type="number"
                min={0}
                value={formData.professionalTaxMonthly ?? ''}
                onChange={(e) => !viewMode && handleNumberChange('professionalTaxMonthly', e)}
                className="max-w-[140px]"
                disabled={viewMode}
              />
            </FormRow>
            <FormRow label="Net take home salary monthly" yearlyValue={yearly(netTakeHome)}>
              <Input
                type="number"
                value={netTakeHome}
                disabled
                className="max-w-[140px] bg-gray-100"
              />
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
