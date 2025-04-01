import os
import time
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Retrieve environment variables
FB_EMAIL = os.getenv("FB_EMAIL")
FB_PASSWORD = os.getenv("FB_PASSWORD")

BASE_URL = "https://d3738x78wtlrph.cloudfront.net"

def test_facebook_login(browser):
    """Test Facebook login via OAuth and verify login success."""
    browser.get(BASE_URL)
    time.sleep(3)  # Allow page to load

    # Click 'Login' button
    login_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Login')]"))
    )
    login_button.click()
    time.sleep(3)

    # Click 'Sign in with Facebook' button
    facebook_signin_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign In with Facebook')]"))
    )
    facebook_signin_button.click()
    time.sleep(3)

    # Switch to Facebook login popup
    main_window = browser.current_window_handle
    WebDriverWait(browser, 10).until(lambda d: len(d.window_handles) > 1)
    popup_window = [window for window in browser.window_handles if window != main_window][0]
    browser.switch_to.window(popup_window)

    # Enter Facebook login credentials
    WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.ID, "email"))).send_keys(FB_EMAIL)
    time.sleep(5)
    WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.ID, "pass"))).send_keys(FB_PASSWORD)
    time.sleep(5)

    # Click the Facebook login button
    WebDriverWait(browser, 10).until(EC.element_to_be_clickable((By.ID, "loginbutton"))).click()
    time.sleep(10)  # Allow login process

    # Wait for "Continue as [Your Name]" button
    continue_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//span[contains(text(), 'Continue as')]"))
    )
    continue_button.click()

    time.sleep(5)

    # Switch back to main window
    browser.switch_to.window(main_window)

    # Verify user is logged in by checking for the profile image
    profile_image = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//img[contains(@class, 'MuiAvatar-img')]"))
    )
    assert profile_image.is_displayed(), "Profile image not found, login may have failed!"

    # Verify "Create Event" button is present
    create_event_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create Event')]"))
    )
    assert create_event_button.is_displayed(), "Create Event button not found, login may have failed!"
