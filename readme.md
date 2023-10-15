# DataPulse

DataPulse: Transforme suas conquistas mensais em pulsos vibrantes de insights. Esteja no ritmo do seu sucesso com gráficos dinâmicos. Sinta a vitalidade dos dados. Inovação que pulsa!

## Estrutura de Pastas

- **dados:** Contém o arquivo CSV com os dados.
- **src:**
    - **controllers:** Contém o controlador principal da aplicação.
        - `mainController.js`
    - **models:** Contém modelos relacionados ao processamento de dados.
        - `csvModel.js`
        - `dataProcessor.js`
        - `fileHandler.js`
    - **views:** Contém as visualizações da aplicação.
        - **assets:**
            - **js:**
                - `tableBuilder.js`
                - `chartBuilder.js`
                - `chartRenderer.js`
                - `uiUpdater.js`
            - **styles:**
              - `style.css`
        - `index.html`
- **main.js:** Ponto de entrada para a aplicação Electron.
- **package.json:** Arquivo de configuração do Node.js.

## Executando a Aplicação

Certifique-se de ter o Node.js instalado e, em seguida, execute os seguintes passos:

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie a aplicação:**
   ```bash
   npm start
   ```

   Agora você está pronto para sentir o pulso dos dados com o DataPulse!

## Licença

Este projeto é licenciado sob a [Licença ISC](LICENSE).
