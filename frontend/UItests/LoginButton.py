import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

@pytest.fixture(scope="module")
def browser():
    # Setup Chrome WebDriver
    options = Options()
    # options.add_argument("--headless")  # Run in headless mode for CI
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--ignore-certificate-errors")  # Bypass SSL issues
    options.add_argument("--allow-running-insecure-content")  # Load mixed content
    options.add_argument("--disable-web-security")  # Disable security restrictions (for debugging only)

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.maximize_window()
    yield driver
    driver.quit()  # Cleanup after tests

def test_login_button_reveals_oauth_options(browser):
    """
    Test that clicking the 'Login' button reveals OAuth options like 'Sign in with Facebook'.
    """
    # Open the website
    browser.get("https://d3738x78wtlrph.cloudfront.net/")

    time.sleep(5)

    # Wait for Login button to be visible
    login_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Login')]"))
    )

    # Click the Login button
    login_button.click()

    time.sleep(5)
    
    # Wait for Facebook Sign-In button to appear
    facebook_signin_button = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Sign In with Facebook')]"))
    )

    # Assert that the Facebook Sign-In button is now visible
    assert facebook_signin_button.is_displayed(), "Facebook Sign-In button did not appear!"

