import pytest
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture(scope="module")
def browser():
    # Setup Chrome WebDriver
    options = Options()
    options.add_argument("--headless")  # Run in headless mode for CI
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
