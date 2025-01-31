import React from 'react';
import { FileText } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Data arrays for select options
const countries = [
  { code: '+250', name: 'Rwanda' },
  { code: '+44', name: 'Uganda' },
  { code: '+1', name: 'Kenya' },
];

const districts = [
  { id: '1', name: 'Gasabo' },
  { id: '2', name: 'Kicukiro' },
  { id: '3', name: 'Nyarugenge' },
  { id: '4', name: 'Kamonyi' },
  { id: '5', name: 'Gicumbi' },
];

const provinces = [
  { id: '1', name: 'Northern Province' },
  { id: '2', name: 'Western Province' },
  { id: '3', name: 'Kigali City' },
  { id: '4', name: 'Southern Province' },
  { id: '5', name: 'Eastern Province' },
];

// Business types for select options
const businessTypes = [
  { value: 'Retailer', label: 'Retailer' },
  { value: 'Wholesale', label: 'Wholesale' },
  { value: 'Manufacturer', label: 'Manufacturer' },
];

// Product categories for select options
const productCategories = [
  { value: 'General Purpose', label: 'General Purpose' },
  { value: 'Construction Materials', label: 'Construction materials' },
  { value: 'Chemicals', label: 'Chemicals' },
];

// Validation schema using Yup

const validationSchema = Yup.object().shape({
  // Personal Information Validation
  citizenship: Yup.string().required('This field is required'),
  nationalId: Yup.string().when('citizenship', {
    is: 'Rwandan',
    then: (schema) => schema.length(16, 'ID must be 16 digits').required('This field is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  passportId: Yup.string().when('citizenship', {
    is: 'Foreigner',
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  otherNames: Yup.string().required('This field is required'),
  surname: Yup.string().required('This field is required'),
  nationality: Yup.string().required('This field is required'),
  telephone: Yup.string().matches(/^\d+$/, 'N/A'),
  email: Yup.string().email('Invalid email format'),
  district: Yup.string().required('This field is required'),

  // Business Information Validation
  businessType: Yup.string().required('Business type is required'),
  companyName: Yup.string()
    .min(2, 'Company name must be at least 2 characters')
    .required('Company name is required'),
  tinNumber: Yup.string()
    .matches(/^\d{9}$/, 'Please provide a valid TIN number')
    .required('This field is required'),
  regDate: Yup.date()
    .max(new Date(), 'Registration date cannot be in the future')
    .required('This field is required'),
  businessDistrict: Yup.string().required('This field is required'),

  // Product Information Validation
  purpose: Yup.string().required('This field is required'),
  otherpurpose: Yup.string().when('purpose', {
    is: 'Other',
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  category: Yup.string().required('This field is required'),
  productName: Yup.string().required('This field is required'),
  weight: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .positive('Weight must be positive'),
  unit: Yup.string().when('weight', {
    is: (val) => val && val > 0,
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  quantity: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .positive('Please provide a number greater than zero')
    .required('This field is required'),
  description: Yup.string().required('This field is required')
}).required();

const DetailForm = () => {
  // Initial form values
  const initialValues = {
    citizenship: '',
    nationalId: '',
    passportId: '',
    otherNames: '',
    surname: '',
    nationality: '',
    countryCode: '+250',
    telephone: '',
    email: '',
    district: '',
    businessType: '',
    companyName: '',
    tinNumber: '',
    regDate: '',
    businessDistrict: '',
    purpose: '',
    otherpurpose: '',
    category: '',
    productName: '',
    weight: '',
    unit: '',
    quantity: '',
    description: '',
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(`${API_URL}/registerDetails`, {
        ...values,
        telephone: values.countryCode + values.telephone,
      });
      toast.success(response.data.message || 'Details registered successfully');
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An error occurred');
    }
    setSubmitting(false);
  };

  return (
    <div className="pb-12">
      <ToastContainer />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form className="">
            {/* Business Owner Details Section */}
            <div className="mx-auto w-[60vw] border border-blue-600 rounded-lg mb-8">
              <div className="bg-blue-100 p-3 w-full h-full px-8 border border-b-blue-600">
                <h1 className="text-blue-600 flex items-center gap-[0.6rem] text-lg">
                  <FileText /> Business Owner Details
                </h1>
              </div>
              <div className="flex flex-col border w-full md:mx-auto px-3 md:px-8 pt-5">
                <h1 className="text-black font-bold mb-4 text-md">
                  Business Owner Details
                </h1>

                {/* Citizenship Selection */}
                <div className="mb-6 flex flex-col">
                  <label className="text-sm">
                    Applicant citizenship{' '}
                    <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="select"
                    name="citizenship"
                    className="w-[40%] px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                  >
                    <option value="">Select citizenship</option>
                    <option value="Rwandan">Rwandan</option>
                    <option value="Foreigner">Foreigner</option>
                  </Field>
                  <ErrorMessage
                    name="citizenship"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Conditional ID Fields based on Citizenship */}
                {values.citizenship === 'Rwandan' && (
                  <div className="mb-6 flex flex-col">
                    <label className="text-sm">
                      National ID <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="text"
                      name="nationalId"
                      className="w-[40%] px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                      placeholder="Enter National ID number"
                    />
                    <ErrorMessage
                      name="nationalId"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                )}

                {values.citizenship === 'Foreigner' && (
                  <div className="mb-6 flex flex-col">
                    <label className="text-sm">
                      Passport Number <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="text"
                      name="passportId"
                      className="w-[40%] px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                      placeholder="Enter passport number"
                    />
                    <ErrorMessage
                      name="passportId"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                )}

                {/* Personal Information Fields */}
                <div className="mb-6 flex flex-col w-[40%]">
                  <label className="text-sm">
                    Other Names <span className="text-red-600">*</span>
                  </label>
                  <Field
                    type="text"
                    name="otherNames"
                    className="px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                  />
                  <ErrorMessage name="otherNames" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div className="mb-6 flex flex-col w-[40%]">
                  <label className="text-sm">
                    Surname <span className="text-red-600">*</span>
                  </label>
                  <Field
                    type="text"
                    name="surname"
                    className="px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                  />
                  <ErrorMessage name="surname" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Nationality Selection */}
                <div className="mb-6 flex flex-col">
                  <label className="text-sm">
                    Nationality <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="select"
                    name="nationality"
                    className="w-[40%] px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                  >
                    <option value="">Select nationality</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="nationality" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Contact Information */}
                <div className="flex">
                  <div className="mb-6 flex flex-col mr-4 w-[40%]">
                    <label className="text-sm">Phone Number</label>
                    <div className="flex">
                      <Field
                        as="select"
                        name="countryCode"
                        className="px-1 py-2 mt-2 border border-gray-300 rounded-l focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                      >
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.code}
                          </option>
                        ))}
                      </Field>
                      <Field
                        type="text"
                        name="telephone"
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-r focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                        placeholder="Phone number"
                      />
                    </div>
                    <ErrorMessage
                      name="telephone"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-6 flex flex-col w-[40%]">
                    <label className="text-sm">Email Address</label>
                    <Field
                      type="email"
                      name="email"
                      className="px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                      placeholder="Enter email address"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Business Owner Address */}
                <div className="mb-6 flex flex-col">
                  <h1 className="text-black mb-4 text-md font-bold">
                    Business Owner Address
                  </h1>
                  <label className="text-sm">
                    Location <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="select"
                    name="district"
                    className="w-[40%] px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                  >
                    <option value="">Select district</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="district"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Business Details Section */}
            <div className="mx-auto w-[60vw] border border-blue-600 rounded-lg mb-8">
              <div className="bg-blue-100 p-3 w-full h-full px-8 border border-b-blue-600">
                <h1 className="text-blue-600 flex items-center gap-[0.6rem] text-lg">
                  <FileText /> Business Details
                </h1>
              </div>
              <div className="flex flex-col border w-full md:mx-auto px-3 md:px-8 pt-5">
                <h1 className="text-black font-bold mb-4 text-md">
                  Business Details
                </h1>

                <div className="flex">
                  {/* Business Type */}

                  <div className="mb-6 flex flex-col mr-4 w-[40%]">
                    <label className="text-sm">
                      Business type <span className="text-red-600">*</span>
                    </label>
                    <Field
                      as="select"
                      name="businessType"
                      className="px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                    >
                      <option value="">Business type</option>
                      {businessTypes.map((business) => (
                      <option key={business.value} value={business.value}>
                        {business.label}
                      </option>
                    ))}
                    </Field>
                    <ErrorMessage
                      name="businessType"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="mb-6 flex flex-col w-[40%]">
                    <label className="text-sm">
                      Company name <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="text"
                      name="companyName"
                      className="px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                      placeholder="Enter company name"
                    />
                    <ErrorMessage
                      name="companyName"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="flex">
                  {/* TIN Number */}
                  <div className="mb-6 flex flex-col mr-4 w-[40%]">
                    <label className="text-sm">
                      TIN Number <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="text"
                      name="tinNumber"
                      className="px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                      placeholder="Enter TIN Number"
                    />
                    <ErrorMessage
                      name="tinNumber"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* Registration Date */}
                  <div className="mb-6 flex flex-col w-[40%]">
                    <label className="text-sm">
                      Registration date <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="date"
                      name="registrationDate"
                      className=" px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                    />
                    <ErrorMessage
                      name="registrationDate"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Business Address */}
                <div className="mb-6 flex flex-col">
                  <h1 className="text-black mb-4 text-md font-bold">
                    Business Address
                  </h1>
                  <label className="text-sm">
                    Province <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="select"
                    name="province"
                    className="w-[40%] px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                  >
                    <option value="">Select province</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="province"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Product description */}
            <div className="mx-auto w-[60vw] border border-blue-600 rounded-lg mb-8">
              <div className="bg-blue-100 p-3 w-full h-full px-8 border border-b-blue-600">
                <h1 className="text-blue-600 text-lg flex items-center gap-[0.6rem]">
                  <FileText /> Product Information
                </h1>
              </div>
              <div className="flex flex-col border w-full md:mx-auto px-3 md:px-8 pt-5">
                <h1 className="text-black font-bold mb-4 text-md">
                  Importation Details
                </h1>

                <div className="mb-6 flex flex-col">
                  <label className="text-sm">
                    Purpose of Importation{' '}
                    <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="select"
                    name="purpose"
                    className="w-[40%] px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                  >
                    <option value="">Select the purpose of importation</option>
                    <option value="Direct Sale">Direct sale</option>
                    <option value="Personal Use">Personal use</option>
                    <option value="Trial Use">Trial use</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="purpose"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {values.purpose === 'Other' && (
                  <div className="mb-6 flex flex-col">
                    <label className="text-sm">
                      Specify purpose of importation{' '}
                      <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="text"
                      name="otherpurpose"
                      className="w-[40%] px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                      placeholder="Enter purpose of importation"
                    />
                    <ErrorMessage
                      name="otherpurpose"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                )}

                <h1 className="text-black font-bold mb-4 text-md">
                  Product Details
                </h1>
                <div className="mb-6 flex flex-col">
                  <label className="text-sm">
                    Product category <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="select"
                    name="category"
                    className="w-[40%] px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                  >
                    <option value="">Select product category</option>
                    {productCategories.map((productCategory) => (
                      <option key={productCategory.value} value={productCategory.value}>
                        {productCategory.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="mb-6 flex flex-col w-[40%]">
                  <label className="text-sm">
                    Product Name <span className="text-red-600">*</span>
                  </label>
                  <Field
                    type="text"
                    name="productName"
                    className="px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                    placeholder="Enter product name"
                  />
                  <ErrorMessage
                    name="productName"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="mb-6 flex flex-col w-[40%]">
                  <label className="text-sm">Weight(kg)</label>
                  <Field
                    type="text"
                    name="weight"
                    className="px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                  />
                  <ErrorMessage
                    name="weight"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="flex">
                  <div className="mb-6 flex flex-col mr-4 w-[40%]">
                    <label className="text-sm">
                      Unit of measurement{' '}
                      <span className="text-red-600">*</span>
                    </label>
                    <Field
                      as="select"
                      name="unit"
                      className="px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                    >
                      <option value="">Select unit of measurement</option>
                      <option value="Kgs">Kgs</option>
                      <option value="Tonnes">Tonnes</option>
                    </Field>
                    <ErrorMessage
                      name="unit"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-6 flex flex-col w-[40%]">
                    <label className="text-sm">
                      Quantity of product{' '}
                      <span className="text-red-600">*</span>
                    </label>
                    <Field
                      type="number"
                      name="quantity"
                      min="1"
                      className="px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                      placeholder="Enter quantity"
                    />
                    <ErrorMessage
                      name="quantity"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="mb-6 flex flex-col w-[82%] h-36">
                  <label className="text-sm">
                    Description of products{' '}
                    <span className="text-red-600">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    className="h-full px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-black text-sm"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-[60vw] mb-6 flex justify-center mx-auto text-sm px-4 py-2 text-white bg-blue-600 rounded-3xl hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Loading...' : 'Apply'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DetailForm;
