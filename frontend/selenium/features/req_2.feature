Feature: Revisar lobby 
  Como usuario
  Quiero registrarme en la plataforma
  e interactuar con dentro de ella.

  Scenario Outline: Scenario Outline name: Iniciando sesion
    Given Dado que estoy en la pagina de inicio para iniciar sesion
    When Cliqueo Ya tengo cuenta
    Then Me manda a la pagina de login
    When Lleno los campos "<user>","<password>" y Cliqueo inicia sesion
    Then Me redirecciona a lobby y me muestra juegos
    When Cliqueo en la pestaña historial
    Then Me envia a la pagina de historial
    When Cliqueo en el icono de salir
    Then Me envia a la pagina de login

    Examples:
        | user       | password   |
        | test_req_1 | Rq1234     |