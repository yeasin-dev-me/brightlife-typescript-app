import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, MapPin, Briefcase, CheckCircle, Calendar, Home, Building, FileText, Wallet } from 'lucide-react';
import jsPDF from 'jspdf';
import logo from '../../assets/images/logo.png';

interface SignupFormData {
  applicantRole: string;
  agentId: string;
  fmName: string;
  roleCode: string;
  dgmName: string;
  dgmCode: string;
  gmName: string;
  gmCode: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  motherName: string;
  presentAddress: string;
  permanentAddress: string;
  dob: string;
  birthPlace: string;
  nidNumber: string;
  bankAccountNumber: string;
  bankName: string;
  bankBranchName: string;
  applicantPhoto: File | null;
  nidDocument: File | null;
  educationCertificate: File | null;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface FormErrors {
  applicantRole?: string;
  agentId?: string;
  fmName?: string;
  roleCode?: string;
  dgmName?: string;
  dgmCode?: string;
  gmName?: string;
  gmCode?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  guardianName?: string;
  motherName?: string;
  presentAddress?: string;
  permanentAddress?: string;
  dob?: string;
  birthPlace?: string;
  nidNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranchName?: string;
  applicantPhoto?: string;
  nidDocument?: string;
  educationCertificate?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
  general?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';
const AGENT_APPLICATION_ENDPOINT = '/v1/agents/applications/';

const createAgentApplicationPayload = (formData: SignupFormData): FormData => {
  const payload = new FormData();
  const stringFields: Record<string, string> = {
    applicantRole: formData.applicantRole,
    agentId: formData.agentId,
    fmName: formData.fmName,
    roleCode: formData.roleCode,
    dgmName: formData.dgmName,
    dgmCode: formData.dgmCode,
    gmName: formData.gmName,
    gmCode: formData.gmCode,
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    guardianName: formData.guardianName,
    motherName: formData.motherName,
    presentAddress: formData.presentAddress,
    permanentAddress: formData.permanentAddress,
    dob: formData.dob,
    birthPlace: formData.birthPlace,
    nidNumber: formData.nidNumber,
    bankAccountNumber: formData.bankAccountNumber,
    bankName: formData.bankName,
    bankBranchName: formData.bankBranchName,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  };

  Object.entries(stringFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      payload.append(key, value);
    }
  });

  payload.append('agreeTerms', formData.agreeTerms ? 'true' : 'false');

  if (formData.applicantPhoto) {
    payload.append('applicantPhoto', formData.applicantPhoto);
  }

  if (formData.nidDocument) {
    payload.append('nidDocument', formData.nidDocument);
  }

  if (formData.educationCertificate) {
    payload.append('educationCertificate', formData.educationCertificate);
  }

  return payload;
};

type UploadField = 'applicantPhoto' | 'nidDocument' | 'educationCertificate';
type InputField = Exclude<keyof SignupFormData, UploadField>;

const generateAgentApplicationPDF = (formData: SignupFormData): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('Bright Life Bangladesh Ltd.', pageWidth / 2, y, { align: 'center' });
  y += 8;
  pdf.setFontSize(14);
  pdf.text('Agent Application Form', pageWidth / 2, y, { align: 'center' });
  y += 12;

  const addLine = (label: string, value: string) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(label, margin, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value || 'N/A', margin + 50, y);
    y += 7;
    if (y > 280) {
      pdf.addPage();
      y = 20;
    }
  };

  pdf.setDrawColor(200, 0, 0);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 6;

  addLine('Applicant Role:', formData.applicantRole);
  addLine('Agent ID:', formData.agentId);
  addLine('F.M Name:', formData.fmName);
  addLine('Role Code:', formData.roleCode);
  addLine('D.G.M Name:', formData.dgmName);
  addLine('D.G.M Code:', formData.dgmCode);
  addLine('G.M Name:', formData.gmName);
  addLine('G.M Code:', formData.gmCode);
  addLine('Full Name:', formData.fullName);
  addLine('Email:', formData.email);
  addLine('Phone:', formData.phone);
  addLine('Guardian/Father/Spouse:', formData.guardianName);
  addLine('Mother Name:', formData.motherName);
  addLine('Present Address:', formData.presentAddress);
  addLine('Permanent Address:', formData.permanentAddress);
  addLine('Date of Birth:', formData.dob);
  addLine('Birth Place:', formData.birthPlace);
  addLine('NID Number:', formData.nidNumber);
  addLine('Bank Account No:', formData.bankAccountNumber);
  addLine('Bank Name:', formData.bankName);
  addLine('Branch Name:', formData.bankBranchName);
  addLine('Applicant Photo Provided:', formData.applicantPhoto ? 'Yes' : 'No');
  addLine('NID Upload Provided:', formData.nidDocument ? 'Yes' : 'No');
  addLine('Educational Certificate:', formData.educationCertificate ? 'Yes' : 'No');

  pdf.save(`agent-application-${formData.agentId || formData.fullName || 'form'}.pdf`);
};

const AgentSignup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    applicantRole: '',
    agentId: '',
    fmName: '',
    roleCode: '',
    dgmName: '',
    dgmCode: '',
    gmName: '',
    gmCode: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    guardianName: '',
    motherName: '',
    presentAddress: '',
    permanentAddress: '',
    dob: '',
    birthPlace: '',
    nidNumber: '',
    bankAccountNumber: '',
    bankName: '',
    bankBranchName: '',
    applicantPhoto: null,
    nidDocument: null,
    educationCertificate: null,
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = <K extends InputField>(field: K, value: SignupFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (field: UploadField, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.applicantRole.trim()) {
      newErrors.applicantRole = 'Applicant role is required';
    }

    if (!formData.agentId.trim()) {
      newErrors.agentId = 'Agent ID is required';
    }

    if (!formData.fmName.trim()) {
      newErrors.fmName = 'F.M Name is required';
    }

    if (!formData.roleCode.trim()) {
      newErrors.roleCode = 'Role code is required';
    }

    if (!formData.dgmName.trim()) {
      newErrors.dgmName = 'D.G.M Name is required';
    }

    if (!formData.dgmCode.trim()) {
      newErrors.dgmCode = 'D.G.M Code is required';
    }

    if (!formData.gmName.trim()) {
      newErrors.gmName = 'G.M Name is required';
    }

    if (!formData.gmCode.trim()) {
      newErrors.gmCode = 'G.M Code is required';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const sanitizedPhone = formData.phone.replace(/[^\d+]/g, '');
    if (!sanitizedPhone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (sanitizedPhone.length < 8) {
      newErrors.phone = 'Please enter a valid phone number (min 8 digits)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.guardianName.trim()) {
      newErrors.guardianName = "Father/Husband's name is required";
    }

    if (!formData.motherName.trim()) {
      newErrors.motherName = "Mother's name is required";
    }

    if (!formData.presentAddress.trim()) {
      newErrors.presentAddress = 'Present address is required';
    }

    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = 'Permanent address is required';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!formData.birthPlace.trim()) {
      newErrors.birthPlace = 'Birth place is required';
    }

    if (!formData.nidNumber.trim()) {
      newErrors.nidNumber = 'NID number is required';
    } else if (formData.nidNumber.replace(/\D/g, '').length < 10) {
      newErrors.nidNumber = 'Please enter a valid NID number';
    }

    if (!formData.bankAccountNumber.trim()) {
      newErrors.bankAccountNumber = 'Account number is required';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData.bankBranchName.trim()) {
      newErrors.bankBranchName = 'Branch name is required';
    }

    if (!formData.applicantPhoto) {
      newErrors.applicantPhoto = 'Applicant image is required';
    }

    if (!formData.nidDocument) {
      newErrors.nidDocument = 'NID upload is required';
    }

    if (!formData.educationCertificate) {
      newErrors.educationCertificate = 'Educational certificate is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (USE_MOCK_API) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        const payload = createAgentApplicationPayload(formData);
        const response = await fetch(`${API_BASE_URL}${AGENT_APPLICATION_ENDPOINT}`, {
          method: 'POST',
          body: payload,
        });

        if (!response.ok) {
          let errorMessage = 'Registration failed. Please try again.';
          try {
            const errorBody = await response.json();
            errorMessage = errorBody?.message || errorMessage;
          } catch {
            // ignore JSON parse errors
          }
          throw new Error(errorMessage);
        }
      }

      generateAgentApplicationPDF(formData);
      setIsSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your agent registration has been submitted. Our team will review your application and contact you within 24-48 hours.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/agent-login')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Go to Agent Login
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img src={logo} alt="BrightLife Logo" className="w-20 h-20 mx-auto mb-4 rounded-full shadow-lg" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Agent Registration</h2>
            <p className="text-gray-600 mt-2">Join our network of trusted agents</p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Top Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Agent Identification</h3>
                <span className="text-xs uppercase tracking-widest text-purple-500 font-semibold">Step 1</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="applicantRole" className="block text-sm font-medium text-gray-700 mb-1">Applicant Role <span className="text-red-500">*</span></label>
                  <select
                    id="applicantRole"
                    value={formData.applicantRole}
                    onChange={(e) => handleInputChange('applicantRole', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.applicantRole ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select applicant role</option>
                    <option value="FO">FO</option>
                    <option value="FM">FM</option>
                    <option value="DGM">DGM</option>
                    <option value="GM">GM</option>
                  </select>
                  {errors.applicantRole && <p className="mt-1 text-sm text-red-600">{errors.applicantRole}</p>}
                </div>
                <div>
                  <label htmlFor="agentId" className="block text-sm font-medium text-gray-700 mb-1">Agent ID <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="agentId"
                      type="text"
                      value={formData.agentId}
                      onChange={(e) => handleInputChange('agentId', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.agentId ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Agent unique ID"
                    />
                  </div>
                  {errors.agentId && <p className="mt-1 text-sm text-red-600">{errors.agentId}</p>}
                </div>
                <div>
                  <label htmlFor="fmName" className="block text-sm font-medium text-gray-700 mb-1">F.M Name <span className="text-red-500">*</span></label>
                  <input
                    id="fmName"
                    type="text"
                    value={formData.fmName}
                    onChange={(e) => handleInputChange('fmName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.fmName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Field Manager Name"
                  />
                  {errors.fmName && <p className="mt-1 text-sm text-red-600">{errors.fmName}</p>}
                </div>
                <div>
                  <label htmlFor="roleCode" className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.applicantRole || 'Role'} Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="roleCode"
                    type="text"
                    value={formData.roleCode}
                    onChange={(e) => handleInputChange('roleCode', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.roleCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={`Enter ${formData.applicantRole || 'role'} code`}
                  />
                  {errors.roleCode && <p className="mt-1 text-sm text-red-600">{errors.roleCode}</p>}
                </div>
                <div>
                  <label htmlFor="dgmName" className="block text-sm font-medium text-gray-700 mb-1">D.G.M Name <span className="text-red-500">*</span></label>
                  <input
                    id="dgmName"
                    type="text"
                    value={formData.dgmName}
                    onChange={(e) => handleInputChange('dgmName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.dgmName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Deputy General Manager Name"
                  />
                  {errors.dgmName && <p className="mt-1 text-sm text-red-600">{errors.dgmName}</p>}
                </div>
                <div>
                  <label htmlFor="dgmCode" className="block text-sm font-medium text-gray-700 mb-1">D.G.M Code <span className="text-red-500">*</span></label>
                  <input
                    id="dgmCode"
                    type="text"
                    value={formData.dgmCode}
                    onChange={(e) => handleInputChange('dgmCode', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.dgmCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Deputy General Manager Code"
                  />
                  {errors.dgmCode && <p className="mt-1 text-sm text-red-600">{errors.dgmCode}</p>}
                </div>
                <div>
                  <label htmlFor="gmName" className="block text-sm font-medium text-gray-700 mb-1">G.M Name <span className="text-red-500">*</span></label>
                  <input
                    id="gmName"
                    type="text"
                    value={formData.gmName}
                    onChange={(e) => handleInputChange('gmName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.gmName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="General Manager Name"
                  />
                  {errors.gmName && <p className="mt-1 text-sm text-red-600">{errors.gmName}</p>}
                </div>
                <div>
                  <label htmlFor="gmCode" className="block text-sm font-medium text-gray-700 mb-1">G.M Code <span className="text-red-500">*</span></label>
                  <input
                    id="gmCode"
                    type="text"
                    value={formData.gmCode}
                    onChange={(e) => handleInputChange('gmCode', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.gmCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="General Manager Code"
                  />
                  {errors.gmCode && <p className="mt-1 text-sm text-red-600">{errors.gmCode}</p>}
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g. +8801XXXXXXXXX or +1XXXXXXXXXX"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-2">Father/Husband's Name <span className="text-red-500">*</span></label>
                  <input
                    id="guardianName"
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => handleInputChange('guardianName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.guardianName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Father or Husband name"
                  />
                  {errors.guardianName && <p className="mt-1 text-sm text-red-600">{errors.guardianName}</p>}
                </div>
                <div>
                  <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-2">Mother's Name <span className="text-red-500">*</span></label>
                  <input
                    id="motherName"
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.motherName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Mother name"
                  />
                  {errors.motherName && <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="applicantPhoto" className="block text-sm font-medium text-gray-700 mb-2">
                  Applicant Photo <span className="text-red-500">*</span>
                </label>
                <input
                  id="applicantPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('applicantPhoto', e.target.files?.[0] ?? null)}
                  className="w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                />
                {formData.applicantPhoto && (
                  <p className="mt-1 text-xs text-gray-500">Selected: {formData.applicantPhoto.name}</p>
                )}
                {errors.applicantPhoto && (
                  <p className="mt-1 text-sm text-red-600">{errors.applicantPhoto}</p>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Address Details</h3>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Official Mailing Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Address used for correspondence"
                  />
                </div>
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="presentAddress" className="block text-sm font-medium text-gray-700 mb-2">Present Address <span className="text-red-500">*</span></label>
                  <textarea
                    id="presentAddress"
                    value={formData.presentAddress}
                    onChange={(e) => handleInputChange('presentAddress', e.target.value)}
                    rows={2}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.presentAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.presentAddress && <p className="mt-1 text-sm text-red-600">{errors.presentAddress}</p>}
                </div>
                <div>
                  <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-700 mb-2">Permanent Address <span className="text-red-500">*</span></label>
                  <textarea
                    id="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                    rows={2}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.permanentAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.permanentAddress && <p className="mt-1 text-sm text-red-600">{errors.permanentAddress}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.dob ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
                </div>
                <div>
                  <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-2">Birth Place <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="birthPlace"
                      type="text"
                      value={formData.birthPlace}
                      onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.birthPlace ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="City, Country"
                    />
                  </div>
                  {errors.birthPlace && <p className="mt-1 text-sm text-red-600">{errors.birthPlace}</p>}
                </div>
              </div>
            </div>

            {/* NID Number */}
            <div>
              <label htmlFor="nidNumber" className="block text-sm font-medium text-gray-700 mb-2">
                NID Number <span className="text-red-500">*</span>
              </label>
              <input
                id="nidNumber"
                type="text"
                value={formData.nidNumber}
                onChange={(e) => handleInputChange('nidNumber', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.nidNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your NID number"
              />
              {errors.nidNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.nidNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="nidDocument" className="block text-sm font-medium text-gray-700 mb-2">
                NID Document Upload <span className="text-red-500">*</span>
              </label>
              <input
                id="nidDocument"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange('nidDocument', e.target.files?.[0] ?? null)}
                className="w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />
              {formData.nidDocument && (
                <p className="mt-1 text-xs text-gray-500">Selected: {formData.nidDocument.name}</p>
              )}
              {errors.nidDocument && (
                <p className="mt-1 text-sm text-red-600">{errors.nidDocument}</p>
              )}
            </div>

            <div>
              <label htmlFor="educationCertificate" className="block text-sm font-medium text-gray-700 mb-2">
                Educational Certificate Upload <span className="text-red-500">*</span>
              </label>
              <input
                id="educationCertificate"
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => handleFileChange('educationCertificate', e.target.files?.[0] ?? null)}
                className="w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />
              {formData.educationCertificate && (
                <p className="mt-1 text-xs text-gray-500">Selected: {formData.educationCertificate.name}</p>
              )}
              {errors.educationCertificate && (
                <p className="mt-1 text-sm text-red-600">{errors.educationCertificate}</p>
              )}
            </div>

            {/* Bank Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Banking Details</h3>
              <div>
                <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700 mb-2">Account Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="bankAccountNumber"
                    type="text"
                    value={formData.bankAccountNumber}
                    onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.bankAccountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter bank account number"
                  />
                </div>
                {errors.bankAccountNumber && <p className="mt-1 text-sm text-red-600">{errors.bankAccountNumber}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">Bank Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="bankName"
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.bankName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Bank name"
                    />
                  </div>
                  {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>}
                </div>
                <div>
                  <label htmlFor="bankBranchName" className="block text-sm font-medium text-gray-700 mb-2">Branch Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="bankBranchName"
                      type="text"
                      value={formData.bankBranchName}
                      onChange={(e) => handleInputChange('bankBranchName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.bankBranchName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Branch name"
                    />
                  </div>
                  {errors.bankBranchName && <p className="mt-1 text-sm text-red-600">{errors.bankBranchName}</p>}
                </div>
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex flex-1 items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the <a href="#" className="text-purple-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleInputChange('agreeTerms', true)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition"
                >
                  Accept Terms
                </button>
              </div>
              {errors.agreeTerms && <p className="text-sm text-red-600">{errors.agreeTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Register as Agent'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">Already an agent?</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            <a href="/agent-login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in to Agent Portal →
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 Bright Life Bangladesh Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AgentSignup;
