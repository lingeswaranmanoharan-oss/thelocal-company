import { EMPLOYEE_STEPS } from './EmployeeSteps';
export default function Stepper({ currentStep, onStepClick }) {
  return (
    <div className="flex gap-2 mb-6">
      {EMPLOYEE_STEPS.map((label, index) => (
        <button
          key={label}
          type="button"
          onClick={() => onStepClick(index)}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition
            ${
              index === currentStep
                ? 'bg-[var(--hrm-primary)] text-white'
                : index < currentStep
                  ? 'bg-[var(--hrm-primary-100)] text-[var(--hrm-primary)]'
                  : 'bg-gray-200 text-gray-600'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
