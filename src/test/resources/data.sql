insert into usuario_sistema (matricula, nome, email, codigo_cargo, cargo, ativo) values (1, 'user', 'user', 'AN020748', 'ANALISTA', 'S');
insert into usuario_sistema (matricula, nome, email, codigo_cargo, cargo, ativo) values (2, 'user2', 'user2@email.com', 'AN020748', 'TÉCNICO', 'S');
insert into perfil_usuario (id_usuario, perfil) values (1, 'USUARIO');
insert into perfil_usuario (id_usuario, perfil) values (1, 'ADMINISTRADOR');
insert into perfil_usuario (id_usuario, perfil) values (2, 'USUARIO');
insert into vw_pessoal (matricula, nome, email1, desligado, cpf) values (1, 'user', 'user', 'NÃO', 01234567890);
insert into vw_pessoal (matricula, nome, email1, desligado, cpf) values (2, 'user2', 'user2@email.com', 'NÃO', 98765432109);
insert into vw_pessoal (matricula, nome, email1, desligado, cpf) values (3, 'user3', 'user3@email.com', 'NÃO', 83301359445);

insert into pesquisador (matricula, atualizado) values ('1', 'NÃO');
insert into pesquisador (matricula, atualizado) values ('2', 'SIM');

insert into convenio (sigla, descricao, orgao_vinculo, contatos, data_inicio_vigencia, data_fim_vigencia, resumo, numero_procedimento) values ('sistema_1',  'descricao_1',  'orgao_vinculo', 'contatos', to_date('08/03/2017','DD/MM/YYYY'), to_date('01/02/2018','DD/MM/YYYY'), 'resumo', '0002175-12.2016.4.01.7086');
insert into convenio (sigla, descricao, orgao_vinculo, contatos, data_inicio_vigencia, data_fim_vigencia, resumo, numero_procedimento) values ('sistema_2',  'descricao_2',  'orgao_vinculo', 'contatos', to_date('08/03/2017','DD/MM/YYYY'), to_date('06/02/2018','DD/MM/YYYY'), 'resumo', '0002142-27.2017.4.02.7180');
insert into convenio (sigla, descricao, orgao_vinculo, contatos, data_inicio_vigencia, data_fim_vigencia, resumo, numero_procedimento) values ('sistema_3',  'descricao_3',  'orgao_vinculo', 'contatos', to_date('08/03/2017','DD/MM/YYYY'), to_date('10/02/2018','DD/MM/YYYY'), 'resumo', '0002136-36.2016.4.03.8985');
insert into convenio (sigla, descricao, orgao_vinculo, contatos, data_inicio_vigencia, data_fim_vigencia, resumo, numero_procedimento) values ('sistema_4',  'descricao_4',  'orgao_vinculo', 'contatos', to_date('08/03/2017','DD/MM/YYYY'), to_date('15/02/2018','DD/MM/YYYY'), 'resumo', '0003217-41.2015.4.04.8180');
insert into convenio (sigla, descricao, orgao_vinculo, contatos, data_inicio_vigencia, data_fim_vigencia, resumo, numero_procedimento) values ('sistema_5',  'descricao_5',  'orgao_vinculo', 'contatos', to_date('08/03/2017','DD/MM/YYYY'), to_date('20/02/2018','DD/MM/YYYY'), 'resumo', '0003248-40.2015.4.05.3764');
insert into convenio (sigla, descricao, orgao_vinculo, contatos, data_inicio_vigencia, data_fim_vigencia, resumo, numero_procedimento) values ('sistema_6',  'descricao_6',  'orgao_vinculo', 'contatos', to_date('08/03/2017','DD/MM/YYYY'), to_date('25/02/2018','DD/MM/YYYY'), 'resumo', '0004238-29.2014.4.06.3685');
insert into convenio (sigla, descricao, orgao_vinculo, contatos, data_inicio_vigencia, data_fim_vigencia, resumo, numero_procedimento) values ('sistema_7',  'descricao_7',  'orgao_vinculo', 'contatos', to_date('08/03/2017','DD/MM/YYYY'), to_date('28/02/2018','DD/MM/YYYY'), 'resumo', '0005417-55.2015.4.07.4580');
insert into convenio (sigla, descricao, orgao_vinculo, contatos, data_inicio_vigencia, data_fim_vigencia, resumo, numero_procedimento) values ('sistema_8',  'descricao_8',  'orgao_vinculo', 'contatos', to_date('08/03/2017','DD/MM/YYYY'), to_date('01/03/2018','DD/MM/YYYY'), 'resumo', '0005465-68.2014.4.08.3582');
insert into convenio (sigla, descricao, orgao_vinculo, contatos, data_inicio_vigencia, data_fim_vigencia, resumo, numero_procedimento) values ('sistema_9',  'descricao_9',  'orgao_vinculo', 'contatos', to_date('08/03/2017','DD/MM/YYYY'), to_date('05/03/2018','DD/MM/YYYY'), 'resumo', '0008577-76.2013.4.09.7482');
insert into convenio (sigla, descricao, orgao_vinculo, contatos, data_inicio_vigencia, data_fim_vigencia, resumo, numero_procedimento) values ('sistema_10', 'descricao_10', 'orgao_vinculo', 'contatos', to_date('08/03/2017','DD/MM/YYYY'), to_date('10/03/2018','DD/MM/YYYY'), 'resumo', '0008748-61.2017.4.10.2483');
insert into convenio (sigla, descricao, orgao_vinculo, contatos, data_inicio_vigencia, data_fim_vigencia, resumo, numero_procedimento) values ('sistema_11', 'descricao_11', 'orgao_vinculo', 'contatos', to_date('08/03/2017','DD/MM/YYYY'), to_date('05/03/2018','DD/MM/YYYY'), 'resumo', '0009719-80.2016.4.11.1183');
insert into acesso (id_convenio, id_usuario, operacao) values (1,  1, 'CADASTRAR');
insert into acesso (id_convenio, id_usuario, operacao) values (1,  2, 'CADASTRAR');
insert into acesso (id_convenio, id_usuario, operacao) values (2,  1, 'CADASTRAR');
insert into acesso (id_convenio, id_usuario, operacao) values (3,  1, 'CADASTRAR');
insert into acesso (id_convenio, id_usuario, operacao) values (4,  1, 'CADASTRAR');
insert into acesso (id_convenio, id_usuario, operacao) values (5,  1, 'CADASTRAR');
insert into acesso (id_convenio, id_usuario, operacao) values (6,  1, 'CADASTRAR');
insert into acesso (id_convenio, id_usuario, operacao) values (7,  1, 'CADASTRAR');
insert into acesso (id_convenio, id_usuario, operacao) values (8,  1, 'CADASTRAR');
insert into acesso (id_convenio, id_usuario, operacao) values (9,  1, 'CADASTRAR');
insert into acesso (id_convenio, id_usuario, operacao) values (10, 1, 'CADASTRAR');
insert into acesso (id_convenio, id_usuario, operacao) values (11, 1, 'CADASTRAR');

insert into email (email, enviar_convenio, enviar_base_dados) values ('user1@email.com', 'S', 'N');
insert into email (email, enviar_convenio, enviar_base_dados) values ('user2@email.com', 'S', 'N');
insert into email (email, enviar_convenio, enviar_base_dados) values ('user3@email.com', 'S', 'N');