import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import './GeneratePayslip.scss';
import { Button } from '../../../../components/Button/Button';
import { Dropdown } from '../../../../components/Dropdown/Dropdown';
import { getCompanyId, getDateToDDMMYYYYformat } from '../../../../utils/functions';
import { MONTHS } from '../../../../Utils/constants';
import { getGeneratePayslip } from '../../services/services';

const months = MONTHS;

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  const numberOfYears = [0, 1, 2, 3, 4, 5];
  numberOfYears.forEach((i) => {
    years.push({ value: currentYear - i, label: currentYear - i });
  });
  return years;
};

const yearOptions = getYearOptions();

const GeneratePayslip = ({ employeeId: employeeIdFromRoute }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [payslipData, setPayslipData] = useState(null);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const employeeId = employeeIdFromRoute ?? null;

  const monthOptions = months.map((eachMonth) => ({
    ...eachMonth,
    disabled: year > currentYear ? true : year === currentYear ? eachMonth.value > currentMonth : false,
  }));

  useEffect(() => {
    if (year === currentYear && month > currentMonth) {
      setMonth(currentMonth);
    }
  }, [year, month, currentYear, currentMonth]);

  const getPayslipData = async () => {
    const companyId = getCompanyId();
    if (!companyId || !employeeId) return;
    const requestedMonth = month;
    const requestedYear = year;
    const requestedEmployeeId = employeeId;
    try {
      const response = await getGeneratePayslip({ companyId, employeeId, month: requestedMonth, year: requestedYear });
      if (requestedMonth === month && requestedYear === year && requestedEmployeeId === employeeId) {
        setPayslipData(response ?? null);
      }
    } catch (err) {
      if (requestedMonth === month && requestedYear === year && requestedEmployeeId === employeeId) {
        setPayslipData(null);
      }
    }
  };

  useEffect(() => {
    getPayslipData();
  }, [employeeId, month, year]);

  const monthLabel = months.find((m) => m.value === month)?.label ?? '';
  const payslip = payslipData;
  const earnings = payslip?.earnings ?? [];
  const deductions = payslip?.deductions ?? [];
  const maxRows = Math.max(earnings.length, deductions.length, 1);

  const handlePrint = () => {
    const printTitle = payslip?.employeeNumber ?? employeeId ?? 'payslip';
    const filename = `Payslip_${printTitle}`;
    const previousTitle = document.title;
    document.title = filename;

    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };
    window.addEventListener('afterprint', restoreTitle);
    window.print();
  };

  return (
    <div className="generate-payslip p-2 w-full">
      <div className="generate-payslip-no-print generate-payslip-dropdowns flex flex-wrap justify-end items-center gap-4 mb-6">
        <div className="generate-payslip-dropdown-item">
          <Dropdown
            label="Year"
            items={yearOptions}
            selectedValue={year}
            onSelect={setYear}
            placeholder="Select year"
          />
        </div>
        <div className="generate-payslip-dropdown-item">
          <Dropdown
            label="Month"
            items={monthOptions}
            selectedValue={month}
            onSelect={setMonth}
            placeholder="Select month"
          />
        </div>
        <Button type="button" variant="primary" onClick={handlePrint} className="inline-flex items-center gap-2">
          <Icon icon="mdi:printer" className="w-5 h-5" />
          Print
        </Button>
      </div>
      <div className="generate-payslip-paper border border-black bg-white text-black">
        <div className="generate-payslip-header border-b border-black p-4 flex items-start gap-4">
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold uppercase">{payslip?.companyName ?? '—'}</h1>
            <p className="text-sm mt-0.5">{payslip?.companyLocation ?? '—'}</p>
            <h2 className="text-base font-bold mt-2">
              Payslip For The Month Of {payslip ? (months.find((m) => m.value === payslip.month)?.label ?? monthLabel) : monthLabel} - {payslip?.year ?? year}
            </h2>
          </div>
        </div>

        <div className="generate-payslip-details grid grid-cols-2 border-b border-black">
          <div className="generate-payslip-col border-r border-black p-3 space-y-1.5 text-sm">
            <div className="flex justify-between gap-2">
              <span className="font-medium">Name:</span>
              <span className="text-right">{payslip?.empName ?? '—'}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Joining Date:</span>
              <span className="text-right">{getDateToDDMMYYYYformat(payslip?.doj, true)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Designation:</span>
              <span className="text-right">{payslip?.designationName ?? '—'}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Department:</span>
              <span className="text-right">{payslip?.departmentName ?? '—'}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Location:</span>
              <span className="text-right">{payslip?.location ?? '—'}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Total Work Days:</span>
              <span className="text-right">{payslip?.totalWorkingDays ?? '—'}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Effective Work Days:</span>
              <span className="text-right">{payslip?.effectiveWorkingDays ?? '—'}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">LOP:</span>
              <span className="text-right">{payslip?.lop != null ? payslip.lop : '—'}</span>
            </div>
          </div>
          <div className="generate-payslip-col p-3 space-y-1.5 text-sm">
            <div className="flex justify-between gap-2">
              <span className="font-medium">Employee No:</span>
              <span className="text-right">{payslip?.employeeNumber ?? '—'}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Bank Name:</span>
              <span className="text-right">{payslip?.bankName ?? '—'}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Bank Account No:</span>
              <span className="text-right">{payslip?.bankAccountNumber ?? '—'}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">PAN Number:</span>
              <span className="text-right">{payslip?.panNumber ?? '—'}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">PF No:</span>
              <span className="text-right">{payslip?.pfNumber ?? '—'}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">PF UAN:</span>
              <span className="text-right">{payslip?.pfUan ?? '—'}</span>
            </div>
          </div>
        </div>

        <div className="generate-payslip-table border-b border-black relative">
          <div className="generate-payslip-table-center-line" aria-hidden="true" />
          <table className="w-full text-sm border-collapse generate-payslip-table-grid">
            <colgroup className="generate-payslip-table-colgroup">
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr className="border-b border-black">
                <th className="generate-payslip-table-th-earnings p-2 text-left font-bold">Earnings</th>
                <th className="p-2 text-right font-bold">Master</th>
                <th className="generate-payslip-table-th-actual border-r border-black p-2 text-right font-bold">Actual</th>
                <th className="generate-payslip-table-th-deductions p-2 text-left font-bold">Deductions</th>
                <th className="p-2 text-right font-bold">Actual</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxRows }, (_, i) => {
                const earn = earnings[i];
                const ded = deductions[i];
                return (
                  <tr key={i} className="border-b border-black">
                    <td className="generate-payslip-table-td-earnings p-2 align-top">{earn?.componentName ?? ''}</td>
                    <td className="p-2 text-right align-top">{earn != null ? earn.masterAmount : ''}</td>
                    <td className="generate-payslip-table-td-actual border-r border-black p-2 text-right align-top">{earn != null ? earn.actualAmount : ''}</td>
                    <td className="generate-payslip-table-td-deductions p-2 align-top">{ded?.componentName ?? ''}</td>
                    <td className="p-2 text-right align-top">{ded != null ? ded.actualAmount : ''}</td>
                  </tr>
                );
              })}
              <tr className="border-t border-black">
                <td className="generate-payslip-table-td-earnings p-2">Total Earnings: INR</td>
                <td className="p-2 text-right">{payslip ? earnings.reduce((s, e) => s + Number(e?.masterAmount || 0), 0) : '—'}</td>
                <td className="generate-payslip-table-td-actual border-r border-black p-2 text-right">{payslip?.totalEarnings ?? '—'}</td>
                <td className="generate-payslip-table-td-deductions p-2">Total Deductions: INR</td>
                <td className="p-2 text-right">{payslip?.totalDeductions ?? '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="generate-payslip-netpay border-b border-black p-3 text-sm">
          <p>
            Net Pay for the month (Total Earnings - Total Deductions):{' '}
            <strong className="font-bold">{payslip?.netSalary ?? '—'}</strong>
          </p>
          {payslip?.netSalaryInWords && (
            <p className="mt-1 capitalize">{payslip.netSalaryInWords}</p>
          )}
        </div>

        <div className="generate-payslip-footer p-3 text-center text-xs text-gray-600">
          This is a system generated payslip and does not require signature.
        </div>
      </div>
    </div>
  );
};

export default GeneratePayslip;
