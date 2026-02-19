import { useRef, useState } from 'react';
import toaster from '../../services/toasterService';
// import useUploadFileApi from '@Hooks/useUploadFileApi';
import { apiStatusConstants } from '../../utils/enum';
import { imageUpload } from '../../features/services/commonService';

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

const ErrorMsg = ({ children }) => <p className="text-[10px] text-[#d84315]">{children}</p>;

const FileUpload = ({ label = 'Upload File', errormsg, value, onChange, disabled = false }) => {
  const fileInputRef = useRef(null);
  const fileNameRef = useRef('');

  const [uploadImg, setUploadImg] = useState(value || '');
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  //   const uploadApi = useUploadFileApi();
  const isUploading = apiStatus === apiStatusConstants.inProgress;

  const handleFileChange = async (e) => {
    try {
      setApiStatus(apiStatusConstants.inProgress);

      const file = e.target.files?.[0];
      if (!file) {
        setApiStatus(apiStatusConstants.initial);
        return;
      }

      if (file.size > MAX_SIZE) {
        toaster.warning('File is too large. Maximum size is 2MB');
        setApiStatus(apiStatusConstants.initial);
        return;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        toaster.warning('Please upload valid image');
        setApiStatus(apiStatusConstants.initial);
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await imageUpload(formData);

      if (response?.success) {
        setUploadImg(response.data.imgId);
        fileNameRef.current = file.name;
        onChange?.(response.data.imgId);
        toaster.success(response.message);
        setApiStatus(apiStatusConstants.success);
      } else {
        toaster.warning(response.message || 'Upload failed');
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error(error);
      toaster.error('Something went wrong');
      setApiStatus(apiStatusConstants.failure);
    } finally {
      e.target.value = '';
    }
  };

  const handleRemove = () => {
    setUploadImg('');
    fileNameRef.current = '';
    onChange?.('');
  };

  return (
    <div className="flex flex-col w-full max-w-md">
      <label className="font-medium text-sm text-gray-700 mb-1">{label}</label>

      {!uploadImg ? (
        <div>
          <div className="flex h-[42px] items-center justify-between border border-gray-300 rounded-[5px] bg-white">
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 bg-gray-100 hover:bg-gray-200 text-sm font-medium border-r border-gray-300 h-full"
            >
              Upload
            </button>

            <span className="flex-1 px-4 text-sm text-gray-500 truncate">PNG, JPEG, JPG, PDF</span>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".png,.jpeg,.jpg,.pdf"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />
          </div>

          {errormsg && <ErrorMsg>{errormsg}</ErrorMsg>}
        </div>
      ) : (
        <div className="flex h-[42px] items-center justify-between border border-gray-300 rounded-[5px] px-3 bg-white">
          <span className="text-sm text-gray-700 truncate w-[60%]">
            {fileNameRef.current || value}
          </span>

          <div className="flex gap-4">
            <button
              type="button"
              className="text-blue-600 text-sm hover:underline"
              onClick={() => window.open(uploadImg, '_blank')}
            >
              View
            </button>

            <button
              type="button"
              className="text-red-500 text-sm hover:underline"
              onClick={handleRemove}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
