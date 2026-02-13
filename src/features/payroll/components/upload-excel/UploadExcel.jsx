import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import "./UploadExcel.scss";
import toaster from "../../../../services/toasterService";
import { Breadcrumb } from "../../../../components/Breadcrumb/Breadcrumb";
import useBreadcrumbs from "../../../../hooks/useBreadCrumbs";
import { icons } from "../../../../Utils/constants";
import * as XLSX from "xlsx";
import PreviewExcel from "../preview-excel/PreviewExcel";

const UploadExcel = () => {
  const [showExcelPreview, setShowExcelPreview] = useState(false)
  useBreadcrumbs([
    {
      icon: icons.uploadExcel,
      label: '',
      path: '/payroll',
    },
    {
      label: 'Upload Excel',
      path: '/payroll/upload-excel',
    },
  ]);
  const fileInputRef = useRef(null);
  const handleClick = () => {
    fileInputRef.current.click();
  };
  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith(".xlsx")) {
      toaster.error("Please upload a valid .xlsx file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log("Excel Data:", jsonData);
      toaster.success("File read successfully!");
    };
    reader.readAsArrayBuffer(file);

    setShowExcelPreview(true)
  };
  const handleDownloadReference = () => {
    const headers = [
      [
        "Employee_ID",
        "Employee_Name",
        "PAN_Number",
        "UAN_Number",
        "Bank_Account_Number",
        "IFSC_Code",
        "Month (MM-YYYY)",
        "Working_Days",
        "Present_Days",
        "Basic_Salary",
        "HRA",
        "Special_Allowance",
        "Bonus",
        "Overtime",
        "Other_Allowances",
        "Gross_Salary",
        "PF_Employee",
        "ESI_Employee",
        "Professional_Tax",
        "TDS",
        "Other_Deductions",
        "Total_Deductions",
        "Net_Salary_Payable",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll_Template");

    XLSX.writeFile(workbook, "Payroll_Template_India.xlsx");
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };
  return (
    <>
      <Breadcrumb />
      {
        !showExcelPreview ? <>
          <div className="upload-container">
            <div
              className="upload-card"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Icon icon="material-symbols:upload-rounded" className="upload-icon" />
              <h2 className="upload-title">Upload Excel File</h2>
              <p className="upload-description">
                Drag & Drop your .xlsx file here
              </p>
              <p className="upload-click">
                or{" "}
                <span onClick={handleClick} style={{ cursor: "pointer" }}>
                  Click here to select file
                </span>
              </p>
              <button
                type="button"
                className="download-btn"
                onClick={handleDownloadReference}
              >
                Download sample Excel
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".xlsx"
                onChange={handleFileChange}
              />
            </div>


          </div></> :
          <div>
            <PreviewExcel />
          </div>
      }
    </>
  );
};

export default UploadExcel;
