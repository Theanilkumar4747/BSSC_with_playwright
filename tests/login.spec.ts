import { test, expect } from '../src/fixtures/testFixtures';
test.describe('BSSC Candidate Login & Portal Tests', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC_LOG_01: Should display login page layout and sidebars correctly', async ({ loginPage }) => {
    // Left Links Sidebar
    await expect(loginPage.linksCard).toBeVisible();
    await expect(loginPage.advertisementLink.first()).toBeVisible();
    await expect(loginPage.photoInstructionsLink.first()).toBeVisible();
    await expect(loginPage.howToApplyLink.first()).toBeVisible();
    // Right Online Services Sidebar
    await expect(loginPage.onlineServicesCard).toBeVisible();
    await expect(loginPage.registerLink.first()).toBeVisible();
    await expect(loginPage.forgotRegistrationLink.first()).toBeVisible();
    await expect(loginPage.loginFrameElement).toBeVisible();
  });

  test('TC_LOG_02: Should navigate from Login page to Registration page via Online Services', async ({ loginPage, page }) => {
    await loginPage.clickRegisterLink();
    await expect(page).toHaveURL(/.*register.*/);
  });

  test('TC_LOG_03: Should navigate to Advertisement and Instructions links', async ({ loginPage, page }) => {
    // Click on How to Apply link
    await loginPage.clickHowToApplyLink();
    await expect(page).toHaveURL(/.*how-to-apply.*/);
    await loginPage.goto();
    await loginPage.clickPhotoInstructionsLink();
    await expect(page).toHaveURL(/.*instructions.*/);
  });

  test('TC_LOG_04: Should render Zitadel OAuth login frame', async ({ loginPage }) => {
    const frameElement = loginPage.loginFrameElement;
    await expect(frameElement).toBeVisible();
    const src = await frameElement.getAttribute('src');
    expect(src).toContain('zitadel.vensysco.in');
  });
  test('TC_LOG_05: Should submit the login form with credentials', async ({ loginPage, page }) => {
    await loginPage.login('testuser', 'testpassword');
    await expect(page).toHaveURL(/.*dashboard.*/);
  });

  test('TC_LOG_06: Should display and accept input on the Forgot Registration form', async ({ loginPage, page }) => {
    const email = 'testuser@yopmail.com';
    await loginPage.openForgotRegistration();
    await expect(page).toHaveURL(/.*forgot-registration.*/);
    await expect(loginPage.forgotRegistrationHeading).toBeVisible();
    await expect(loginPage.forgotRegEmailTextBox).toBeVisible();
    await expect(loginPage.forgotRegCaptchaTextBox).toBeVisible();
    await expect(loginPage.forgotRegSubmitButton).toBeVisible();
    await loginPage.fillForgotRegistrationEmail(email);
    await expect(loginPage.forgotRegEmailTextBox).toHaveValue(email);
  });
  
});
