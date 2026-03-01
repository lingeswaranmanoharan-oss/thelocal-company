import { formatAmountToFixed, formatLabelWithSpaces } from '../../../../utils/functions';

const PayslipDetailsContent = ({ payslip }) => {
  if (!payslip) return null;

  const components = payslip.components ?? [];

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="upload-payslip-table min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="upload-payslip-th">Component Name</th>
            <th className="upload-payslip-th text-center">Type</th>
            <th className="upload-payslip-th text-right">Master Amount</th>
            <th className="upload-payslip-th text-right">Actual Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {components.length === 0 ? (
            <tr>
              <td colSpan={4} className="upload-payslip-td text-center text-gray-500">
                No components
              </td>
            </tr>
          ) : (
            components.map((eachComponent, idx) => (
              <tr key={eachComponent.componentName + idx} className="upload-payslip-tr">
                <td className="upload-payslip-td">{formatLabelWithSpaces(eachComponent.componentName)}</td>
                <td className="upload-payslip-td text-center">
                  <span className={`upload-payslip-status ${(eachComponent.componentType || '').toUpperCase() === 'EARNING' ? 'upload-payslip-status-success' : 'upload-payslip-status-failed'}`}>
                    {eachComponent.componentType ?? '—'}
                  </span>
                </td>
                <td className="upload-payslip-td text-right">{formatAmountToFixed(eachComponent?.masterAmount)}</td>
                <td className="upload-payslip-td text-right">{formatAmountToFixed(eachComponent?.actualAmount)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PayslipDetailsContent;
