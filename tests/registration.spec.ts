import { test, expect } from '../src/fixtures/testFixtures';
import {
  AGE_REFERENCE_DATE,
  AGE_TEST_DATA,
  AGE_VALIDATION_SCENARIOS,
  AgeValidationService,
  TestDataGenerator,
} from '../src/data/mockData';

test.describe('BSSC Candidate Registration Tests', () => {

  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.goto();
  });

  test('TC_REG_01: Should display all registration sections and headers correctly', async ({ registrationPage }) => {
    // Verify page headers
    await expect(registrationPage.pageHeading).toBeVisible();
    await expect(registrationPage.subHeading).toBeVisible();

    // Verify key form input fields are present
    await expect(registrationPage.applicantNameInput).toBeVisible();
    await expect(registrationPage.genderOptions.first()).toBeVisible();
    await expect(registrationPage.domicileOptions.first()).toBeVisible();
    await expect(registrationPage.dobDaySelect).toBeVisible();
    await expect(registrationPage.dobMonthSelect).toBeVisible();
    await expect(registrationPage.dobYearSelect).toBeVisible();

    // Verify Contact fields
    await expect(registrationPage.mobileNumberInput).toBeVisible();
    await expect(registrationPage.confirmMobileNumberInput).toBeVisible();
    await expect(registrationPage.emailIdInput).toBeVisible();
    await expect(registrationPage.confirmEmailIdInput).toBeVisible();

    // Verify Submit button
    await expect(registrationPage.submitButton).toBeVisible();
  });

  test('TC_REG_02: Should validate mandatory fields when submitting an empty form', async ({ registrationPage }) => {
    // Attempt submitting the empty form
    await registrationPage.submitForm();

    // Assert validation errors appear
    const errors = await registrationPage.getValidationErrors();
    expect(errors.length).toBeGreaterThan(0);
  });

  test('TC_REG_03: Should fill complete registration form for UR Bihar candidate', async ({ registrationPage }) => {
    const candidateData = TestDataGenerator.getValidURCandidate();

    // Fill all form sections
    await registrationPage.fillRegistrationForm(candidateData);
    // Verify filled values
    await expect(registrationPage.applicantNameInput).toHaveValue(candidateData.personal.applicantName);
    await expect(registrationPage.mobileNumberInput).toHaveValue(candidateData.contact.mobileNo);
    await expect(registrationPage.emailIdInput).toHaveValue(candidateData.contact.emailId);
  });

  test('TC_REG_04: Should validate mobile number and confirm mobile number match', async ({ registrationPage }) => {
    const candidate = TestDataGenerator.getCandidateWithMismatchedMobileNumbers();
    await registrationPage.fillPersonalDetails(candidate.personal);
    await registrationPage.fillCategoryDetails(candidate.category);
    await registrationPage.fillServiceDetails(candidate.service);
    await registrationPage.fillContactDetails(candidate.contact);
    await registrationPage.confirmMobileNumberInput.blur();
    await registrationPage.submitForm();
    // Check for mismatch or validation errors or disabled verification button
    const errors = await registrationPage.getValidationErrors();
    const isButtonDisabled = await registrationPage.submitButton.isDisabled();
    expect(errors.length > 0 || isButtonDisabled).toBeTruthy();
  });


  test('TC_REG_05: Should allow refreshing CAPTCHA image', async ({ registrationPage }) => {
    await expect(registrationPage.captchaInput).toBeVisible();
    await expect(registrationPage.refreshCaptchaButton).toBeVisible();
    // Click refresh CAPTCHA button
    await registrationPage.refreshCaptcha();
    await expect(registrationPage.captchaInput).toBeVisible();
  });

});

test.describe(`Age eligibility scenarios as of ${AGE_TEST_DATA.referenceDateLabel}`, () => {
  for (const scenario of AGE_VALIDATION_SCENARIOS) {
    test(`TC_REG_06: ${scenario.name}`, () => {
      const result = AgeValidationService.validateAge({
        dob: scenario.dob,
        gender: scenario.gender,
        category: scenario.category,
        isPwD: scenario.isPwD,
        isMin40PercentPwD: scenario.isMin40PercentPwD,
        isExServiceman: scenario.isExServiceman,
        referenceDate: AGE_REFERENCE_DATE,
      });
      expect(result.isValid, result.reason).toBe(scenario.expected);
    });
  }
});
