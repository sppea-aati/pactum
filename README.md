# PACTUM
## Tecnologias utilizadas
* Java 1.8
* Spring Boot
* Spring Security
* Spring Data JPA
* Angular 6
* Bootstrap
* Quartz
* Banco Oracle
* Autenticação LDAP

## Modelo de Dados
* O modelo relacional do banco de dados está disponível em: [model/diagrama-er.png](model/diagrama-er.png)
* O script para criação das tabelas do sistema está disponível em: [model/create-tables.sql](model/create-tables.sql)

## Backend

### Profiles

* **local-ldap**: indica que o sistema está sendo executado no localhost (máquina do desenvolvedor)

* **dev-oracle**: seta as configurações de conexão do servidor Oracle do localhost

* **prod**: profile default utilizado para subir a aplicação no ambiente de produção

### Executando o backend - via IDE

Execute a classe `br.mp.mpf.pgr.pactum.ConveniosApplicationDevOracle` da pasta src/test/java.
Profiles ativos: `dev-oracle`
Os seguintes arquivos são necessários na pasta do projeto ou `src/test/resources`:
* application-dev-oracle.properties: arquivo de configuração do datasource da aplicação

Exemplo de configuração do arquivo _application-dev-oracle.properties_:
```
spring.datasource.url=jdbc:oracle:thin:@srv_bd:1521/service
spring.datasource.username=user
spring.datasource.password=passwd
spring.datasource.driverClassName=oracle.jdbc.OracleDriver
```
## Frontend
### Instalar dependências
Para instalar as dependências utilizadas pelo Frontend, deve-se executar os passos abaixo:
* Entrar na pasta _src/main/webapp_
* Executar o comando: `npm install`

### Rodar a aplicação frontend
Após a instalação das dependências, deve-se executar o comando abaixo para iniciar a aplicação(frontend)
* A partir da pasta _src/main/webapp_ executar o comando: `npm run start`

## Autenticação Sistema
O Sistema Pactum utiliza o protocolo LDAP(Lightweight Directory Access Protocol) para autenticação dos usuários.
É necessário configurar os atributos abaixo na classe `br.mp.mpf.pgr.pactum.WebSecurityConfiguration`:
* url: Url do servidor LDAP utilizado para instanciação da classe `DefaultSpringSecurityContextSource`
* groupSearchBase: Base de pesquisa para membros do grupo
* userSearchBase: Base de pesquisa de usuários
* userSearchFilter: Filtro LDAP utilizado para pesquisa de usuários

## Geração do WAR(Web Arquive)
Executar o comando abaixo para geração do arquivo _.war_ da aplicação a partir da pasta raiz do projeto:
* `mvn clean package`

O arquivo gerado acima deverá ser utilizado para deploy no Servidor de Aplicação. Recomenda-se o uso do [Apache Tomcat](https://tomcat.apache.org/)
