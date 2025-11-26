Feature: Funcional Usuario
  Como usuario
  Quiero registrarme en la plataforma
  y poder entrar a la plataforma

  Scenario Outline: Scenario Outline name: Registrando usuarios
    Given Dado que estoy en la pagina de inicio para registrarme
    When Cliqueo empezar a jugar
    Then Me manda a la pagina de registro 
    When Cliqueo los campos
    Then Lleno los campos y reviso que mi user no este duplicado
    When Cliqueo registrar
    Then Me envia al lobby

    Examples:
        | tab      | page          |
        | Chat     | chat.html     |
