/**
 * TypeScript definitions and schemas for BSSC Registration & Login POM
 */

export type YesNo = 'YES' | 'NO';
export type Gender = 'MALE' | 'FEMALE' | 'TRANSGENDER';
export type Category = 'UR' | 'EWS' | 'BC' | 'EBC' | 'SC' | 'ST';
export type DisabilityNatureType = 'PERMANENT' | 'TEMPORARY';

export interface DateOfBirth {
  day: string;
  month: string;
  year: string;
}

export interface PersonalDetails {
  applicantName: string;
  gender: Gender;
  isBiharDomicile: YesNo;
  dob: DateOfBirth;
}

export interface CategoryDetails {
  category: Category;
  caste?: string;
  isNonCreamyLayer?: YesNo;
  categoryCertNo?: string;
  categoryIssueDate?: DateOfBirth;
  categoryAuthority?: string;
  isPwD: YesNo;
  natureOfDisability?: string;
  natureOfDisabilityType?: DisabilityNatureType;
  isMin40PercentPwD?: YesNo;
  disabilityCertNo?: string;
  disabilityIssueDate?: DateOfBirth;
  disabilityAuthority?: string;
  isScribeRequired?: YesNo;
  ownScribeRequired?: YesNo;
  hasUrduInIntermediate?: YesNo;
}

export interface ServiceDetails {
  isExServiceman: YesNo;
  officerType?: string;
  serviceFromDate?: DateOfBirth;
  serviceToDate?: DateOfBirth;
  isBiharGovtEmployee: YesNo;
  bsscAttempts?: string;
  isContractualEmployee: YesNo;
  organizationName?: string;
  nameOfPost?: string;
  contractualFromDate?: DateOfBirth;
  contractualToDate?: DateOfBirth;
  experienceCertificateFileName?: string;
  hasAgreement?: YesNo;
  agreementCopyFileName?: string;
}

export interface ContactDetails {
  mobileNo: string;
  confirmMobileNo: string;
  emailId: string;
  confirmEmailId: string;
  password?: string;
  confirmPassword?: string;
  captcha?: string;
}

export interface RegistrationFormData {
  personal: PersonalDetails;
  category: CategoryDetails;
  service: ServiceDetails;
  contact: ContactDetails;
}
