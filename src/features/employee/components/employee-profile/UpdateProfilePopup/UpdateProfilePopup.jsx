import React from 'react';
import Popup from '../../../../../components/Popup/Popup';
import { Button } from '../../../../../components/Button/Button';

const UpdateProfilePopup = ({ confirmPopup, setConfirmPopup, handleSubmit }) => {
  const onClose = () => {
    setConfirmPopup('');
  };

  return (
    <Popup
      open={confirmPopup}
      onClose={onClose}
      header={confirmPopup === 'Y' ? 'Confirmation' : 'Save Progress'}
    >
      {confirmPopup === 'Y' ? (
        <p className="mb-4 text-md text-gray-600">
          Once submitted, you cannot edit the details further.
        </p>
      ) : (
        <p className="mb-4 text-md text-gray-600">
          Your progress in this section will be saved temporarily. You can continue editing later.
        </p>
      )}

      <div className="flex justify-end">
        {' '}
        <Button onClick={handleSubmit} variant="outline" size="sm">
          {confirmPopup === 'Y' ? 'Confirm & Submit' : 'Save'}{' '}
        </Button>
      </div>
    </Popup>
  );
};

export default UpdateProfilePopup;
