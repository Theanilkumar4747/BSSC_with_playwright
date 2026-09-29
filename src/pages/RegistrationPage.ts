import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ActionLogger } from '../fixtures/actionLogger';
import { RegistrationFormData, Gender, YesNo, Category, DateOfBirth } from '../data/registrationTypes';

/**
 * Page Object Model representing the BSSC Candidate Registration Page (/register).
 */
export class RegistrationPage extends BasePage {
  // --- Page Headers & Sections ---
  readonly pageHeading: Locator;
  readonly subHeading: Locator;
  readonly sectionTabs: Locator;

  // --- Section 1: Personal & Identity ---
  readonly applicantNameInput: Locator;
  readonly genderOptions: Locator;
  readonly domicileOptions: Locator;
  readonly dobDaySelect: Locator;
  readonly dobMonthSelect: Locator;
  readonly dobYearSelect: Locator;

  // --- Section 2: Category & Reservation ---
  readonly categorySelect: Locator;
  readonly casteSelect: Locator;
  readonly categoryCertNoInput: Locator;
  readonly nonCreamyLayerOptions: Locator;
  readonly pwdOptions: Locator;
  readonly min40PercentPwdOptions: Locator;
  readonly urduQualificationOptions: Locator;

  // --- Section 3: Service & Employment ---
  readonly exServicemanOptions: Locator;
  readonly biharGovtEmployeeOptions: Locator;
  readonly bsscAttemptsInput: Locator;
  readonly contractualEmployeeOptions: Locator;
  readonly organizationNameInput: Locator;
  readonly nameOfPostInput: Locator;

  // --- Section 4: Contact & Verification ---
  readonly mobileNumberInput: Locator;
  readonly confirmMobileNumberInput: Locator;
  readonly emailIdInput: Locator;
  readonly confirmEmailIdInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly captchaInput: Locator;
  readonly captchaImage: Locator;
  readonly refreshCaptchaButton: Locator;

  // --- Action Buttons & Status ---
  readonly submitButton: Locator;
  readonly validationErrorList: Locator;
  readonly successDialog: Locator;
  readonly goToLoginButton: Locator;

  constructor(page: Page, actionLogger?: ActionLogger) {
    super(page, actionLogger);

    // Header & Section navigation
    this.pageHeading = page.getByText('Candidate Registration').first();
    this.subHeading = page.getByText('BIHAR STAFF SELECTION COMMISSION').first();
    this.sectionTabs = page.locator('button:has-text("Personal & Identity"), button:has-text("Category & Reservation")');

    // Section 1: Personal
    this.applicantNameInput = page.locator('input[name="applicantName"]').or(page.getByPlaceholder('AS PER MATRICULATION CERTIFICATE'));
    this.genderOptions = page.locator('label:has(input[name="gender"])');
    this.domicileOptions = page.locator('label:has(input[name="isBiharDomicile"])');
    this.dobDaySelect = page.locator('select[name="dobDay"]');
    this.dobMonthSelect = page.locator('select[name="dobMonth"]');
    this.dobYearSelect = page.locator('select[name="dobYear"]');

    // Section 2: Category
    this.categorySelect = page.locator('select[name="category"], select[name="categoryId"], select:has(option[value="UR"])').or(page.locator('select').filter({ hasText: 'Select category' }));
    this.casteSelect = page.locator('select[name="caste"], select[name="casteId"]');
    this.categoryCertNoInput = page.locator('input[name="categoryCertNo"]');
    this.nonCreamyLayerOptions = page.locator('label:has(input[name="isNonCreamyLayer"])');
    this.pwdOptions = page.locator('label:has(input[name="isPwD"])');
    this.min40PercentPwdOptions = page.locator('label:has(input[name="isMin40PercentPwD"])');
    this.urduQualificationOptions = page.locator('label:has(input[name="hasUrduInIntermediate"])');

    // Section 3: Service
    this.exServicemanOptions = page.locator('label:has(input[name="isExServiceman"])');
    this.biharGovtEmployeeOptions = page.locator('label:has(input[name="isBiharGovtEmployee"])');
    this.bsscAttemptsInput = page.locator('input[name="bsscAttempts"], select[name="bsscAttempts"]');
    this.contractualEmployeeOptions = page.locator('label:has(input[name="isContractualEmployee"])');
    this.organizationNameInput = page.locator('input[name="organizationName"]');
    this.nameOfPostInput = page.locator('input[name="nameOfPost"]');

    // Section 4: Contact
    this.mobileNumberInput = page.locator('input[name="mobileNo"]').or(page.getByPlaceholder('10 digit mobile number'));
    this.confirmMobileNumberInput = page.locator('input[name="confirmMobileNo"]').or(page.getByPlaceholder('Re-enter mobile number'));
    this.emailIdInput = page.locator('input[name="emailId"]').or(page.getByPlaceholder('name@example.com'));
    this.confirmEmailIdInput = page.locator('input[name="confirmEmailId"]').or(page.getByPlaceholder('Re-enter email'));
    this.passwordInput = page.locator('input[name="password"]').or(page.getByPlaceholder('Create a password'));
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"]').or(page.getByPlaceholder('Re-enter password'));
    this.captchaInput = page.locator('input[name="captchaInput"]').or(page.getByPlaceholder('Type the code above'));
    this.captchaImage = page.locator('svg, .captcha-container, div[dangerouslysetinnerhtml]').first();
    this.refreshCaptchaButton = page.getByRole('button', { name: 'REFRESH' }).or(page.locator('button:has-text("Refresh")')).first();

    // Submit & Feedback
    this.submitButton = page.getByRole('button', { name: 'VERIFY EMAIL' }).or(page.locator('button:has-text("Submit"), button:has-text("Validate & Proceed")')).first();
    this.validationErrorList = page.locator('.Toastify__toast-body, [role="alert"], [style*="color: rgb(179, 67, 43)"], .rf-error-msg, .rf-error');
    this.successDialog = page.locator('text=Registration successful, text=Registration completed').first();
    this.goToLoginButton = page.locator('button:has-text("Go to login now"), a[href="/login"]');
  }

  /**
   * Navigates to the Registration page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/register');
  }

  /**
   * Fills Section 1: Personal & Identity Details
   */
  async fillPersonalDetails(details: {
    applicantName: string;
    gender: Gender;
    isBiharDomicile: YesNo;
    dob: DateOfBirth;
  }): Promise<void> {
    await this.action('Fill personal and identity details', async () => {
      await this.fillInput(this.applicantNameInput, details.applicantName, 'applicant name');
      await this.selectRadioByValue('gender', details.gender);
      await this.selectRadioByValue('isBiharDomicile', details.isBiharDomicile);
      await this.selectDropdownOption(this.dobDaySelect, details.dob.day, 'date of birth day');
      await this.selectDropdownOption(this.dobMonthSelect, details.dob.month, 'date of birth month');
      await this.selectDropdownOption(this.dobYearSelect, details.dob.year, 'date of birth year');
    });
  }

  /**
   * Fills Section 2: Category & Reservation Details
   */
  async fillCategoryDetails(details: {
    category: Category;
    caste?: string;
    isNonCreamyLayer?: YesNo;
    isPwD: YesNo;
    hasUrduInIntermediate?: YesNo;
  }): Promise<void> {
    await this.action('Fill category and reservation details', async () => {
      const catSelect = this.categorySelect.first();
      if (await catSelect.isVisible()) {
      const categoryKeywordMap: Record<Category, string> = {
        UR: 'Unreserved',
        EWS: 'Economically Weaker',
        BC: 'Backward Class (Annexure-2)',
        EBC: 'Extremely Backward',
        SC: 'Scheduled Caste',
        ST: 'Scheduled Tribe'
      };
        await this.selectDropdownOption(catSelect, categoryKeywordMap[details.category] || details.category, 'category');
      } else {
        await this.selectRadioByValue('category', details.category);
      }

      if (details.caste && await this.casteSelect.isVisible()) {
        await this.selectDropdownOption(this.casteSelect, details.caste, 'caste');
      }

      if (details.isNonCreamyLayer && await this.nonCreamyLayerOptions.first().isVisible()) {
        await this.selectRadioByValue('isNonCreamyLayer', details.isNonCreamyLayer);
      }

      await this.selectRadioByValue('isPwD', details.isPwD);

      if (details.hasUrduInIntermediate) {
        await this.selectRadioByValue('hasUrduInIntermediate', details.hasUrduInIntermediate);
      }
    });
  }

  /**
   * Fills Section 3: Service & Employment Details
   */
  async fillServiceDetails(details: {
    isExServiceman: YesNo;
    isBiharGovtEmployee: YesNo;
    bsscAttempts?: string;
    isContractualEmployee: YesNo;
  }): Promise<void> {
    await this.action('Fill service and employment details', async () => {
      await this.selectRadioByValue('isExServiceman', details.isExServiceman);
      await this.selectRadioByValue('isBiharGovtEmployee', details.isBiharGovtEmployee);

      if (details.isBiharGovtEmployee === 'YES' && details.bsscAttempts && await this.bsscAttemptsInput.isVisible()) {
        await this.fillInput(this.bsscAttemptsInput, details.bsscAttempts, 'BSSC attempts');
      }

      await this.selectRadioByValue('isContractualEmployee', details.isContractualEmployee);
    });
  }

  /**
   * Fills Section 4: Contact & Verification Details
   */
  async fillContactDetails(details: {
    mobileNo: string;
    confirmMobileNo: string;
    emailId: string;
    confirmEmailId: string;
    password?: string;
    confirmPassword?: string;
    captcha?: string;
  }): Promise<void> {
    await this.action('Fill contact and verification details', async () => {
      await this.fillInput(this.mobileNumberInput, details.mobileNo, 'mobile number');
      await this.fillInput(this.confirmMobileNumberInput, details.confirmMobileNo, 'confirm mobile number');
      await this.fillInput(this.emailIdInput, details.emailId, 'email address');
      await this.fillInput(this.confirmEmailIdInput, details.confirmEmailId, 'confirm email address');

      if (details.password && await this.passwordInput.isVisible()) {
        await this.fillInput(this.passwordInput, details.password, 'password');
      }
      if (details.confirmPassword && await this.confirmPasswordInput.isVisible()) {
        await this.fillInput(this.confirmPasswordInput, details.confirmPassword, 'confirm password');
      }
      if (details.captcha && await this.captchaInput.isVisible()) {
        await this.fillInput(this.captchaInput, details.captcha, 'CAPTCHA');
      }
    });
  }

  /**
   * Fills the entire registration form with structured data
   */
  async fillRegistrationForm(data: RegistrationFormData): Promise<void> {
    await this.action('Fill complete registration form', async () => {
      await this.fillPersonalDetails(data.personal);
      await this.fillCategoryDetails(data.category);
      await this.fillServiceDetails(data.service);
      await this.fillContactDetails(data.contact);
    });
  }

  /**
   * Submits the registration form
   */
  async submitForm(): Promise<void> {
    await this.action('Submit registration form', async () => {
      if (await this.submitButton.isVisible()) {
        await this.submitButton.click({ force: true }).catch(() => {});
      }
    });
  }

  /**
   * Refreshes the CAPTCHA code
   */
  async refreshCaptcha(): Promise<void> {
    await this.action('Refresh CAPTCHA', async () => {
      if (await this.refreshCaptchaButton.isVisible()) {
        await this.refreshCaptchaButton.click();
      }
    });
  }

  /**
   * Collects all validation error text messages currently displayed on the page
   */
  async getValidationErrors(): Promise<string[]> {
    return this.action('Read validation messages', async () => {
      const errorLocators = await this.validationErrorList.all();
      const errorTexts: string[] = [];
      for (const loc of errorLocators) {
        const text = await loc.textContent();
        if (text && text.trim().length > 0) {
          errorTexts.push(text.trim());
        }
      }
      return errorTexts;
    });
  }
}
