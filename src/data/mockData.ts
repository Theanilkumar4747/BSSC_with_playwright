import {
  Category,
  DateOfBirth,
  Gender,
  RegistrationFormData,
  YesNo
} from './registrationTypes';

export const AGE_REFERENCE_DATE: Date = new Date(2025, 7, 1);

export interface AgeValidationScenario {
  name: string;
  dob: DateOfBirth;
  gender: Gender;
  category: Category;
  isPwD?: YesNo;
  isMin40PercentPwD?: YesNo;
  isExServiceman?: YesNo;
  expected: boolean;
}

export const AGE_VALIDATION_SCENARIOS: AgeValidationScenario[] = [
  { name: 'UR male at minimum age 18', dob: { day: '01', month: '08', year: '2007' }, gender: 'MALE', category: 'UR', expected: true },
  { name: 'UR male below minimum age 18', dob: { day: '01', month: '08', year: '2008' }, gender: 'MALE', category: 'UR', expected: false },
  { name: 'UR male at maximum age 37', dob: { day: '01', month: '08', year: '1988' }, gender: 'MALE', category: 'UR', expected: true },
  { name: 'UR male above maximum age 37', dob: { day: '01', month: '08', year: '1987' }, gender: 'MALE', category: 'UR', expected: false },
  { name: 'UR female at minimum age 18', dob: { day: '01', month: '08', year: '2007' }, gender: 'FEMALE', category: 'UR', expected: true },
  { name: 'UR female at maximum age 40', dob: { day: '01', month: '08', year: '1985' }, gender: 'FEMALE', category: 'UR', expected: true },
  { name: 'UR female above maximum age 40', dob: { day: '01', month: '08', year: '1984' }, gender: 'FEMALE', category: 'UR', expected: false },
  { name: 'BC male at maximum age 40', dob: { day: '01', month: '08', year: '1985' }, gender: 'MALE', category: 'BC', expected: true },
  { name: 'BC male above maximum age 40', dob: { day: '01', month: '08', year: '1984' }, gender: 'MALE', category: 'BC', expected: false },
  { name: 'BC transgender candidate at maximum age 42', dob: { day: '01', month: '08', year: '1983' }, gender: 'TRANSGENDER', category: 'BC', expected: true },
  { name: 'BC transgender candidate above maximum age 42', dob: { day: '01', month: '08', year: '1982' }, gender: 'TRANSGENDER', category: 'BC', expected: false },
  { name: 'EBC female at maximum age 40', dob: { day: '01', month: '08', year: '1985' }, gender: 'FEMALE', category: 'EBC', expected: true },
  { name: 'EBC female above maximum age 40', dob: { day: '01', month: '08', year: '1984' }, gender: 'FEMALE', category: 'EBC', expected: false },
  { name: 'SC male at maximum age 42', dob: { day: '01', month: '08', year: '1983' }, gender: 'MALE', category: 'SC', expected: true },
  { name: 'SC male above maximum age 42', dob: { day: '01', month: '08', year: '1982' }, gender: 'MALE', category: 'SC', expected: false },
  { name: 'ST female at maximum age 42', dob: { day: '01', month: '08', year: '1983' }, gender: 'FEMALE', category: 'ST', expected: true },
  { name: 'ST female above maximum age 42', dob: { day: '01', month: '08', year: '1982' }, gender: 'FEMALE', category: 'ST', expected: false },
  { name: 'PwBD UR male at extended maximum age 47', dob: { day: '01', month: '08', year: '1978' }, gender: 'MALE', category: 'UR', isPwD: 'YES', isMin40PercentPwD: 'YES', expected: true },
  { name: 'PwBD UR male below 40% disability threshold has no extension', dob: { day: '01', month: '08', year: '1987' }, gender: 'MALE', category: 'UR', isPwD: 'YES', isMin40PercentPwD: 'NO', expected: false },
  { name: 'PwBD UR male above extended maximum age 47', dob: { day: '01', month: '08', year: '1977' }, gender: 'MALE', category: 'UR', isPwD: 'YES', isMin40PercentPwD: 'YES', expected: false },
  { name: 'Ex-serviceman UR male at extended maximum age 40', dob: { day: '01', month: '08', year: '1985' }, gender: 'MALE', category: 'UR', isExServiceman: 'YES', expected: true },
  { name: 'Ex-serviceman UR male above extended maximum age 40', dob: { day: '01', month: '08', year: '1984' }, gender: 'MALE', category: 'UR', isExServiceman: 'YES', expected: false },
];

export interface AgeLimitScenario {
  category: Category;
  gender: Gender;
  maxAge: number;
}

export const AGE_LIMIT_SCENARIOS: AgeLimitScenario[] = [
  { category: 'UR', gender: 'MALE', maxAge: 37 },
  { category: 'UR', gender: 'FEMALE', maxAge: 40 },
  { category: 'EWS', gender: 'MALE', maxAge: 37 },
  { category: 'EWS', gender: 'FEMALE', maxAge: 40 },
  { category: 'BC', gender: 'MALE', maxAge: 40 },
  { category: 'BC', gender: 'FEMALE', maxAge: 40 },
  { category: 'BC', gender: 'TRANSGENDER', maxAge: 42 },
  { category: 'EBC', gender: 'MALE', maxAge: 40 },
  { category: 'EBC', gender: 'FEMALE', maxAge: 40 },
  { category: 'SC', gender: 'MALE', maxAge: 42 },
  { category: 'SC', gender: 'FEMALE', maxAge: 42 },
  { category: 'ST', gender: 'MALE', maxAge: 42 },
  { category: 'ST', gender: 'FEMALE', maxAge: 42 },
];

export interface DisabilityServiceCombination {
  isPwD: YesNo;
  isMin40PercentPwD: YesNo;
  isExServiceman: YesNo;
  eligibleAtAge38: boolean;
}

export const DISABILITY_SERVICE_COMBINATIONS: DisabilityServiceCombination[] = [
  { isPwD: 'NO', isMin40PercentPwD: 'NO', isExServiceman: 'NO', eligibleAtAge38: false },
  { isPwD: 'NO', isMin40PercentPwD: 'YES', isExServiceman: 'NO', eligibleAtAge38: false },
  { isPwD: 'YES', isMin40PercentPwD: 'NO', isExServiceman: 'NO', eligibleAtAge38: false },
  { isPwD: 'YES', isMin40PercentPwD: 'YES', isExServiceman: 'NO', eligibleAtAge38: true },
  { isPwD: 'NO', isMin40PercentPwD: 'NO', isExServiceman: 'YES', eligibleAtAge38: true },
  { isPwD: 'NO', isMin40PercentPwD: 'YES', isExServiceman: 'YES', eligibleAtAge38: true },
  { isPwD: 'YES', isMin40PercentPwD: 'NO', isExServiceman: 'YES', eligibleAtAge38: true },
  { isPwD: 'YES', isMin40PercentPwD: 'YES', isExServiceman: 'YES', eligibleAtAge38: true },
];

export const AGE_TEST_DATA = {
  referenceDateLabel: '01-08-2025',
  profile: {
    applicantName: 'AGE VALIDATION TEST',
    gender: 'MALE' as Gender,
    category: 'UR' as Category,
    isBiharDomicile: 'YES' as YesNo,
  },
  ages: {
    minimum: 18,
    belowMinimum: 17,
    noDisabilityRelaxation: 38,
    disabilityMaximum: 47,
    exServicemanMaximum: 40,
    urMaleMaximumWithoutRelaxation: 37,
  },
  answers: {
    yes: 'YES' as YesNo,
    no: 'NO' as YesNo,
  },
  birthday: {
    cutoffDay: '01',
    dayBeforeCutoff: '02',
  },
  status: {
    eligible: 'AGE ELIGIBILITY: CRITERIA MET',
    ineligible: 'AGE ELIGIBILITY: NOT MET',
  },
  minimumAgeMessage: 'Below minimum age of 18 years as on 01-08-2025.',
  maximumAgeExceededMessagePrefix: 'Exceeds the maximum age limit of',
  maximumAgeMessage: (age: number): RegExp => new RegExp(`maximum age limit of ${age} years`),
} as const;

export function getDateOfBirthForAge(
  age: number,
  day: string = AGE_TEST_DATA.birthday.cutoffDay,
): DateOfBirth {
  return {
    day,
    month: String(AGE_REFERENCE_DATE.getMonth() + 1).padStart(2, '0'),
    year: String(AGE_REFERENCE_DATE.getFullYear() - age),
  };
}

export interface AgeValidationRequest {
  dob: DateOfBirth | string;
  gender: Gender;
  category: Category;
  isPwD?: YesNo;
  isMin40PercentPwD?: YesNo;
  isExServiceman?: YesNo;
  referenceDate?: Date;
}

export interface AgeValidationResult {
  age: number;
  minAge: number;
  maxAge: number;
  isValid: boolean;
  gender: Gender;
  category: Category;
  isPwD: boolean;
  isExServiceman: boolean;
  reason?: string;
}

export class AgeValidationService {
  static readonly referenceDate: Date = AGE_REFERENCE_DATE;

  static calculateAge(dob: DateOfBirth | string, referenceDate: Date = this.referenceDate): number {
    const birthDate = this.toDate(dob);
    if (!birthDate || Number.isNaN(birthDate.getTime())) {
      return NaN;
    }

    let age = referenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
    const dayDiff = referenceDate.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }

    return age;
  }

  static toDate(dob: DateOfBirth | string): Date | null {
    if (typeof dob === 'string') {
      const parsed = new Date(dob);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
      return null;
    }
    if (!dob || !dob.day || !dob.month || !dob.year) {
      return null;
    }
    const year = Number(dob.year);
    const month = Number(dob.month) - 1;
    const day = Number(dob.day);

    if ([year, month, day].some((value) => !Number.isFinite(value))) {
      return null;
    }

    return new Date(year, month, day);
  }

  static getAgeLimitForCategory(
    category: Category,
    gender: Gender,
    isPwD: YesNo = 'NO',
    isExServiceman: YesNo = 'NO',
    isMin40PercentPwD: YesNo = 'NO'
  ): { minAge: number; maxAge: number } {
    const baseLimits: Record<Category, Record<Gender, { minAge: number; maxAge: number }>> = {
      UR: {
        MALE: { minAge: 18, maxAge: 37 },
        FEMALE: { minAge: 18, maxAge: 40 },
        TRANSGENDER: { minAge: 18, maxAge: 40 }
      },
      EWS: {
        MALE: { minAge: 18, maxAge: 37 },
        FEMALE: { minAge: 18, maxAge: 40 },
        TRANSGENDER: { minAge: 18, maxAge: 40 }
      },
      BC: {
        MALE: { minAge: 18, maxAge: 40 },
        FEMALE: { minAge: 18, maxAge: 40 },
        TRANSGENDER: { minAge: 18, maxAge: 42 }
      },
      EBC: {
        MALE: { minAge: 18, maxAge: 40 },
        FEMALE: { minAge: 18, maxAge: 40 },
        TRANSGENDER: { minAge: 18, maxAge: 40 }
      },
      SC: {
        MALE: { minAge: 18, maxAge: 42 },
        FEMALE: { minAge: 18, maxAge: 42 },
        TRANSGENDER: { minAge: 18, maxAge: 42 }
      },
      ST: {
        MALE: { minAge: 18, maxAge: 42 },
        FEMALE: { minAge: 18, maxAge: 42 },
        TRANSGENDER: { minAge: 18, maxAge: 42 }
      }
    };

    const base = baseLimits[category]?.[gender] ?? { minAge: 18, maxAge: 37 };
    let maxAge = base.maxAge;

    const disabilityRelaxation = isPwD === 'YES' && isMin40PercentPwD === 'YES' ? 10 : 0;
    const exServicemanRelaxation = isExServiceman === 'YES' ? 3 : 0;
    maxAge += Math.max(disabilityRelaxation, exServicemanRelaxation);
    return { minAge: base.minAge, maxAge };
  }

  static validateAge(options: AgeValidationRequest): AgeValidationResult {
    const {
      dob,
      gender,
      category,
      isPwD = 'NO',
      isMin40PercentPwD = 'NO',
      isExServiceman = 'NO',
      referenceDate = this.referenceDate
    } = options;
    const age = this.calculateAge(dob, referenceDate);
    const { minAge, maxAge } = this.getAgeLimitForCategory(category, gender, isPwD, isExServiceman, isMin40PercentPwD);

    if (Number.isNaN(age)) {
      return {
        age: NaN,
        minAge,
        maxAge,
        isValid: false,
        gender,
        category,
        isPwD: isPwD === 'YES',
        isExServiceman: isExServiceman === 'YES',
        reason: 'Invalid date of birth provided.'
      };
    }

    if (age < minAge) {
      return {
        age,
        minAge,
        maxAge,
        isValid: false,
        gender,
        category,
        isPwD: isPwD === 'YES',
        isExServiceman: isExServiceman === 'YES',
        reason: `Age ${age} is below the minimum eligible age of ${minAge}.`
      };
    }

    if (age > maxAge) {
      return {
        age,
        minAge,
        maxAge,
        isValid: false,
        gender,
        category,
        isPwD: isPwD === 'YES',
        isExServiceman: isExServiceman === 'YES',
        reason: `Age ${age} exceeds the maximum eligible age of ${maxAge}.`
      };
    }

    return {
      age,
      minAge,
      maxAge,
      isValid: true,
      gender,
      category,
      isPwD: isPwD === 'YES',
      isExServiceman: isExServiceman === 'YES',
      reason: 'Candidate age is within the eligible range.'
    };
  }
}

/**
 * Utility to generate unique test data for registration tests
 */
export class TestDataGenerator {
  /**
   * Generates a unique 10-digit mobile number starting with 9, 8, 7, or 6
   */
  public static generateMobileNumber(): string {
    const prefixes = ['98', '99', '97', '96', '88', '77'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8);
    return `${prefix}${randomDigits}`;
  }

  /**
   * Generates a unique email with timestamp
   */
  public static generateEmail(prefix: string = 'candidate'): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(100 + Math.random() * 900);
    return `${prefix}${timestamp}${random}@yopmail.com`;
  }

  public static getCandidateWithMismatchedMobileNumbers(): RegistrationFormData {
    const candidate = this.getValidURCandidate();
    let confirmMobileNo = this.generateMobileNumber();

    while (confirmMobileNo === candidate.contact.mobileNo) {
      confirmMobileNo = this.generateMobileNumber();
    }

    return {
      ...candidate,
      contact: {
        ...candidate.contact,
        confirmMobileNo
      }
    };
  }

  public static getRegistrationCoverageCandidate(): RegistrationFormData {
    const candidate = this.getValidURCandidate();

    return {
      ...candidate,
      personal: {
        ...candidate.personal,
        applicantName: 'PLAYWRIGHT TEST CANDIDATE',
        gender: 'MALE',
        isBiharDomicile: 'YES',
        dob: { day: '15', month: '08', year: '1996' },
      },
      category: {
        category: 'BC',
        caste: 'Yadav',
        isNonCreamyLayer: 'NO',
        isPwD: 'YES',
        natureOfDisability: 'Locomotor Disability(OH)',
        natureOfDisabilityType: 'PERMANENT',
        isMin40PercentPwD: 'YES',
        disabilityCertNo: 'PW-DISABILITY-001',
        disabilityIssueDate: { day: '10', month: '6', year: '2023' },
        disabilityAuthority: 'Civil Surgeon/Chief Medical Officer',
        isScribeRequired: 'YES',
        ownScribeRequired: 'YES',
      },
      service: {
        isExServiceman: 'NO',
        isBiharGovtEmployee: 'YES',
        bsscAttempts: '2',
        isContractualEmployee: 'YES',
        organizationName: 'Bihar Test Department',
        nameOfPost: 'Assistant section officer',
        contractualFromDate: { day: '01', month: '01', year: '2022' },
        contractualToDate: { day: '31', month: '12', year: '2025' },
        experienceCertificateFileName: 'mock-experience-certificate.pdf',
        hasAgreement: 'YES',
        agreementCopyFileName: 'mock-agreement-copy.pdf',
      },
    };
  }

  /**
   * Creates a default valid registration data object (UR category, Bihar domicile)
   */
  public static getValidURCandidate(): RegistrationFormData {
    const mobile = this.generateMobileNumber();
    const email = this.generateEmail('ur_cand');

    return {
      personal: {
        applicantName: 'Anil KUMAR Singh',
        gender: 'MALE',
        isBiharDomicile: 'YES',
        dob: {
          day: '15',
          month: '08',
          year: '1996'
        }
      },
      category: {
        category: 'UR',
        isPwD: 'NO',
        hasUrduInIntermediate: 'NO'
      },
      service: {
        isExServiceman: 'NO',
        isBiharGovtEmployee: 'NO',
        isContractualEmployee: 'NO'
      },
      contact: {
        mobileNo: mobile,
        confirmMobileNo: mobile,
        emailId: email,
        confirmEmailId: email,
        password: 'Password@123',
        confirmPassword: 'Password@123'
      }
    };
  }

  /**
   * Creates a valid candidate with Non-Bihar Domicile (General post)
   */
  public static getValidNonBiharCandidate(): RegistrationFormData {
    const mobile = this.generateMobileNumber();
    const email = this.generateEmail('nonbihar_cand');

    return {
      personal: {
        applicantName: 'PRIYA SINGH',
        gender: 'FEMALE',
        isBiharDomicile: 'NO',
        dob: {
          day: '10',
          month: '05',
          year: '1998'
        }
      },
      category: {
        category: 'UR',
        isPwD: 'NO',
        hasUrduInIntermediate: 'YES'
      },
      service: {
        isExServiceman: 'NO',
        isBiharGovtEmployee: 'NO',
        isContractualEmployee: 'NO'
      },
      contact: {
        mobileNo: mobile,
        confirmMobileNo: mobile,
        emailId: email,
        confirmEmailId: email,
        password: 'Password@123',
        confirmPassword: 'Password@123'
      }
    };
  }
}
