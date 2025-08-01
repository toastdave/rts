import { test, expect } from "@playwright/test";
import { uuid } from "zod";

test.describe("Full End-to-End", () => {
  test("signup", async ({ page }) => {
    await page.goto("http://localhost:4321/signup");
    await page.waitForLoadState("networkidle");
    await page.getByRole("textbox", { name: "Email" }).click();
    await page
      .getByRole("textbox", { name: "Email" })
      .fill(`test${await crypto.randomUUID().replace("-", "")}@example.com`);
    await page.getByRole("textbox", { name: "Email" }).press("Tab");
    await page.getByRole("textbox", { name: "Password" }).fill("11111111");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await page.waitForURL("http://localhost:4321/");

    expect(page.url()).toBe("http://localhost:4321/");
  });

  test("logout", async ({ page }) => {
    await page.goto("http://localhost:4321/login");
    await page.waitForLoadState("networkidle");
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill("test@example.com");
    await page.getByRole("textbox", { name: "Email" }).press("Tab");
    await page.getByRole("textbox", { name: "Password" }).fill("11111111");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('form')).toContainText('Find Any Stock Open Price');
    await page.getByTestId("avatar").click();

    await page.getByTestId("logout-button").click();
    await page.getByRole("button", { name: "Logout" }).click();

    await expect(page.locator("body")).toContainText("Login to your account");
  });

  test("login", async ({ page }) => {
    await page.goto("http://localhost:4321/login");
    await page.waitForLoadState('networkidle')
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill("test@example.com");
    await page.getByRole("textbox", { name: "Email" }).press("Tab");
    await page.getByRole("textbox", { name: "Password" }).fill("11111111");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await expect(page.locator('form')).toContainText('Find Any Stock Open Price');
  });

  
  test("search symbol", async ({ page }) => {
    await page.goto("http://localhost:4321/login");
    await page.waitForLoadState("networkidle");
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill("test@example.com");
    await page.getByRole("textbox", { name: "Email" }).press("Tab");
    await page.getByRole("textbox", { name: "Password" }).fill("11111111");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await page.waitForLoadState("networkidle");
    await page.getByRole("textbox", { name: "Symbol" }).click();
    await page.getByRole("textbox", { name: "Symbol" }).fill("aapl");
    await page.getByRole("button", { name: "Submit" }).click();
    const dollarAmountRegex = /\$\d+(\.\d+)?/;
    const responseText = await page.textContent("#responseMessage");
    expect(responseText).toBeTruthy();
    expect(dollarAmountRegex.test(responseText || "")).toBeTruthy();
    await page.getByRole("textbox", { name: "Symbol" }).click();
    await page.getByRole("textbox", { name: "Symbol" }).fill("tsla");
    await page.getByRole("button", { name: "Submit" }).click();
    const responseText2 = await page.textContent("#responseMessage");
    expect(responseText2).toBeTruthy();
    expect(dollarAmountRegex.test(responseText2 || "")).toBeTruthy();
  });

  test("404", async ({ page }) => {
    await page.goto("http://localhost:4321/loginasdf");
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toContainText('Oops!');
    await expect(page.getByRole('paragraph')).toContainText('The page you are looking for does not exist.');
  });
});
