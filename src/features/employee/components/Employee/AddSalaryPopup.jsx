import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import * as yup from 'yup';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import DateInput from '../../../../components/DateInput/DateInput';
import { addEmployeeSalary } from '../../services/services';
import toaster from '../../../../services/toasterService';

const basicMaxDigit = 999999999;

const salaryFormSchema = yup.object().shape({
  grossMonthly: yup
    .number()
    .nullable()
    .required('Gross salary per month is required')
    .min(0, 'Salary must be 0 or greater')
    .max(basicMaxDigit, 'Salary must not exceed 9 digits'),
  effectiveStartDate: yup.string().required('Effective start date is required'),
  effectiveEndDate: yup
    .string()
    .required('Effective end date is required')
    .test(
      'end-after-start',
      'Effective end date must be on or after start date',
      (value, context) => {
        const { effectiveStartDate } = context.parent;
        if (!value || !effectiveStartDate) return true;
        return value >= effectiveStartDate;
      },
    ),
});

const salaryFieldFromApi = (value) => {
  if (value === null || value === undefined || value === '') return '';
  return value;
};

const FormRow = ({
  label,
  monthlyValue,
  yearlyValue,
  className = '',
  error,
  monthlyDisabled,
  onMonthlyChange,
}) => (
  <div className={className}>
    <div className="flex items-stretch gap-4 py-2 ">
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <label className={'w-56 flex-shrink-0 text-sm font-medium text-gray-700'}>{label}</label>
        <div className="flex-1 flex items-center justify-end gap-2 flex-wrap min-w-0">
          <Input
            type="number"
            min={0}
            value={monthlyValue === '' || monthlyValue == null ? '' : monthlyValue}
            disabled={monthlyDisabled}
            onChange={onMonthlyChange}
            className={`max-w-[140px] text-right ${monthlyDisabled ? 'bg-gray-50' : ''}`}
          />
        </div>
      </div>
      <div className="w-36 flex-shrink-0 flex items-center justify-end">
        <Input
          type="number"
          value={yearlyValue === '' || yearlyValue == null ? '' : yearlyValue}
          disabled
          className="w-full bg-gray-50 text-right"
        />
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

const defaultFormData = () => ({
  grossMonthly: null,
  effectiveStartDate: dayjs().format('YYYY-MM-DD'),
  effectiveEndDate: dayjs().add(1, 'year').format('YYYY-MM-DD'),
  salaryDetails: null,
});

const mapApiDataToFormData = (data) => {
  const base = defaultFormData();
  if (!data) return base;

  const start = data.effectiveStartDate
    ? dayjs(data.effectiveStartDate).format('YYYY-MM-DD')
    : base.effectiveStartDate;
  const end = data.effectiveEndDate
    ? dayjs(data.effectiveEndDate).format('YYYY-MM-DD')
    : base.effectiveEndDate;

  const hasGross = data.grossMonthly != null && data.grossMonthly !== '';

  if (!hasGross) {
    return {
      ...base,
      effectiveStartDate: start,
      effectiveEndDate: end,
      grossMonthly: null,
      salaryDetails: null,
    };
  }

  return {
    grossMonthly: Number(data.grossMonthly),
    effectiveStartDate: start,
    effectiveEndDate: end,
    salaryDetails: { ...data },
  };
};

const AddSalaryPopup = ({
  employeeId,
  onClose,
  onSuccess,
  viewMode = false,
  initialData = null,
}) => {
  const [formData, setFormData] = useState(() => defaultFormData());
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(mapApiDataToFormData(initialData));
    } else {
      setFormData(defaultFormData());
    }
  }, [initialData]);

  const showFullBreakup = useMemo(
    () =>
      formData.salaryDetails != null &&
      formData.salaryDetails.grossMonthly != null &&
      formData.salaryDetails.grossMonthly !== '',
    [formData.salaryDetails],
  );

  const salaryDetails = formData.salaryDetails;

  const handleGrossMonthlyChange = async (e) => {
    const raw = e.target.value;
    const n = Number(raw);
    const numValue = raw === '' || raw == null || Number.isNaN(n) ? null : n;
    setFormData((prev) => ({ ...prev, grossMonthly: numValue }));
    try {
      await salaryFormSchema.validateAt('grossMonthly', { grossMonthly: numValue });
      setErrors((prev) => ({ ...prev, grossMonthly: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, grossMonthly: error.message }));
    }
  };

  const submitSalaryData = async () => {
    try {
      const payload = {
        employeeId,
        grossMonthly: formData.grossMonthly ?? 0,
        effectiveStartDate: formData.effectiveStartDate,
        effectiveEndDate: formData.effectiveEndDate,
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
      await salaryFormSchema.validate(formData, { abortEarly: false });
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

  const readOnly = true;
  const grossDisabled = viewMode;

  return (
    <div className="flex flex-col max-h-[70vh] pt-2">
      <form
        className="flex flex-col min-h-0 flex-1 flex"
        onSubmit={viewMode ? (e) => e.preventDefault() : handleSubmit}
      >
        <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <DateInput
              label="Effective start date"
              format="DD-MM-YYYY"
              placeholder="Select start date"
              value={formData.effectiveStartDate}
              handleChange={(isoDate) => {
                setFormData((prev) => ({ ...prev, effectiveStartDate: isoDate }));
                setErrors((prev) => ({ ...prev, effectiveStartDate: '' }));
              }}
              error={errors.effectiveStartDate}
              readOnly={viewMode}
            />
            <DateInput
              label="Effective end date"
              format="DD-MM-YYYY"
              placeholder="Select end date"
              value={formData.effectiveEndDate}
              minDate={formData.effectiveStartDate}
              handleChange={(isoDate) => {
                setFormData((prev) => ({ ...prev, effectiveEndDate: isoDate }));
                setErrors((prev) => ({ ...prev, effectiveEndDate: '' }));
              }}
              error={errors.effectiveEndDate}
              readOnly={viewMode}
            />
          </div>

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

          <p className="text-sm font-semibold text-gray-800 pt-2">Earnings / Gross salary</p>

          <FormRow
            label="Salary (per month)"
            monthlyValue={formData.grossMonthly ?? ''}
            yearlyValue={salaryFieldFromApi(salaryDetails?.grossAnnual)}
            error={errors.grossMonthly}
            monthlyDisabled={grossDisabled}
            onMonthlyChange={grossDisabled ? undefined : handleGrossMonthlyChange}
          />

          {showFullBreakup && salaryDetails && (
            <>
              <FormRow
                label="Gross payable"
                monthlyValue={salaryFieldFromApi(salaryDetails.grossMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.grossAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Basic"
                monthlyValue={salaryFieldFromApi(salaryDetails.basicMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.basicAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="HRA"
                monthlyValue={salaryFieldFromApi(salaryDetails.hraMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.hraAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Conveyance"
                monthlyValue={salaryFieldFromApi(salaryDetails.conveyanceMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.conveyanceAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Medical"
                monthlyValue={salaryFieldFromApi(salaryDetails.medicalMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.medicalAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Food allowance"
                monthlyValue={salaryFieldFromApi(salaryDetails.foodMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.foodAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Travel"
                monthlyValue={salaryFieldFromApi(salaryDetails.travelMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.travelAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="LTA"
                monthlyValue={salaryFieldFromApi(salaryDetails.ltaMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.ltaAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Bonus"
                monthlyValue={salaryFieldFromApi(salaryDetails.bonusMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.bonusAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Special allowance"
                monthlyValue={salaryFieldFromApi(salaryDetails.specialAllowanceMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.specialAllowanceAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Gross salary"
                monthlyValue={salaryFieldFromApi(salaryDetails.grossMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.grossAnnual)}
                monthlyDisabled={readOnly}
              />

              <hr className="my-4 border-gray-200" />
              <p className="text-sm font-semibold text-gray-800">Less: Deductions</p>

              <FormRow
                label="Employee contribution to PF"
                monthlyValue={salaryFieldFromApi(salaryDetails.employeePfMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.employeePfAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="ESI contribution (employee)"
                monthlyValue={salaryFieldFromApi(salaryDetails.employeeEsicMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.employeeEsicAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Professional tax"
                monthlyValue={salaryFieldFromApi(salaryDetails.professionalTaxMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.professionalTaxAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Income tax"
                monthlyValue={salaryFieldFromApi(salaryDetails.incomeTaxMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.incomeTaxAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Total deductions"
                monthlyValue={salaryFieldFromApi(salaryDetails.totalDeductionsMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.totalDeductionsAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Net pay per month"
                monthlyValue={salaryFieldFromApi(salaryDetails.stakeHomeMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.stakeHomeAnnual)}
                monthlyDisabled={readOnly}
              />

              <hr className="my-4 border-gray-200" />
              <p className="text-sm font-semibold text-gray-800">Additional benefits &amp; CTC</p>

              <FormRow
                label="Employer contribution to PF"
                monthlyValue={salaryFieldFromApi(salaryDetails.employerPfMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.employerPfAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="ESI contribution (employer)"
                monthlyValue={salaryFieldFromApi(salaryDetails.employerEsicMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.employerEsicAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Total additional benefits"
                monthlyValue={salaryFieldFromApi(salaryDetails.totalAdditionalBenefitsMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.totalAdditionalBenefitsAnnual)}
                monthlyDisabled={readOnly}
              />
              <FormRow
                label="Cost to company"
                monthlyValue={salaryFieldFromApi(salaryDetails.ctcMonthly)}
                yearlyValue={salaryFieldFromApi(salaryDetails.ctcAnnual)}
                monthlyDisabled={readOnly}
              />
            </>
          )}
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
