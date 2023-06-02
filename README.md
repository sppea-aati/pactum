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
* `application-dev-oracle.properties`

### Executando o backend - via Maven

**Sem indicar profile**

Na pasta raiz, execute o seguinte comando

> mvn spring-boot:run

ou, caso não tenha o Maven instalado localmente


**Indicando profile**

O sistema pode ser executado com qualquer lista de profile executando:

> mvn spring-boot:run -Dspring-boot.profiles.active=dev-oracle -DmainClass br.mp.mpf.pgr.pactum.ServletInitializer


## Frontend
# Instalar dependências

> npm install

# Rodar a aplicação front

> npm run start
