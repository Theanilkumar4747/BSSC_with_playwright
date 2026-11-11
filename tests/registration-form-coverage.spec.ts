import { test, expect } from '../src/fixtures/testFixtures';
import { TestDataGenerator } from '../src/data/mockData';

test('fills the complete candidate, disability, and service scenario without submitting', async ({
  registrationPage,
}) => {
  const candidate = TestDataGenerator.getRegistrationCoverageCandidate();

  await registrationPage.goto();
  await registrationPage.fillCandidateExamForm(candidate);
  await expect(registrationPage.applicantNameInput).toHaveValue(candidate.personal.applicantName);
  await expect(registrationPage.page.locator(`input[name="gender"][value="${candidate.personal.gender}"]`, )).toBeChecked();
  await expect(registrationPage.page.locator(`input[name="isBiharDomicile"][value="${candidate.personal.isBiharDomicile}"]`,)).toBeChecked();
  await expect(registrationPage.dobDaySelect).toHaveValue(String(Number(candidate.personal.dob.day)));
  await expect(registrationPage.dobMonthSelect).toHaveValue(String(Number(candidate.personal.dob.month)));
  await expect(registrationPage.dobYearSelect).toHaveValue(candidate.personal.dob.year);
  await expect(registrationPage.categorySelect.first()).toHaveValue(/Backward Class/);
  await expect(registrationPage.page.locator('.rf-select').filter({ hasText: candidate.category.caste! })).toBeVisible();
  await expect(registrationPage.page.locator('input[name="isPwD"][value="YES"]')).toBeChecked();
  await expect(registrationPage.disabilityTypeSelect).toHaveValue(candidate.category.natureOfDisability!);
  await expect(registrationPage.page.locator(`input[name="natureOfDisabilityType"][value="${candidate.category.natureOfDisabilityType}"]`,)).toBeChecked();
  await expect(registrationPage.page.locator('input[name="isMin40PercentPwD"][value="YES"]')).toBeChecked();
  await expect(registrationPage.disabilityCertNoInput).toHaveValue(candidate.category.disabilityCertNo!);
  await expect(registrationPage.disabilityIssueDateSelects.nth(0)).toHaveValue(candidate.category.disabilityIssueDate!.day);
  await expect(registrationPage.disabilityIssueDateSelects.nth(1)).toHaveValue(candidate.category.disabilityIssueDate!.month);
  await expect(registrationPage.disabilityIssueDateSelects.nth(2)).toHaveValue(candidate.category.disabilityIssueDate!.year);
  await expect(registrationPage.disabilityAuthoritySelect).toHaveValue(candidate.category.disabilityAuthority!);
  await expect(registrationPage.page.locator('input[name="isScribeRequired"][value="YES"]')).toBeChecked();
  await expect(registrationPage.page.locator('input[name="ownScribeRequired"][value="YES"]')).toBeChecked();
  await expect(registrationPage.page.locator('input[name="isBiharGovtEmployee"][value="YES"]')).toBeChecked();
  await expect(registrationPage.bsscAttemptsInput).toHaveValue(candidate.service.bsscAttempts!);
  await expect(registrationPage.page.locator('input[name="isContractualEmployee"][value="YES"]')).toBeChecked();
  await expect(registrationPage.organizationNameInput).toHaveValue(candidate.service.organizationName!);
  await expect(registrationPage.nameOfPostInput).toHaveValue(candidate.service.nameOfPost!);
  await expect(registrationPage.contractualPeriodFromDateSelects.nth(0)).toHaveValue(String(Number(candidate.service.contractualFromDate!.day)));
  await expect(registrationPage.contractualPeriodFromDateSelects.nth(1)).toHaveValue(String(Number(candidate.service.contractualFromDate!.month)));
  await expect(registrationPage.contractualPeriodFromDateSelects.nth(2)).toHaveValue(candidate.service.contractualFromDate!.year);
  await expect(registrationPage.contractualPeriodToDateSelects.nth(0)).toHaveValue(String(Number(candidate.service.contractualToDate!.day)));
  await expect(registrationPage.contractualPeriodToDateSelects.nth(1)).toHaveValue(String(Number(candidate.service.contractualToDate!.month)));
  await expect(registrationPage.contractualPeriodToDateSelects.nth(2)).toHaveValue(candidate.service.contractualToDate!.year);
  await expect(registrationPage.page.locator('input[name="hasAgreement"][value="YES"]')).toBeChecked();
  expect(await registrationPage.experienceCertificateFileInput.evaluate(
    input => (input as HTMLInputElement).files?.[0]?.name,
  )).toBe(candidate.service.experienceCertificateFileName);
  expect(await registrationPage.agreementCopyFileInput.evaluate(input => (input as HTMLInputElement).files?.[0]?.name,)).toBe(candidate.service.agreementCopyFileName);
  await expect(registrationPage.emailIdInput).toHaveValue(candidate.contact.emailId);
  await expect(registrationPage.confirmEmailIdInput).toHaveValue(candidate.contact.confirmEmailId);
  await expect(registrationPage.passwordInput).toHaveValue(candidate.contact.password!);
  await expect(registrationPage.confirmPasswordInput).toHaveValue(candidate.contact.confirmPassword!);
  await expect(registrationPage.mobileNumberInput).toHaveValue(candidate.contact.mobileNo);
  await expect(registrationPage.confirmMobileNumberInput).toHaveValue(candidate.contact.confirmMobileNo);
  //await new Promise(resolve => setTimeout(resolve, 20000));
  
});
