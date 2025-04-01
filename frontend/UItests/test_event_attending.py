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

def test_event_attending(browser):
    """Testing attending event then leaving"""
    browser.get(BASE_URL)
    time.sleep(2)  # Allow page to load

    # Click 'Login' button
    login_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Login')]"))
    )
    login_button.click()
    time.sleep(2)

    # Click 'Sign in with Facebook' button
    facebook_signin_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign In with Facebook')]"))
    )
    facebook_signin_button.click()
    time.sleep(2)

    # Switch to Facebook login popup
    main_window = browser.current_window_handle
    WebDriverWait(browser, 10).until(lambda d: len(d.window_handles) > 1)
    popup_window = [window for window in browser.window_handles if window != main_window][0]
    browser.switch_to.window(popup_window)

    # Enter Facebook login credentials
    WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.ID, "email"))).send_keys(FB_EMAIL)
    time.sleep(6)
    WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.ID, "pass"))).send_keys(FB_PASSWORD)
    time.sleep(3)

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

    # Click on the event card
    event_card = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//h6[contains(text(), 'Volleyball Tournament')]/ancestor::div[contains(@class, 'MuiCard-root')]"))
    )
    event_card.click()
    time.sleep(3)

    # Verify event page is loaded
    event_title = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h5[contains(text(), 'Volleyball Tournament')]"))
    )

    assert event_title.is_displayed(), "Event title not found, event details may have failed!"

    event_time = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h6[contains(text(), 'Saturday, April 5, 2025')]"))
    )

    assert event_time.is_displayed(), "Event time not found, event details may have failed!"

    # Click the 'Attend' button
    attend_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Attend')]"))
    )
    attend_button.click()
    time.sleep(3)

    # Navigate to profile
    profile_avatar = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'MuiAvatar-root')]//img"))
    )
    profile_avatar.click()
    time.sleep(3)

    # Click 'My Events'
    my_events_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//li[contains(text(), 'My events')]"))
    )
    my_events_button.click()
    time.sleep(3)

    # Verify event appears in 'My Events'
    attending_event = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//h6[contains(text(), 'Volleyball Tournament')]"))
    )

    assert attending_event.is_displayed(), "Event not found, attending event may have failed!"

    attending_event.click()
    time.sleep(3)

    # Click the 'Leave' button
    leave_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Leave')]"))
    )
    leave_button.click()
    time.sleep(3)

    # Navigate to profile again
    profile_avatar = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'MuiAvatar-root')]//img"))
    )
    profile_avatar.click()
    time.sleep(3)

    # Click 'My Events' again
    my_events_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//li[contains(text(), 'My events')]"))
    )
    my_events_button.click()
    time.sleep(3)

    # Verify event is no longer in 'My Events'
    events_list = browser.find_elements(By.XPATH, "//h6[contains(text(), 'Volleyball Tournament')]")
    
    assert len(events_list) == 0, "Event still appears in 'My Events', leaving event may have failed!"




