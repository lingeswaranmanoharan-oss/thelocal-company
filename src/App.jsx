import { Button } from './components/Button/Button';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Input } from './components/Input/Input';
import config from './config/config';

function App() {
  console.log(config);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            label="Name"
            value=""
            onChange={() => {}}
            placeholder="Enter name"
            hint="Use our theme variables for colors."
          />
        </div>
        <div>
          <Dropdown
            label="Choose option"
            items={[
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' },
              { label: 'Option 3', value: 'option3' },
            ]}
            selectedValue={null}
            onSelect={() => {}}
            placeholder="Select..."
          />
        </div>
        <div className="flex items-end">
          <Button variant="primary" onClick={() => {}}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
