import { Page, Locator, FrameLocator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ActionLogger } from '../fixtures/actionLogger';

/**
 * Page Object Model representing the BSSC Candidate Login Page (/login).
 */
export class LoginPage extends BasePage {
  // --- Sidebar Links (Left Column) ---
  readonly linksCard: Locator;
  readonly advertisementLink: Locator;
  readonly photoInstructionsLink: Locator;
  readonly howToApplyLink: Locator;

  // --- Online Services (Right Column) ---
  readonly onlineServicesCard: Locator;
  readonly registerLink: Locator;
  readonly forgotRegistrationLink: Locator;

  // --- Center: Candidate Login & Iframe ---
  readonly loginFrameLocator: FrameLocator;
  readonly loginFrameElement: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly forgotRegistrationHeading: Locator;
  readonly forgotRegEmailTextBox: Locator;
  readonly forgotRegCaptchaTextBox: Locator;
  readonly forgotRegSubmitButton: Locator;
  readonly forgotPasswordHeading: Locator;
  readonly forgotRegErrorToast: Locator;




  constructor(page: Page, actionLogger?: ActionLogger) {
    super(page, actionLogger);

    // Left Sidebar: Links
    this.linksCard = page.getByText('Links').first();
    this.advertisementLink = page.locator('a[href="/advertisement"]').or(page.getByText('Click Here To View Advertisement'));
    this.photoInstructionsLink = page.locator('a[href="/instructions"]').or(page.getByText('Important Instructions for Live Photo Upload'));
    this.howToApplyLink = page.locator('a[href="/how-to-apply"]').or(page.getByText('How To Apply'));

    // Right Sidebar: Online Services
    this.onlineServicesCard = page.getByText('Online Services').first();
    this.registerLink = page.locator('a[href="/register"]').or(page.getByText('Registration'));
    this.forgotRegistrationLink = page.locator('a[href="/forgot-registration"]').or(page.getByText('Forgot Your Registration Number'));

    // Center Frame: Zitadel Candidate Login
    this.loginFrameElement = page.locator('iframe[title="Candidate Login"]');
    this.loginFrameLocator = page.frameLocator('iframe[title="Candidate Login"]');

    // Frame inputs (inside iframe or fallback direct form)
    this.usernameInput = this.loginFrameLocator.locator('input[name="loginName"], input[name="username"], input[type="text"], input[name="email"]');
    this.passwordInput = this.loginFrameLocator.locator('input[name="password"], input[type="password"]');
    this.loginSubmitButton = this.loginFrameLocator.locator('button[type="submit"], button:has-text("Next"), button:has-text("Sign In"), button:has-text("Login")');
    this.forgotPasswordLink = this.loginFrameLocator.locator('a:has-text("Forgot password"), a:has-text("Reset password")');
    this.forgotRegistrationHeading = page.getByRole('heading', { name: 'Forgot Registration Number' });
    this.forgotRegEmailTextBox = page.getByRole('textbox', { name: 'Enter your registered email' });
    this.forgotRegCaptchaTextBox = page.getByRole('textbox', { name: 'Enter CAPTCHA code' });
    this.forgotRegSubmitButton = page.getByRole('button', { name: 'Submit', exact: true });
    this.forgotPasswordHeading = page.getByRole('heading', { name: 'Forgot Password' });
    this.forgotRegErrorToast = page.locator("//div[@role='alert' and contains(., 'No candidate profile or registration number found for this email address.')]");
    
  }


  async goto(): Promise<void> {
    await this.navigateTo('/login');
  }
  async clickRegisterLink(): Promise<void> {
    await this.action('Click Registration link', () => this.registerLink.first().click());
  }
  async clickAdvertisementLink(): Promise<void> {
    await this.action('Click Advertisement link', () => this.advertisementLink.first().click());
  }
  async clickPhotoInstructionsLink(): Promise<void> {
    await this.action('Click Photo Instructions link', () => this.photoInstructionsLink.first().click());
  }
  async clickHowToApplyLink(): Promise<void> {
    await this.action('Click How To Apply link', () => this.howToApplyLink.first().click());
  }
  async clickForgotRegistrationLink(): Promise<void> {
    await this.action('Click Forgot Registration link', () => this.forgotRegistrationLink.first().click());
  }

  async login(username: string, password?: string): Promise<void> {
      await this.action('Log in through candidate frame', async () => {
      await this.loginFrameElement.waitFor({ state: 'visible' });
      const userInput = this.usernameInput.first();
      await userInput.waitFor({ state: 'visible' });
      await this.action('Fill username', () => userInput.fill(username));
      if (password && await this.passwordInput.first().isVisible()) {
        await this.action('Fill password', () => this.passwordInput.first().fill(password));
      }
      if (await this.loginSubmitButton.first().isVisible()) {
        await this.action('Submit login form', () => this.loginSubmitButton.first().click());
      }
    });
  }

  async openForgotRegistration(): Promise<void> {
    await this.action('Open Forgot Registration page', async () => {
      await this.forgotRegistrationLink.first().click();
      await this.forgotRegistrationHeading.waitFor({ state: 'visible' });
    });
  }
  
async fillForgotRegistrationEmail(email: string): Promise<void> {
  await this.fillInput(
    this.forgotRegEmailTextBox,
    email,
    'registered email'
  );

  await this.fillInput(
    this.forgotRegCaptchaTextBox,
    'dummyCaptcha', 'CAPTCHA code');
  await this.action('Submit Forgot Registration form', () =>
    this.forgotRegSubmitButton.click());
  const captchaError = this.page
    .getByRole('alert')
    .filter({
      hasText: 'The security code you entered is incorrect. Please try again.' });
  const noProfileError = this.page
    .getByRole('alert')
    .filter({
      hasText: 'No candidate profile or registration number found for this email address.'
    });
  const successMessage = this.page.getByText(
    'If the email is registered, you will receive an email with your registration number.',
    { exact: true }
  );
  await expect(
    captchaError.or(noProfileError).or(successMessage).first()
  ).toBeVisible({ timeout: 10000 });
  if (await captchaError.isVisible().catch(() => false)) {
    await expect(captchaError).toBeVisible();
  } else if (await noProfileError.isVisible().catch(() => false)) {
    await expect(noProfileError).toBeVisible();
  } else {
    await expect(successMessage).toBeVisible();
  }
}

}
