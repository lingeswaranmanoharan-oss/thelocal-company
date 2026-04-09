import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import * as yup from 'yup';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import DateInput from '../../../../components/DateInput/DateInput';
import { addEmployeeSalary } from '../../services/services';
import toaster from '../../../../services/toasterService';

const basciMaxDigit = 999999999;

const salaryFormSchema = yup.object().shape({
  salaryPerMonth: yup
    .number()
    .nullable()
    .required('Salary per month is required')
    .min(0, 'Salary must be 0 or greater')
    .max(basciMaxDigit, 'Salary must not exceed 9 digits'),
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

const foodAllowance = 2200;
const conveyanceAllowance = 800;

const roundRupee = (amount) => Math.round(Number(amount));

const esiGrossCeiling = 21000;
const pfBasicCap = 15000;
const professionalTaxHigh = 200;
const professionalTaxMid = 150;

const computeBreakup = (salaryPerMonth) => {
  const salaryInput = Number(salaryPerMonth) || 0;
  const grossPayable = salaryInput;

  const basicBeforeRound = grossPayable * 0.5;
  const hraBeforeRound = basicBeforeRound * 0.4;
  const helperAllowance = 0;
  const researchAllowance = 0;
  const uniformAllowance = 0;
  const childrenEducationAllowance = 0;
  const foodMonthly = foodAllowance;
  const conveyanceMonthly = conveyanceAllowance;
  const pctOfGrossBeforeRound = grossPayable * 0.1;

  const sumEarningsThroughPct =
    basicBeforeRound +
    hraBeforeRound +
    helperAllowance +
    researchAllowance +
    uniformAllowance +
    childrenEducationAllowance +
    foodMonthly +
    conveyanceMonthly +
    pctOfGrossBeforeRound;
  const specialAllowanceBeforeRound = grossPayable - sumEarningsThroughPct;
  const grossSalaryForStatutes = sumEarningsThroughPct + specialAllowanceBeforeRound;

  const employeePfBeforeRound =
    basicBeforeRound > pfBasicCap ? pfBasicCap * 0.12 : basicBeforeRound * 0.12;
  const employeeEsiBeforeRound =
    grossSalaryForStatutes <= esiGrossCeiling ? grossSalaryForStatutes * 0.0075 : 0;
  let professionalTaxBeforeRound = 0;
  if (salaryInput < 20001) {
    professionalTaxBeforeRound = salaryInput < 15000 ? 0 : professionalTaxMid;
  } else {
    professionalTaxBeforeRound = professionalTaxHigh;
  }
  const incomeTaxMonthly = 0;
  const totalDeductionsBeforeRound =
    employeePfBeforeRound + employeeEsiBeforeRound + professionalTaxBeforeRound + incomeTaxMonthly;
  const netPayBeforeRound = grossSalaryForStatutes - totalDeductionsBeforeRound;

  const employerPfBeforeRound = employeePfBeforeRound;
  const employerEsiBeforeRound =
    grossSalaryForStatutes <= esiGrossCeiling ? grossSalaryForStatutes * 0.0325 : 0;
  const medicalInsuranceMonthly = 0;
  const termInsuranceMonthly = 0;
  const totalAdditionalBenefitsBeforeRound =
    employerPfBeforeRound + employerEsiBeforeRound + medicalInsuranceMonthly + termInsuranceMonthly;
  const costToCompanyBeforeRound = grossSalaryForStatutes + totalAdditionalBenefitsBeforeRound;

  const basicMonthly = roundRupee(basicBeforeRound);
  const hraMonthly = roundRupee(hraBeforeRound);
  const pctOfGrossMonthly = roundRupee(pctOfGrossBeforeRound);
  const specialAllowance = roundRupee(specialAllowanceBeforeRound);
  const grossSalaryA = roundRupee(grossPayable);

  const employeePfMonthly = roundRupee(employeePfBeforeRound);
  const employeeEsicMonthly = roundRupee(employeeEsiBeforeRound);
  const professionalTaxMonthly = roundRupee(professionalTaxBeforeRound);
  const totalDeductionsB = roundRupee(totalDeductionsBeforeRound);
  const netPayMonthly = roundRupee(netPayBeforeRound);

  const employerPfMonthly = roundRupee(employerPfBeforeRound);
  const employerEsicMonthly = roundRupee(employerEsiBeforeRound);
  const totalAdditionalBenefitsC = roundRupee(totalAdditionalBenefitsBeforeRound);
  const ctcMonthly = roundRupee(costToCompanyBeforeRound);

  return {
    basicMonthly,
    hraMonthly,
    helperAllowance,
    researchAllowance,
    uniformAllowance,
    childrenEducationAllowance,
    foodMonthly,
    conveyanceMonthly,
    pctOfGrossMonthly,
    specialAllowance,
    grossSalaryA,
    employeePfMonthly,
    employeeEsicMonthly,
    professionalTaxMonthly,
    incomeTaxMonthly,
    totalDeductionsB,
    netPayMonthly,
    employerPfMonthly,
    employerEsicMonthly,
    medicalInsuranceMonthly,
    termInsuranceMonthly,
    totalAdditionalBenefitsC,
    ctcMonthly,
    conveyanceForApi: roundRupee(conveyanceMonthly + pctOfGrossBeforeRound),
  };
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
  salaryPerMonth: null,
  effectiveStartDate: dayjs().format('YYYY-MM-DD'),
  effectiveEndDate: dayjs().add(1, 'year').format('YYYY-MM-DD'),
});

const mapApiDataToFormData = (data) => {
  if (!data) return defaultFormData();

  let salaryPerMonth = null;
  const gross = data.grossMonthly;
  if (gross != null && gross !== '') salaryPerMonth = gross;
  else if (data.basicMonthly != null && data.basicMonthly !== '') {
    salaryPerMonth = Math.round(data.basicMonthly / 0.5);
  }

  const start = data.effectiveStartDate
    ? dayjs(data.effectiveStartDate).format('YYYY-MM-DD')
    : dayjs().format('YYYY-MM-DD');
  const end = data.effectiveEndDate
    ? dayjs(data.effectiveEndDate).format('YYYY-MM-DD')
    : dayjs().add(1, 'year').format('YYYY-MM-DD');

  return {
    salaryPerMonth,
    effectiveStartDate: start,
    effectiveEndDate: end,
  };
};

const yearly = (value) => {
  if (value === '' || value == null) return '';
  return roundRupee(Number(value) * 12);
};

const toAnnualAmount = (monthlyAmount) => {
  if (monthlyAmount === '' || monthlyAmount == null) {
    return 0;
  }
  return roundRupee(Number(monthlyAmount) * 12);
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

  const breakup = useMemo(() => computeBreakup(formData.salaryPerMonth), [formData.salaryPerMonth]);

  const handleSalaryChange = async (e) => {
    const raw = e.target.value;
    const n = Number(raw);
    const numValue = raw === '' || raw == null || Number.isNaN(n) ? null : n;
    setFormData((prev) => ({ ...prev, salaryPerMonth: numValue }));
    try {
      await salaryFormSchema.validateAt('salaryPerMonth', { salaryPerMonth: numValue });
      setErrors((prev) => ({ ...prev, salaryPerMonth: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, salaryPerMonth: error.message }));
    }
  };

  const buildSalaryPayload = () => {
    const monthlySalary = formData.salaryPerMonth ?? 0;
    const {
      basicMonthly,
      hraMonthly,
      conveyanceForApi,
      specialAllowance,
      foodMonthly,
      employerPfMonthly,
      employeePfMonthly,
      employerEsicMonthly,
      employeeEsicMonthly,
      professionalTaxMonthly,
    } = computeBreakup(monthlySalary);

    return {
      employeeId,
      basicAnnual: toAnnualAmount(basicMonthly),
      hraAnnual: toAnnualAmount(hraMonthly),
      conveyanceAnnual: toAnnualAmount(conveyanceForApi),
      medicalAnnual: 0,
      adhocAnnual: toAnnualAmount(specialAllowance),
      foodAnnual: toAnnualAmount(foodMonthly),
      travelAnnual: 0,
      ltaAnnual: 0,
      bonusAnnual: 0,
      employerPfAnnual: toAnnualAmount(employerPfMonthly),
      employerEsicAnnual: toAnnualAmount(employerEsicMonthly),
      employeePfAnnual: toAnnualAmount(employeePfMonthly),
      employeeEsicAnnual: toAnnualAmount(employeeEsicMonthly),
      professionalTaxAnnual: toAnnualAmount(professionalTaxMonthly),
      effectiveStartDate: formData.effectiveStartDate,
      effectiveEndDate: formData.effectiveEndDate,
    };
  };

  const submitSalaryData = async () => {
    try {
      const payload = buildSalaryPayload();
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
  const salaryMonthlyDisabled = viewMode;

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
            monthlyValue={formData.salaryPerMonth ?? ''}
            yearlyValue={yearly(formData.salaryPerMonth)}
            error={errors.salaryPerMonth}
            monthlyDisabled={salaryMonthlyDisabled}
            onMonthlyChange={salaryMonthlyDisabled ? undefined : handleSalaryChange}
          />

          <FormRow
            label="Gross payable"
            monthlyValue={breakup.grossSalaryA}
            yearlyValue={yearly(breakup.grossSalaryA)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Basic"
            monthlyValue={breakup.basicMonthly}
            yearlyValue={yearly(breakup.basicMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="HRA"
            monthlyValue={breakup.hraMonthly}
            yearlyValue={yearly(breakup.hraMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Helper / Assistant allowance"
            monthlyValue={breakup.helperAllowance}
            yearlyValue={yearly(breakup.helperAllowance)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Research allowance"
            monthlyValue={breakup.researchAllowance}
            yearlyValue={yearly(breakup.researchAllowance)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Uniform allowance"
            monthlyValue={breakup.uniformAllowance}
            yearlyValue={yearly(breakup.uniformAllowance)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Children education allowance"
            monthlyValue={breakup.childrenEducationAllowance}
            yearlyValue={yearly(breakup.childrenEducationAllowance)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Food allowance"
            monthlyValue={breakup.foodMonthly}
            yearlyValue={yearly(breakup.foodMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Conveyance allowance"
            monthlyValue={breakup.conveyanceMonthly}
            yearlyValue={yearly(breakup.conveyanceMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="10% of gross payable"
            monthlyValue={breakup.pctOfGrossMonthly}
            yearlyValue={yearly(breakup.pctOfGrossMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Special allowance"
            monthlyValue={breakup.specialAllowance}
            yearlyValue={yearly(breakup.specialAllowance)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Gross salary"
            monthlyValue={breakup.grossSalaryA}
            yearlyValue={yearly(breakup.grossSalaryA)}
            monthlyDisabled={readOnly}
          />

          <hr className="my-4 border-gray-200" />
          <p className="text-sm font-semibold text-gray-800">Less: Deductions</p>

          <FormRow
            label="Employee contribution to PF"
            monthlyValue={breakup.employeePfMonthly}
            yearlyValue={yearly(breakup.employeePfMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="ESI contribution (employee)"
            monthlyValue={breakup.employeeEsicMonthly}
            yearlyValue={yearly(breakup.employeeEsicMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Professional tax"
            monthlyValue={breakup.professionalTaxMonthly}
            yearlyValue={yearly(breakup.professionalTaxMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Income tax"
            monthlyValue={breakup.incomeTaxMonthly}
            yearlyValue={yearly(breakup.incomeTaxMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Total deductions"
            monthlyValue={breakup.totalDeductionsB}
            yearlyValue={yearly(breakup.totalDeductionsB)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Net pay per month"
            monthlyValue={breakup.netPayMonthly}
            yearlyValue={yearly(breakup.netPayMonthly)}
            monthlyDisabled={readOnly}
          />

          <hr className="my-4 border-gray-200" />
          <p className="text-sm font-semibold text-gray-800">Additional benefits &amp; CTC</p>

          <FormRow
            label="Employer contribution to PF"
            monthlyValue={breakup.employerPfMonthly}
            yearlyValue={yearly(breakup.employerPfMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="ESI contribution (employer)"
            monthlyValue={breakup.employerEsicMonthly}
            yearlyValue={yearly(breakup.employerEsicMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Medical insurance"
            monthlyValue={breakup.medicalInsuranceMonthly}
            yearlyValue={yearly(breakup.medicalInsuranceMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Term insurance"
            monthlyValue={breakup.termInsuranceMonthly}
            yearlyValue={yearly(breakup.termInsuranceMonthly)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Total additional benefits"
            monthlyValue={breakup.totalAdditionalBenefitsC}
            yearlyValue={yearly(breakup.totalAdditionalBenefitsC)}
            monthlyDisabled={readOnly}
          />
          <FormRow
            label="Cost to company"
            monthlyValue={breakup.ctcMonthly}
            yearlyValue={yearly(breakup.ctcMonthly)}
            monthlyDisabled={readOnly}
          />
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
