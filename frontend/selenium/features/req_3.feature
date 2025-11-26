Feature: jugar
  Como usuario
  Quiero entrar al aplicativo
  y jugar en los juegos disponibles

  Scenario Outline: Scenario Outline name: Jugando
    Given Dado que estoy en la pagina de inicio para jugar
    When Cliqueo Ya tengo cuenta para jugar
    Then Me direcciona a la pagina de login
    When Lleno los campos "<user>","<password>" para jugar
    Then Me redirecciona a lobby y me muestra menu de juegos
    When Cliqueo en la ruleta
    Then Me envia a la pagina de la ruleta
    When Hago mi apuesta y presiono girar
    Then Mi saldo debe cambiar

    Examples:
        | user       | password   |
        | test_req_1 | Rq1234     |