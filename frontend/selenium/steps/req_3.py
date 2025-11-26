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

@given("Dado que estoy en la pagina de inicio para jugar")  # pylint: disable=not-callable
def open_browser(context):
    """Opens in home page."""
    options = Options()

    options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    options.add_argument("--disable-blink-features=AutomationControlled")
    #options.add_argument("--headless")

    context.driver = webdriver.Chrome(options=options)
    context.driver.get("http://localhost:3000")

@when('Cliqueo Ya tengo cuenta para jugar')  # pylint: disable=not-callable
def start_login(context):
    """"""
    """Cliqueo ya tengo cuenta."""
    element = WebDriverWait(context.driver, 10).until(
        EC.element_to_be_clickable((By.LINK_TEXT, "YA TENGO CUENTA"))
    )
    element.click()

@then('Me direcciona a la pagina de login')  # pylint: disable=not-callable
def check_login(context):
    """Revisamos que entramos a login"""
    WebDriverWait(context.driver, 1).until(
        EC.url_contains("login")
    )

@when('Lleno los campos "{user}","{password}" para jugar')  # pylint: disable=not-callable
def start_register_form(context,user,password):
    """iniciar sesion"""
    context.driver.find_element(By.CSS_SELECTOR, ".w-full:nth-child(2)").click()
    context.driver.find_element(By.CSS_SELECTOR, ".w-full:nth-child(2)").send_keys(user)
    context.driver.find_element(By.CSS_SELECTOR, ".px-4:nth-child(1)").click()
    context.driver.find_element(By.CSS_SELECTOR, ".px-4:nth-child(1)").send_keys(password)

    wait = WebDriverWait(context.driver, 10)
    wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[type="submit"]'))).click()

@then('Me redirecciona a lobby y me muestra menu de juegos')  # pylint: disable=not-callable
def check_games(context):
    """Guardo saldo"""
    WebDriverWait(context.driver, 3).until(
        EC.url_contains("lobby")
    )
    balance = context.driver.find_element(
        By.CSS_SELECTOR,
        "span.text-xl.font-black.text-yellow-400.drop-shadow-glow"
    )
    saldo = float(balance.text.replace("$", ""))
    context.saldo = saldo
    

@when('Cliqueo en la ruleta')  # pylint: disable=not-callable
def start_register_form(context):
    """cliqueo hacia la ruleta"""
    context.driver.find_element(By.CSS_SELECTOR, ".group:nth-child(1) .px-8").click()


@then('Me envia a la pagina de la ruleta')  # pylint: disable=not-callable
def start_register_form(context):
    """Entro a la ruleta"""
    WebDriverWait(context.driver, 3).until(
        EC.url_contains("roulette")
    )

@when('Hago mi apuesta y presiono girar')  # pylint: disable=not-callable
def start_register_form(context):
    """Apuesta"""
    context.driver.find_element(By.CSS_SELECTOR, ".outside-section:nth-child(3)").click()
    context.driver.find_element(By.CSS_SELECTOR, ".px-8").click()
    time.sleep(10)
#.outside-section:nth-child(3)
#.px-8
@then('Mi saldo debe cambiar')  # pylint: disable=not-callable
def start_register_form(context):
    """Reviso que haya perdido o ganado"""
    balance = context.driver.find_element(
        By.CSS_SELECTOR,
        "span.text-xl.font-black.text-yellow-400.drop-shadow-glow"
    )    
    n_saldo = float(balance.text.replace("$", ""))
    
    assert n_saldo != context.saldo