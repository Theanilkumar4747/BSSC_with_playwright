import { test, expect } from '../src/fixtures/testFixtures';
import {
  AGE_LIMIT_SCENARIOS,
  AGE_TEST_DATA,
  DISABILITY_SERVICE_COMBINATIONS,
  getDateOfBirthForAge,
} from '../src/data/mockData';
import type { Category, DateOfBirth, Gender, YesNo } from '../src/data/registrationTypes';
import type { RegistrationPage } from '../src/pages/RegistrationPage';

async function setDateOfBirth(
  registrationPage: RegistrationPage,
  dob: DateOfBirth,
): Promise<void> {
  await registrationPage.selectDropdownOption(registrationPage.dobDaySelect, dob.day, 'date of birth day');
  await registrationPage.selectDropdownOption(registrationPage.dobMonthSelect, dob.month, 'date of birth month');
  await registrationPage.selectDropdownOption(registrationPage.dobYearSelect, dob.year, 'date of birth year');
}

async function setAgeProfile(
  registrationPage: RegistrationPage,
  profile: {
    category: Category;
    gender: Gender;
    dob: DateOfBirth;
    isPwD?: YesNo;
    isMin40PercentPwD?: YesNo;
    isExServiceman?: YesNo;
  },
): Promise<void> {
  if (profile.isExServiceman === AGE_TEST_DATA.answers.yes) {
    await registrationPage.fillServiceDetails({
      isExServiceman: AGE_TEST_DATA.answers.yes,
      isBiharGovtEmployee: AGE_TEST_DATA.answers.no,
      isContractualEmployee: AGE_TEST_DATA.answers.no,
    });
  }

  const categoryDetails = {
    category: profile.category,
    isPwD: profile.isPwD ?? AGE_TEST_DATA.answers.no,
    isMin40PercentPwD: profile.isMin40PercentPwD,
  };
  if (profile.gender === 'TRANSGENDER') {
    await registrationPage.fillCategoryDetails(categoryDetails);
  }

  await registrationPage.fillPersonalDetails({
    applicantName: AGE_TEST_DATA.profile.applicantName,
    gender: profile.gender,
    isBiharDomicile: AGE_TEST_DATA.profile.isBiharDomicile,
    dob: profile.dob,
  });
  if (profile.gender !== 'TRANSGENDER') {
    await registrationPage.fillCategoryDetails(categoryDetails);
  } else {
    await expect(registrationPage.categorySelect.first()).toHaveValue(/Backward Class/);
  }
}

test.describe(`Registration age eligibility as of ${AGE_TEST_DATA.referenceDateLabel}`, () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.goto();
  });

  for (const scenario of AGE_LIMIT_SCENARIOS) {
    test(`${scenario.category} ${scenario.gender}: inclusive maximum age ${scenario.maxAge}`, async ({ registrationPage }) => {
      await setAgeProfile(registrationPage, {
        category: scenario.category,
        gender: scenario.gender,
        dob: getDateOfBirthForAge(scenario.maxAge),
      });
      await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.eligible);
      await setDateOfBirth(registrationPage, getDateOfBirthForAge(scenario.maxAge + 1));
      await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.ineligible);
      await expect(registrationPage.page.getByText(
        new RegExp(`${AGE_TEST_DATA.maximumAgeExceededMessagePrefix} ${scenario.maxAge} years`),
      )).toBeVisible();
    });
  }

  for (const combo of DISABILITY_SERVICE_COMBINATIONS) {
    test(`age 38 eligibility for PwD=${combo.isPwD}, 40% disability=${combo.isMin40PercentPwD}, ex-serviceman=${combo.isExServiceman}`, async ({ registrationPage }) => {
      await setAgeProfile(registrationPage, {
        category: AGE_TEST_DATA.profile.category,
        gender: AGE_TEST_DATA.profile.gender,
        dob: getDateOfBirthForAge(AGE_TEST_DATA.ages.noDisabilityRelaxation),
        isPwD: combo.isPwD,
        isMin40PercentPwD: combo.isMin40PercentPwD,
        isExServiceman: combo.isExServiceman,
      });
      await expect(registrationPage.ageEligibilityStatus).toHaveText(
        combo.eligibleAtAge38 ? AGE_TEST_DATA.status.eligible : AGE_TEST_DATA.status.ineligible,
      );
    });
  }

  test('rejects candidates below 18 and accepts age 18 on the cutoff date', async ({ registrationPage }) => {
    await setAgeProfile(registrationPage, {
      category: AGE_TEST_DATA.profile.category,
      gender: AGE_TEST_DATA.profile.gender,
      dob: getDateOfBirthForAge(AGE_TEST_DATA.ages.belowMinimum),
    });
    await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.ineligible);
    await expect(registrationPage.page.getByText(AGE_TEST_DATA.minimumAgeMessage)).toBeVisible();
    await setDateOfBirth(registrationPage, getDateOfBirthForAge(AGE_TEST_DATA.ages.minimum));
    await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.eligible);
  });

  test('uses the exact birthday against the age cutoff date', async ({ registrationPage }) => {
    await setAgeProfile(registrationPage, {
      category: AGE_TEST_DATA.profile.category,
      gender: AGE_TEST_DATA.profile.gender,
      dob: getDateOfBirthForAge(AGE_TEST_DATA.ages.minimum, AGE_TEST_DATA.birthday.dayBeforeCutoff),
    });
    await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.ineligible);
    await setDateOfBirth(
      registrationPage,
      getDateOfBirthForAge(AGE_TEST_DATA.ages.minimum, AGE_TEST_DATA.birthday.cutoffDay),
    );
    await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.eligible);
  });

  test('applies disability relaxation only when the candidate meets the 40% threshold', async ({ registrationPage }) => {
    await setAgeProfile(registrationPage, {
      category: AGE_TEST_DATA.profile.category,
      gender: AGE_TEST_DATA.profile.gender,
      dob: getDateOfBirthForAge(AGE_TEST_DATA.ages.disabilityMaximum),
      isPwD: AGE_TEST_DATA.answers.yes,
      isMin40PercentPwD: AGE_TEST_DATA.answers.yes,
    });

    await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.eligible);
    await setDateOfBirth(
      registrationPage,
      getDateOfBirthForAge(AGE_TEST_DATA.ages.disabilityMaximum + 1),
    );
    await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.ineligible);
    await expect(registrationPage.page.getByText(
      new RegExp(`maximum age limit of ${AGE_TEST_DATA.ages.disabilityMaximum} years`),
    )).toBeVisible();
    await setDateOfBirth(
      registrationPage,
      getDateOfBirthForAge(AGE_TEST_DATA.ages.noDisabilityRelaxation),
    );
    await registrationPage.selectRadioByValue('isMin40PercentPwD', AGE_TEST_DATA.answers.no);
    await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.ineligible);
    await expect(registrationPage.page.getByText(
      AGE_TEST_DATA.maximumAgeMessage(AGE_TEST_DATA.ages.urMaleMaximumWithoutRelaxation),
    )).toBeVisible();
  });

  test('applies ex-serviceman relaxation and does not stack it with disability relaxation', async ({ registrationPage }) => {
    await setAgeProfile(registrationPage, {
      category: AGE_TEST_DATA.profile.category,
      gender: AGE_TEST_DATA.profile.gender,
      dob: getDateOfBirthForAge(AGE_TEST_DATA.ages.exServicemanMaximum),
      isExServiceman: AGE_TEST_DATA.answers.yes,
    });
    await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.eligible);
    await setDateOfBirth(
      registrationPage,
      getDateOfBirthForAge(AGE_TEST_DATA.ages.exServicemanMaximum + 1),
    );
    await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.ineligible);
    await expect(registrationPage.page.getByText(
      AGE_TEST_DATA.maximumAgeMessage(AGE_TEST_DATA.ages.exServicemanMaximum),
    )).toBeVisible();
    await registrationPage.selectRadioByValue('isPwD', AGE_TEST_DATA.answers.yes);
    await registrationPage.selectRadioByValue('isMin40PercentPwD', AGE_TEST_DATA.answers.yes);
    await setDateOfBirth(
      registrationPage,
      getDateOfBirthForAge(AGE_TEST_DATA.ages.disabilityMaximum),
    );
    await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.eligible);
    await setDateOfBirth(registrationPage,getDateOfBirthForAge(AGE_TEST_DATA.ages.disabilityMaximum + 1), );
    await expect(registrationPage.ageEligibilityStatus).toHaveText(AGE_TEST_DATA.status.ineligible);
    await expect(registrationPage.page.getByText(
      AGE_TEST_DATA.maximumAgeMessage(AGE_TEST_DATA.ages.disabilityMaximum),
    )).toBeVisible();
  });
});
