import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "https://d3738x78wtlrph.cloudfront.net/"

sleep_time = 2

def test_homepage_title(browser):
    """Test that the homepage title is displayed correctly."""
    browser.get(BASE_URL)
    time.sleep(sleep_time)  # Wait for the page to load
    
    title_element = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "css-12eqb6k"))
    )
    assert title_element.text == "BuddyUp", "Homepage title is incorrect"

def test_view_all_events_button(browser):
    """Test that the 'View All Events' button is present and clickable."""
    browser.get(BASE_URL)
    time.sleep(sleep_time)

    button_element = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'View All Events')]"))
    )
    assert button_element.is_displayed(), "'View All Events' button is not visible"

def test_event_image_exists(browser):
    """Test that an event image is present on the homepage."""
    browser.get(BASE_URL)
    time.sleep(sleep_time)

    image_element = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "MuiCardMedia-img"))
    )
    assert image_element.get_attribute("src") is not None, "Event image is missing"

def test_footer_link(browser):
    """Test that the footer contains the 'Terms of Service' link."""
    browser.get(BASE_URL)
    time.sleep(sleep_time)

    footer_link = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//a[contains(text(), 'Terms of Service')]"))
    )
    assert footer_link.is_displayed(), "Terms of Service link is not visible"

def test_search_box(browser):
    """Test that the search box is present and accepts input."""
    browser.get(BASE_URL)
    time.sleep(sleep_time)

    search_input = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Search for groups or events']"))
    )
    assert search_input.is_displayed(), "Search input box is not visible"
