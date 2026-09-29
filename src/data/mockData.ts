import { RegistrationFormData } from './registrationTypes';

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
    return `${prefix}_${timestamp}_${random}@example.com`;
  }

  /**
   * Creates a default valid registration data object (UR category, Bihar domicile)
   */
  public static getValidURCandidate(): RegistrationFormData {
    const mobile = this.generateMobileNumber();
    const email = this.generateEmail('ur_cand');

    return {
      personal: {
        applicantName: 'RAMESH KUMAR SHARMA',
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
