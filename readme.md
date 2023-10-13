# DataPulse

Este projeto é uma aplicação Electron para visualizar dados de um arquivo CSV.

## Estrutura de Pastas

- **dados:** Contém o arquivo CSV com os dados.
- **src:**
    - **controllers:** Contém o controlador principal da aplicação.
        - `mainController.js`
    - **models:** Contém modelos relacionados ao processamento de dados.
        - `csvModel.js`
    - **views:** Contém as visualizações da aplicação.
        - `chartView.js`
        - `index.html`
- **main.js:** Ponto de entrada para a aplicação Electron.
- **package.json:** Arquivo de configuração do Node.js.

## Executando a Aplicação

Certifique-se de ter o Node.js instalado e, em seguida, execute os seguintes passos:

1. Instale as dependências:
   ```bash
   npm install
