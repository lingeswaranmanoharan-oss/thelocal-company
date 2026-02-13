import { useState } from 'react';
import dayjs from 'dayjs';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import DateInput from '../../../../components/DateInput/DateInput';
import { monthStringToDate } from '../../../../utils/functions';
import './PreviewExcel.scss';

const COLUMNS = [
  { key: 'employee_id', label: 'Employee ID', type: 'text' },
  { key: 'employee_name', label: 'Employee Name', type: 'text' },
  { key: 'pan_number', label: 'PAN Number', type: 'text' },
  { key: 'uan_number', label: 'UAN Number', type: 'text' },
  { key: 'bank_account_number', label: 'Bank Account Number', type: 'text' },
  { key: 'IFSC_code', label: 'IFSC Code', type: 'text' },
  { key: 'month', label: 'Month (MM-YYYY)', type: 'month' },
  { key: 'working_days', label: 'Working Days', type: 'number' },
  { key: 'present_days', label: 'Present Days', type: 'number' },
  { key: 'basic_salary', label: 'Basic Salary', type: 'number' },
  { key: 'HRA', label: 'HRA', type: 'number' },
  { key: 'special_allowance', label: 'Special Allowance', type: 'number' },
  { key: 'bonus', label: 'Bonus', type: 'number' },
  { key: 'overtime', label: 'Overtime', type: 'number' },
  { key: 'other_allowances', label: 'Other Allowances', type: 'number' },
  { key: 'gross_salary', label: 'Gross Salary', type: 'number' },
  { key: 'PF_emplyee', label: 'PF Employee', type: 'number' },
  { key: 'ESI_employee', label: 'ESI Employee', type: 'number' },
  { key: 'pofessional_tax', label: 'Professional Tax', type: 'number' },
  { key: 'tds', label: 'TDS', type: 'number' },
  { key: 'other_deduction', label: 'Other Deduction', type: 'number' },
  { key: 'total_deductions', label: 'Total Deductions', type: 'number' },
  { key: 'net_salary_payable', label: 'Net Salary Payable', type: 'number' },
];

const createEmptyRow = () =>
  COLUMNS.reduce(
    (acc, { key }) => ({
      ...acc,
      [key]: key === 'month' ? dayjs().format('MM-YYYY') : '',
    }),
    {}
  );

const SAMPLE_PAYROLL_DATA = [
  {
    employee_id: 'EMP001',
    employee_name: 'emp1',
    pan_number: 'ABCDE1234F',
    uan_number: '101234567890',
    bank_account_number: '1234567890123456',
    IFSC_code: 'HDFC0001234',
    month: '01-2025',
    working_days: 22,
    present_days: 22,
    basic_salary: 35000,
    HRA: 14000,
    special_allowance: 8000,
    bonus: 2000,
    overtime: 1500,
    other_allowances: 500,
    gross_salary: 61000,
    PF_emplyee: 4200,
    ESI_employee: 0,
    pofessional_tax: 200,
    tds: 4500,
    other_deduction: 0,
    total_deductions: 8900,
    net_salary_payable: 52100,
  },
  {
    employee_id: 'EMP002',
    employee_name: 'emp2',
    pan_number: 'ABCDE1234F',
    uan_number: '101234567890',
    bank_account_number: '1234567890123456',
    IFSC_code: 'HDFC0001234',
   month: '01-2025',
    working_days: 22,
    present_days: 22,
    basic_salary: 35000,
    HRA: 14000,
    special_allowance: 8000,
    bonus: 2000,
    overtime: 1500,
    other_allowances: 500,
    gross_salary: 61000,
    PF_emplyee: 4200,
    ESI_employee: 0,
    pofessional_tax: 200,
    tds: 4500,
    other_deduction: 0,
    total_deductions: 8900,
    net_salary_payable: 52100,
  },
  {
    employee_id: 'EMP003',
    employee_name: 'emp3',
    pan_number: 'ABCDE1234F',
    uan_number: '101234567890',
    bank_account_number: '1234567890123456',
    IFSC_code: 'HDFC0001234',
    month: '01-2025',
    working_days: 22,
    present_days: 22,
    basic_salary: 35000,
    HRA: 14000,
    special_allowance: 8000,
    bonus: 2000,
    overtime: 1500,
    other_allowances: 500,
    gross_salary: 61000,
    PF_emplyee: 4200,
    ESI_employee: 0,
    pofessional_tax: 200,
    tds: 4500,
    other_deduction: 0,
    total_deductions: 8900,
    net_salary_payable: 52100,
  },
];

const PreviewExcel = ({ initialData }) => {
  const [rows, setRows] = useState(() => {
    const data = initialData?.length ? initialData : SAMPLE_PAYROLL_DATA;
    return data.map((row) => ({
      ...createEmptyRow(),
      ...row,
      month: row.month ?? dayjs().format('MM-YYYY'),
    }));
  });

  const updateCell = (rowIndex, field, value) => {
    setRows((prevRows) => {
      const next = prevRows.map((row, i) =>
        i === rowIndex ? { ...row, [field]: value } : row
      );
      return next;
    });
  };

  const addRow = () => {
    setRows((prevRows) => [...prevRows, createEmptyRow()]);
  };

  const removeRow = (rowIndex) => {
    setRows((prevRows) => (prevRows.length <= 1 ? prevRows : prevRows.filter((eachRow, i) => i !== rowIndex)));
  };

  const handleSubmit = () => {
    console.log('Payroll data:', rows);
  };

  const handleCellChange = (e, rowIndex, col) => {
    const val = e.target.value;
    updateCell(
      rowIndex,
      col.key,
      col.type === 'number' ? (val === '' ? '' : Number(val) || 0) : val
    );
  };

  return (
    <div className="preview-excel">
      <div className="preview-excel-toolbar">
        <h2 className="preview-excel-title">Payroll Preview</h2>
        <div className="preview-excel-toolbar-actions">
          <Button type="button" className="m-3" onClick={addRow}>
            + Add Row
          </Button>
        </div>
      </div>
      <div className="preview-excel-table-wrap">
        <table className="preview-excel-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className="preview-excel-th" >
                  {col.label}
                </th>
              ))}
              <th className="preview-excel-th preview-excel-th-actions" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="preview-excel-tr">
                {COLUMNS.map((col) => (
                  <td key={col.key} className="preview-excel-td">
                    {col.type === 'month' ? (
                      <DateInput
                        className="preview-excel-input-wrapper"
                        value={monthStringToDate(row[col.key])}
                        format="MM-YYYY"
                        placeholder="MM-YYYY"
                        handleChange={(dateStr, formatted) =>
                          updateCell(rowIndex, col.key, formatted)
                        }
                        id={`row-${rowIndex}-${col.key}`}
                      />
                    ) : (
                      <Input
                        type={col.type}
                        value={row[col.key] ?? ''}
                        onChange={(e) => handleCellChange(e, rowIndex, col)}
                        placeholder={col.label}
                        min={col.type === 'number' ? 0 : undefined}
                        step={col.type === 'number' ? 1 : undefined}
                      />
                    )}
                  </td>
                ))}
                <td className="preview-excel-td preview-excel-td-actions">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="preview-excel-remove-row"
                    onClick={() => removeRow(rowIndex)}
                    title="Remove row"
                    disabled={rows.length <= 1}
                  >
                  -
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-end mt-3'>
         <Button type="button" variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
      </div>
    </div>
  );
};

export default PreviewExcel;
