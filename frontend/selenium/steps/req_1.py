# -*- coding: utf-8 -*-

from behave import given, then, when # pylint: disable=no-name-in-module
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchAttributeException

import random
import time

from selenium import webdriver

@given("Dado que estoy en la pagina de inicio para registrarme")  # pylint: disable=not-callable
def open_browser(context):
    """Opens in home page."""
    options = Options()

    options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    options.add_argument("--disable-blink-features=AutomationControlled")
    #options.add_argument("--headless")

    context.driver = webdriver.Chrome(options=options)
    context.driver.get("http://localhost:3000")
    #context.driver.find_element(By.CSS_SELECTOR, ".z-10:nth-child(1)").click()

@when('Cliqueo empezar a jugar')  # pylint: disable=not-callable
def start_register_form(context):
    """Clicks one tab."""
    element = WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.LINK_TEXT, "EMPEZAR A JUGAR"))
    )
    element.click()

@then('Me manda a la pagina de registro')  # pylint: disable=not-callable
def Check_register(context):
    """revisa que estemos en la pagina register"""
    WebDriverWait(context.driver, 1).until(
        EC.url_contains("register")
    )

@when('Cliqueo los campos')  # pylint: disable=not-callable
def check_empty_register(context):
    """Revisa si te permite iniciar con campos vacios"""
    element = WebDriverWait(context.driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='CREAR CUENTA']"))
    )
    element.click()

@then('Lleno los campos y reviso que mi user no este duplicado')  # pylint: disable=not-callable
def complete_register_form(context):
    """complete register form, and checks duplicates"""
    extra = str(random.randint(0,999))

    wait = WebDriverWait(context.driver, 10)
    wait.until(EC.element_to_be_clickable((By.NAME, "username"))).send_keys("test_req_1")
    wait.until(EC.element_to_be_clickable((By.NAME, "email"))).send_keys("test_req_1@gmai.com")
    wait.until(EC.element_to_be_clickable((By.NAME, "firstName"))).send_keys("test")
    wait.until(EC.element_to_be_clickable((By.NAME, "lastName"))).send_keys("req1")
    wait.until(EC.element_to_be_clickable((By.NAME, "password"))).send_keys("Rq1234")
    
    element = WebDriverWait(context.driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='CREAR CUENTA']"))
    )
    element.click()

    WebDriverWait(context.driver, 1).until(
        EC.url_contains("register")
    )

    
    wait = WebDriverWait(context.driver, 10)
    username = wait.until(EC.element_to_be_clickable((By.NAME, "username")))
    username.click()
    username.send_keys(Keys.CONTROL, "a")
    username.send_keys(Keys.DELETE)
    #
    email = wait.until(EC.element_to_be_clickable((By.NAME, "email")))
    email.click()
    email.send_keys(Keys.CONTROL, "a")
    email.send_keys(Keys.DELETE)
    
    wait.until(EC.element_to_be_clickable((By.NAME, "username"))).send_keys("test_req_1"+extra)
    wait.until(EC.element_to_be_clickable((By.NAME, "email"))).send_keys("test_req_"+extra+"@gmail.com")

@when('Cliqueo registrar')  # pylint: disable=not-callable
def register(context):
    """Clicks register."""
    element = WebDriverWait(context.driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='CREAR CUENTA']"))
    )
    element.click()

@then('Me envia al lobby')  # pylint: disable=not-callable
def Check_lobby(context):
    """Redirccion a lobby"""
    WebDriverWait(context.driver, 5).until(
        EC.url_contains("lobby")
    )