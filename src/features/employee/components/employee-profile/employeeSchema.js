import dayjs from 'dayjs';
import * as yup from 'yup';

//    STEP 1 – PERSONAL

const personalSchema = yup.object({
  firstName: yup
    .string()
    .required('First Name is required')
    .max(50, 'First Name must be at most 50 characters'),

  lastName: yup
    .string()
    .required('Last Name is required')
    .max(50, 'Last Name must be at most 50 characters'),

  dob: yup
    .string()
    .required('Date of birth is required')
    .test('is-18', 'You must be at least 18 years old', (value) => {
      if (!value) return false;
      const dob = dayjs(value);
      const today = dayjs();
      return today.diff(dob, 'year') >= 18;
    }),
  gender: yup.string().required('Gender is required'),
  maritalStatus: yup.string().required('Marital status is required'),
  bloodGroup: yup.string().required('Blood group is required'),
  nationality: yup.string().required('Nationality is required'),
  personalEmail: yup.string().email('Invalid email').required('Personal email is required'),
  contactNumber: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Mobile number must be 10 digits and start with 6-9'),
  profileUrl: yup.string().required('Upload Profile image'),
  religion: yup.string().required('Religion is required'),

  emergencyContactNum: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Emergency contact number must be 10 digits')
    .required('Emergency contact number is required'),
  emergencyContactPerson: yup
    .string()
    .required('Emergency contact is required')
    .max(50, 'Emergency contact must be at most 50 characters'),
});

//    STEP 2 – ADDRESS
const addressSchema = yup.object({
  addresses: yup.array().of(
    yup.object({
      addressType: yup.string().oneOf(['CURRENT', 'PERMANENT']).required(),
      city: yup
        .string()
        .trim()
        .required('City is required')
        .matches(/^(?=.*\p{L})[\p{L}0-9\s.'\-()/]+$/u, 'Enter a valid city name')
        .max(50, 'City must be at most 50 characters'),
      state: yup
        .string()
        .trim()
        .required('State is required')
        .matches(/^(?=.*\p{L})[\p{L}\s-]+$/u, 'Enter a valid state name')
        .max(50, 'State must be at most 50 characters'),

      pinCode: yup
        .string()
        .required('Pincode is required')
        .matches(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit pincode'),
      country: yup
        .string()
        .trim()
        .required('Country is required')
        .matches(/^(?=.*\p{L})[\p{L}\s-]+$/u, 'Enter a valid country name')
        .max(50, 'Country must be at most 50 characters'),
      doorNum: yup
        .string()
        .trim()
        .required('Door / House No. is required')
        .matches(/^[a-zA-Z0-9\s\/,-]+$/, 'Enter a valid door / house number')
        .max(20, 'Door / House No. must be at most 20 characters'),
      landMark: yup
        .string()
        .trim()
        .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,'()-]+$/, 'Enter a valid landmark')
        .max(50, 'Landmark must be at most 50 characters'),
      areaDetails: yup
        .string()
        .trim()
        .required('Area / Locality is required')
        .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s.'\-()]+$/, 'Enter a valid area / locality')
        .max(50, 'Area / Locality must be at most 50 characters'),
    }),
  ),
  currentAddressSelected: yup.boolean(),
});

// const passportSchema = yup.object({
//   passportNumber: yup.string().required('Passport number is required'),
//   passportPlace: yup.string().required('Place of issue is required'),
//   passportIssueDate: yup.string().required('Issue date is required'),
//   passportExpiryDate: yup.string().required('Expiry date is required'),
// });

//    STEP 4 – ACADEMIC
const yearSchema = yup
  .string()
  .required('Year is required')
  .matches(/^\d{4}$/, 'Year must be exactly 4 digits');

export const academicSchema = yup.object({
  employeeEducation: yup.array().of(
    yup.object({
      qualificationLevel: yup.string().required('Qualification level is required'),

      degreeName: yup.string().required('Degree name is required'),

      specialization: yup.string().required('Specialization is required'),

      institutionName: yup.string().required('Institution name is required'),

      universityName: yup.string().required('University name is required'),

      startYear: yearSchema.required('Start year is required'),
      endYear: yearSchema
        .required('End year is required')
        .test(
          'endYear-greater',
          'End year must be greater than or equal to start year',
          function (value) {
            const { startYear } = this.parent;
            if (!startYear || !value) return true;
            return Number(value) >= Number(startYear);
          },
        ),

      completionYear: yearSchema
        .required('Completion year is required')
        .test(
          'completionYear-valid',
          'Completion year must be between start year and end year',
          function (value) {
            const { startYear, endYear } = this.parent;
            if (!startYear || !endYear || !value) return true;
            return Number(value) >= Number(startYear) && Number(value) <= Number(endYear);
          },
        ),
      gradeOrPercentage: yup.string().required('Grade / Percentage is required'),
      educationDocumentUrl: yup.string().required('Education document upload is required'),
    }),
  ),
});

const employmentSchema = yup.object({
  // doj: yup.string().required('Date of joining is required'),
  employmentTypeId: yup.string().required('Employment type is required'),
  departmentId: yup.string().required('Department is required'),
  designationId: yup.string().required('Designation is required'),
  // location: yup.string().required('Work location is required'),
  // officialEmail: yup.string().email('Invalid email').required('Office email is required'),
  // manager: yup.string().required('Reporting manager is required'),
  // bgStatus: yup.string().required('BG status is required'),
});

export const experienceSchema = yup.object({
  experiences: yup.array().of(
    yup.object({
      companyName: yup
        .string()
        .required('Company name is required')
        .min(3, 'Company name must be at least 3 characters')
        .max(50, 'Company name cannot exceed 50 characters')
        .trim('Company name cannot be empty'),
      totalExperience: yup
        .number()
        .typeError('Total experience must be a number')
        .min(0, 'Experience cannot be negative')
        .max(99, 'Total experience cannot be more than 99 years')
        .required('Total experience is required'),
      experienceUrl: yup.string().required('Experience letter upload is required'),
      relivingUrl: yup.string().required('Relieving letter upload is required'),
      paySlipUrl: yup.string().required('Pay slip upload is required'),
      bankStatementUrl: yup.string().required('Bank statement upload is required'),
    }),
  ),
});

//    STEP 7 – DEPENDENCY & BANK

const dependencyBankSchema = yup.object({
  bankName: yup
    .string()
    .required('Bank name is required')
    .min(3, 'Bank name must be at least 3 characters')
    .max(100, 'Bank name cannot exceed 100 characters')
    .trim('Bank name cannot be empty'),

  bankAccHolderName: yup
    .string()
    .required('Account holder name is required')
    .min(3, 'Account holder name must be at least 3 characters')
    .max(100, 'Account holder name cannot exceed 100 characters')
    .trim('Account holder name cannot be empty'),

  bankBranch: yup
    .string()
    .required('Bank branch is required')
    .min(3, 'Bank branch must be at least 3 characters')
    .max(100, 'Bank branch cannot exceed 100 characters')
    .trim('Bank branch cannot be empty'),
  bankAccNum: yup
    .string()
    .required('Account number is required')
    .matches(/^[0-9]{9,18}$/, 'Account number must be 9 to 18 digits'),
  ifscCode: yup
    .string()
    .required('IFSC code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format (e.g., SBIN0001234)'),
  uanNumber: yup
    .string()
    .nullable()
    .notRequired()
    .matches(/^[0-9]{12}$/, {
      message: 'UAN must be 12 digits',
      excludeEmptyString: true,
    }),

  esiNumber: yup
    .string()
    .nullable()
    .notRequired()
    .matches(/^[0-9]{10}$/, {
      message: 'ESI number must be 10 digits',
      excludeEmptyString: true,
    }),
});
// const dependencyBankSchema = yup.object({
//   bankName: yup.string().required('Bank name is required'),

//   bankAccHolderName: yup
//     .string()
//     .required('Account holder name is required')
//     .matches(/^[A-Za-z ]+$/, 'Only alphabets allowed'),

//   bankAccNum: yup
//     .string()
//     .required('Account number is required')
//     .matches(/^[0-9]{9,18}$/, 'Account number must be 9 to 18 digits'),

//   bankBranch: yup.string().required('Bank branch is required'),

//   ifscCode: yup
//     .string()
//     .required('IFSC code is required')
//     .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format (e.g., SBIN0001234)'),
// });
export const documentSchema = yup.object({
  documents: yup
    .array()
    .of(
      yup.object({
        documentName: yup.string().required('Document name is required'),
        documentNumber: yup.string().when('documentName', {
          is: 'Aadhar',
          then: (schema) =>
            schema
              .required('Aadhar number is required')
              .matches(/^\d{12}$/, 'Aadhar must be 12 digits'),

          otherwise: (schema) =>
            schema.when('documentName', {
              is: 'PAN',
              then: (s) =>
                s
                  .required('PAN number is required')
                  .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),

              otherwise: (s) =>
                s.when('documentName', {
                  is: 'Voter ID',
                  then: (v) =>
                    v
                      .required('Voter ID is required')
                      .matches(/^[A-Z0-9]{6,10}$/, 'Invalid Voter ID'),

                  otherwise: (v) =>
                    v.when('documentName', {
                      is: 'Driving License',
                      then: (d) =>
                        d
                          .required('Driving License number is required')
                          .matches(/^[A-Z0-9]{10,16}$/, 'Invalid Driving License number'),

                      otherwise: (d) =>
                        d.when('documentName', {
                          is: 'Passport',
                          then: (p) =>
                            p
                              .required('Passport number is required')
                              .matches(/^[A-Z]{1}[0-9]{7}$/, 'Invalid Passport number'),

                          otherwise: (p) => p.notRequired(), // Resume or others
                        }),
                    }),
                }),
            }),
        }),
        documentUrl: yup.string().required('Document upload is required'),
      }),
    )
    .test('aadhar-pan-required', 'Aadhar and PAN documents are mandatory', (documents = []) => {
      const names = documents.map((d) => d.documentName);
      return names.includes('Aadhar') && names.includes('PAN');
    }),
});

export const familySchema = yup.object({
  familyDetails: yup.array().of(
    yup.object({
      relationType: yup.string().required('Relation is required'),
      memberName: yup.string().required('Name is required'),
      occupation: yup.string().required('Occupation is required'),

      dob: yup.string().required('Date of birth is required'),

      contactNumber: yup
        .string()
        .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits')
        .required('Contact number is required'),

      // emailId: yup.string().email('Invalid email').required('Email is required'),

      aadharNumber: yup
        .string()
        .matches(/^[0-9]{12}$/, 'Aadhar must be 12 digits')
        .required('Aadhar number is required'),

      aadharUrl: yup.string().required('Aadhar document upload is required'),
    }),
  ),
});

export const stepSchemas = [
  personalSchema,
  addressSchema,
  familySchema,
  academicSchema,
  // employmentSchema,
  experienceSchema,
  dependencyBankSchema,
  documentSchema,
];
