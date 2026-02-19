import './GeneratePayslip.scss';

const GeneratePayslip = () => {
  return (
    <div className="generate-payslip p-2 w-full">
      <div className="generate-payslip-paper border border-black bg-white text-black">
        <div className="generate-payslip-header border-b border-black p-4 flex items-start gap-4">
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold uppercase">ACINTYO TECH INNOVATIONS</h1>
            <p className="text-sm mt-0.5">Kukatpally, Hyderabad</p>
            <h2 className="text-base font-bold mt-2">
              Payslip For The Month Of January - 2025
            </h2>
          </div>
        </div>

        <div className="generate-payslip-details grid grid-cols-2 border-b border-black">
          <div className="generate-payslip-col border-r border-black p-3 space-y-1.5 text-sm">
            <div className="flex justify-between gap-2">
              <span className="font-medium">Name:</span>
              <span className="text-right">Venkat</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Joining Date:</span>
              <span className="text-right">17-03-2025</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Designation:</span>
              <span className="text-right">Software Engineer</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Department:</span>
              <span className="text-right">Technology</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Location:</span>
              <span className="text-right">Acintyo Tech</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Total Work Days:</span>
              <span className="text-right">31</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Effective Work Days:</span>
              <span className="text-right">28</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">LOP:</span>
              <span className="text-right">3</span>
            </div>
          </div>
          <div className="generate-payslip-col p-3 space-y-1.5 text-sm">
            <div className="flex justify-between gap-2">
              <span className="font-medium">Employee No:</span>
              <span className="text-right">ACINT007</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Bank Name:</span>
              <span className="text-right">indian bank</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">Bank Account No:</span>
              <span className="text-right">13245698741541</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">PAN Number:</span>
              <span className="text-right">WPSUT4752Z</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">PF No:</span>
              <span className="text-right">APMAS12345670000000012</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium">PF UAN:</span>
              <span className="text-right">1234567890</span>
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
              <tr className="border-b border-black">
                <td className="generate-payslip-table-td-earnings p-2 align-top">BASIC</td>
                <td className="p-2 text-right align-top">10501.00</td>
                <td className="generate-payslip-table-td-actual border-r border-black p-2 text-right align-top">10501.00</td>
                <td className="generate-payslip-table-td-deductions p-2 align-top">PF</td>
                <td className="p-2 text-right align-top">10501.00</td>
              </tr>
              <tr className="border-b border-black">
                <td className="generate-payslip-table-td-earnings p-2 align-top">HOUSE RENT ALLOWANCE</td>
                <td className="p-2 text-right align-top">10501.00</td>
                <td className="generate-payslip-table-td-actual border-r border-black p-2 text-right align-top">10501.00</td>
                <td className="generate-payslip-table-td-deductions p-2 align-top">ESI</td>
                <td className="p-2 text-right align-top">10501.00</td>
              </tr>
              <tr className="border-b border-black">
                <td className="generate-payslip-table-td-earnings p-2 align-top">SPECIAL ALLOWANCE</td>
                <td className="p-2 text-right align-top">10501.00</td>
                <td className="generate-payslip-table-td-actual border-r border-black p-2 text-right align-top">10501.00</td>
                <td className="generate-payslip-table-td-deductions p-2 align-top">PROF TAX</td>
                <td className="p-2 text-right align-top">10501.00</td>
              </tr>
              <tr className="border-b border-black">
                <td className="generate-payslip-table-td-earnings p-2 align-top">FOOD ALLOWANCE</td>
                <td className="p-2 text-right align-top">10501.00</td>
                <td className="generate-payslip-table-td-actual border-r border-black p-2 text-right align-top">10501.00</td>
                <td className="generate-payslip-table-td-deductions p-2 align-top" />
                <td className="p-2 text-right align-top" />
              </tr>
              <tr className="border-b border-black">
                <td className="generate-payslip-table-td-earnings p-2 align-top">CONVEYANCE</td>
                <td className="p-2 text-right align-top">10501.00</td>
                <td className="generate-payslip-table-td-actual border-r border-black p-2 text-right align-top">10501.00</td>
                <td className="generate-payslip-table-td-deductions p-2 align-top" />
                <td className="p-2 text-right align-top" />
              </tr>
              <tr className="border-t border-black">
                <td className="generate-payslip-table-td-earnings p-2">Total Earnings:INR.</td>
                <td className="p-2 text-right">10501.00</td>
                <td className="generate-payslip-table-td-actual border-r border-black p-2 text-right">10501.00</td>
                <td className="generate-payslip-table-td-deductions p-2">Total Deductions:INR.</td>
                <td className="p-2 text-right">10501.00 </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="generate-payslip-netpay border-b border-black p-3 text-sm">
          <p>
            Net Pay for the month (Total Earnings - Total Deductions):{' '}
            <strong className="font-bold">17631</strong>
          </p>
          <p className="mt-1">Seventeen Thousand Six Hundred and Thirty One Rupees</p>
        </div>

        <div className="generate-payslip-footer p-3 text-center text-xs text-gray-600">
          This is a system generated payslip and does not require signature.
        </div>
      </div>
    </div>
  );
};

export default GeneratePayslip;
