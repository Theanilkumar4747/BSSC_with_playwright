import { test as baseTest, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { LoginPage } from '../pages/LoginPage';
import { ActionLogger } from './actionLogger';

/**
 * Extended Playwright test fixtures with pre-instantiated Page Objects
 */
type CustomFixtures = {
  actionLogger: ActionLogger;
  registrationPage: RegistrationPage;
  loginPage: LoginPage;
};

export const test = baseTest.extend<CustomFixtures>({
  actionLogger: async ({}, use) => {
    await use(new ActionLogger());
  },

  registrationPage: async ({ page, actionLogger }, use) => {
    const regPage = new RegistrationPage(page, actionLogger);
    await use(regPage);
  },

  loginPage: async ({ page, actionLogger }, use) => {
    const lPage = new LoginPage(page, actionLogger);
    await use(lPage);
  },
});

test.afterEach(async ({ page, actionLogger }, testInfo) => {
  await testInfo.attach('action-log', {
    body: actionLogger.toText() || 'No instrumented page-object actions were recorded.',
    contentType: 'text/plain',
  });

  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach('failure-screenshot-full-page', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  }
});

export { expect };
