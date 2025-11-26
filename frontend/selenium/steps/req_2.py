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

@given("Dado que estoy en la pagina de inicio para iniciar sesion")  # pylint: disable=not-callable
def open_browser(context):
    """Opens in home page."""
    options = Options()

    options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    options.add_argument("--disable-blink-features=AutomationControlled")
    #options.add_argument("--headless")

    context.driver = webdriver.Chrome(options=options)
    context.driver.get("http://localhost:3000")

@when('Cliqueo Ya tengo cuenta')  # pylint: disable=not-callable
def start_login_form(context):
    """Cliqueo ya tengo cuenta."""
    element = WebDriverWait(context.driver, 10).until(
        EC.element_to_be_clickable((By.LINK_TEXT, "YA TENGO CUENTA"))
    )
    element.click()

@then('Me manda a la pagina de login')  # pylint: disable=not-callable
def start_register_form(context):
    """Clicks one tab."""
    WebDriverWait(context.driver, 1).until(
        EC.url_contains("login")
    )

@when('Lleno los campos "{user}","{password}" y Cliqueo inicia sesion')  # pylint: disable=not-callable
def start_register_form(context,user,password):
    """Clicks one tab."""
    context.driver.find_element(By.CSS_SELECTOR, ".w-full:nth-child(2)").click()
    context.driver.find_element(By.CSS_SELECTOR, ".w-full:nth-child(2)").send_keys(user)
    context.driver.find_element(By.CSS_SELECTOR, ".px-4:nth-child(1)").click()
    context.driver.find_element(By.CSS_SELECTOR, ".px-4:nth-child(1)").send_keys(password)

    wait = WebDriverWait(context.driver, 10)
    wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[type="submit"]'))).click()

@then('Me redirecciona a lobby y me muestra juegos')  # pylint: disable=not-callable
def start_register_form(context):
    """Revisa que si nos mande al lobby y que esten los juegos."""
    WebDriverWait(context.driver, 3).until(
        EC.url_contains("lobby")
    )
    EC.presence_of_element_located((
        By.CSS_SELECTOR,
        "div.p-8.flex.flex-col.items-center.text-center.h-full.relative.z-10"
    ))

@when('Cliqueo en la pestaña historial')  # pylint: disable=not-callable
def start_register_form(context):
    """Cliqueamos en la pestaña historial."""
    context.driver.find_element(By.XPATH, "//span[text()='Historial']").click()

@then('Me envia a la pagina de historial')  # pylint: disable=not-callable
def start_register_form(context):
    """Revisamos que si estemos en la direccion correcta."""
    WebDriverWait(context.driver, 3).until(
        EC.url_contains("history")
    )

@when('Cliqueo en el icono de salir')  # pylint: disable=not-callable
def logout(context):
    """cerramos sesion."""
    context.driver.find_element(By.XPATH, "//button[@title='Cerrar Sesión']").click()

@then('Me envia a la pagina de login')  # pylint: disable=not-callable
def check_login(context):
    """Revisa que volvamos a login."""
    WebDriverWait(context.driver, 3).until(
        EC.url_contains("login")
    )