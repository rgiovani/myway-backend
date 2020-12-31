-- Imagem de perfil
INSERT INTO file(id, old_name, new_name, format, link, created_at, updated_at)
VALUES
('fd27c4e7-9947-4337-8109-3259e5108aea', 'img1.jpg', 'img1.jpg', 'jpg', 'img1.jpg', sysdate(), sysdate()),
('0c4525f0-4375-4d87-9d00-f77727ab78b5', 'img2.jpg', 'img2.jpg', 'jpg', 'img2.jpg', sysdate(), sysdate()),
('ab4e05a7-e580-4d17-a615-3ce1289a2ec3', 'img3.jpg', 'img3.jpg', 'jpg', 'img3.jpg', sysdate(), sysdate()),
('c40452f2-d798-4f15-9ed8-a52db3fa97d8', 'img4.jpg', 'img4.jpg', 'jpg', 'img4.jpg', sysdate(), sysdate());

INSERT INTO user(id, first_name, last_name, email, password, created_at, updated_at)
VALUES
('48935754-9a97-40d8-b6b4-0a808597f314', 'Luiz', 'Antonio', 'luizantonio@email.com', '$2b$10$k132x7Df.JgqTyfJw9CDRug3Zq/EWDgQtW5hC.36Kg8Zd2Gq3VZAu', sysdate(), sysdate()), -- Senha: 12345
('36a39c36-a2fa-4c3f-a805-3a000721d018', 'Marcos', 'Silva','marcosdasilva@email.com', '$2b$10$PaVk5AxDkBxjSw2kXQXAf.G91sNCBIX0eDm46drySYoArj4yInFJG', sysdate(), sysdate()), -- Senha: 1234567
('9008a0ef-fdff-4cea-9884-8cf5bc91c8ee', 'João', 'Carlos','joaocarlos@email.com', '$2b$10$cVy6csWVwMQ2vGb2J88bTeFlRa5N0NobRTTQ3xo5EFFQnmWIZhqjS', sysdate(), sysdate()), -- Senha: 12345
('2d509ce5-1ee0-4a8f-ae04-59d0db3bf137', 'Thiago', 'Montero', 'montero-thiago@email.com', '$2b$10$6OxRfQkLJTrBAJqNAslOMeQnGNeYokJt4s56hqD.WxWdFxAHpLigi', sysdate(), sysdate()), -- Senha: 12345
('e78d4e78-f9db-453d-ac32-07292061e6b6', 'Marcello', 'Oliveira','marcellooliveira@email.com', '$2b$10$vVZ/hrOEM9zjWsacIsbMCOzkDqgaCvpZDAtFM6VsqEyzGV5I88QA..', sysdate(), sysdate()), -- Senha: 12345
('9438b07e-6f03-4023-b5a2-b5aab3ce3104', 'Juliana', 'Pereira','juliana.pereiria@email.com', '$2b$10$buZ9r6NoyVZNsH8zCM7ceuT4RNlzg19yI8dzEME8Mc9cN3ZvV85gK', sysdate(), sysdate()), -- Senha: 12345
('9205972a-0f97-49e1-aca1-fc81da3ad3a9', 'Ana', 'Santos','santos-ana11@email.com', '$2b$10$G9GSKNLJFhWyrMjpcZI8U.d5SbG/deCgue89xTq1bKcpd8lBHe696', sysdate(), sysdate()),  -- Senha: 123456
('7541571c-cf43-4ea0-8f70-7ed95f56f2c8', 'Michelle', 'Oliveira','michele@email.com', '$2b$10$rdhiqv5gC0uN4dKxxEb42e6kLxFsoQIB5UPQcTOTSlbZu.c3f/47y', sysdate(), sysdate());  -- Senha: 123456

INSERT INTO rating(id, total_score, number_of_ratings , created_at, updated_at)
VALUES
('826d1e31-a9e5-4017-b0c0-bc63d74b3480', 5, 1, sysdate(), sysdate()),
('6cd1199e-7c69-4c65-9fca-06bf310a6161', 8, 2, sysdate(), sysdate()),
('3464bfca-556a-4037-8c1e-0061c6da7ec3', 4, 1, sysdate(), sysdate()),
('feb2d817-7b5a-4f67-a887-943272d76d39', 39, 8,  sysdate(), sysdate());

INSERT INTO teacher(id, specialty, about, profile_photo_id, rating_id, donation_link)
VALUES
('48935754-9a97-40d8-b6b4-0a808597f314', 'Sou especialista em Ingles', 'Sou formado em Letras', 'fd27c4e7-9947-4337-8109-3259e5108aea', '826d1e31-a9e5-4017-b0c0-bc63d74b3480', 'https://www.paypal.com/br/home'),
('2d509ce5-1ee0-4a8f-ae04-59d0db3bf137','Sou professor de alemao', 'Sou formado em alemao', '0c4525f0-4375-4d87-9d00-f77727ab78b5', '6cd1199e-7c69-4c65-9fca-06bf310a6161', 'https://www.paypal.com/br/home'),
('9438b07e-6f03-4023-b5a2-b5aab3ce3104','Sou professora de alemao', 'Sou formada em alemao', 'ab4e05a7-e580-4d17-a615-3ce1289a2ec3', '3464bfca-556a-4037-8c1e-0061c6da7ec3', null),
('7541571c-cf43-4ea0-8f70-7ed95f56f2c8','Sou professor de italiano', 'Sou formada em italiano', 'c40452f2-d798-4f15-9ed8-a52db3fa97d8', 'feb2d817-7b5a-4f67-a887-943272d76d39', 'https://www.mercadopago.com.br/');

INSERT INTO student(id)
VALUES
('48935754-9a97-40d8-b6b4-0a808597f314'),
('36a39c36-a2fa-4c3f-a805-3a000721d018'),
('9008a0ef-fdff-4cea-9884-8cf5bc91c8ee'),
('2d509ce5-1ee0-4a8f-ae04-59d0db3bf137'),
('e78d4e78-f9db-453d-ac32-07292061e6b6'),
('9438b07e-6f03-4023-b5a2-b5aab3ce3104'),
('9205972a-0f97-49e1-aca1-fc81da3ad3a9'),
('7541571c-cf43-4ea0-8f70-7ed95f56f2c8');

INSERT INTO file(id, old_name, new_name, format, link, created_at, updated_at)
VALUES
('b2b6d86b-e9e6-41f8-86ae-c76363b114fa', 'curso1.jpg', 'curso1.jpg', 'jpg', 'curso1.jpg', sysdate(), sysdate()),
('c8c6728d-b284-4735-b821-9d66cb8adc13', 'curso2.jpg', 'curso2.jpg', 'jpg', 'curso2.jpg', sysdate(), sysdate()),
('bc614b34-3b57-43c7-b238-a84fbcbc14dc', 'curso3.jpg', 'curso3.jpg', 'jpg', 'curso3.jpg', sysdate(), sysdate()),
('d6ff05ad-f7c0-4ed6-92cf-a43fde4b8804', 'curso4.jpg', 'curso4.jpg', 'jpg', 'curso4.jpg', sysdate(), sysdate()),
('fcb00036-7579-457f-a9a4-b8e632024bed', 'curso5.jpg', 'curso5.jpg', 'jpg', 'curso5.jpg', sysdate(), sysdate()),
('d0e1d76e-112c-4d95-ab6c-da3b4aadf25d', 'curso6.jpg', 'curso6.jpg', 'jpg', 'curso6.jpg', sysdate(), sysdate()),
('ef2e5cce-1683-400e-a135-79c8e01dc44e', 'curso7.jpg', 'curso7.jpg', 'jpg', 'curso7.jpg', sysdate(), sysdate());

INSERT INTO course(id, `level`, title, subtitle, description, student_prerequisites, student_targets, total_score, number_of_ratings, goals, created_at, updated_at, teacher_id, image_course_id)
VALUES
('72284e66-2116-4a3a-a8d8-b9466b3ee6de', 'INICIANTE', 'Curso de Ingles Básico', 'Esse é o mais novo curso de ingles básico na plataforma', 'Aqui você vai aprender o básico sobre o idioma ingles com aulas dinamicas', 'Não é preciso pré requisitos', 'Estudantes que querem aprender um novo idioma', 5, 1,'Ensinar um novo idioma pra voce', sysdate(), sysdate(), '48935754-9a97-40d8-b6b4-0a808597f314', 'c8c6728d-b284-4735-b821-9d66cb8adc13'),
('70123s66-2346-4afa-afd8-b9466gfgd6de', 'INTERMEDIARIO', 'Curso de Ingles Intermediário', 'Meu curso de inglês intermediário', 'Aprendendo ingles intermediário facil facil', 'Sem pré requisitos', 'Estudantes que querem aprimorar o ingles', 4, 2, 'Novo idioma pra voce', sysdate(), sysdate(), '48935754-9a97-40d8-b6b4-0a808597f314', 'b2b6d86b-e9e6-41f8-86ae-c76363b114fa'),
('6b71ea9f-53c1-48ab-9139-84b6fea688bf', 'INICIANTE', 'Curso de Espanhol Básico', 'Esse é o mais novo curso de espanhol básico na plataforma', 'Aqui você vai aprender o básico sobre o idioma espanhol com aulas dinamicas', 'Não é preciso pré requisitos', 'Estudantes que querem aprender um novo idioma', 4.1, 1, 'Ensinar um novo idioma pra voce', sysdate(), sysdate(), '48935754-9a97-40d8-b6b4-0a808597f314', 'bc614b34-3b57-43c7-b238-a84fbcbc14dc'),
('97a0ebe4-c210-4031-bf9d-17cce5cb35be', 'AVANCADO', 'Curso de Francês Avançado', 'Quem já domina o idioma frances e quer aprender mais, acesse esse curso', 'Aqui você vai aprender sobre a parte avançada do idioma frances', 'Precisa saber verbos, pronomes, substantivos e adverbio', 'Estudantes que querem ter mais conhecimento sobre o idioma frances',  0, 5, 'Aprimorar seus conhecimentos', sysdate(), sysdate(), '48935754-9a97-40d8-b6b4-0a808597f314', 'd6ff05ad-f7c0-4ed6-92cf-a43fde4b8804'),
('bf9878d0-a050-45d7-93e6-7136cf387951', 'INICIANTE', 'Curso de Alemao Básico', 'Para quem quer aprender alemão', 'Aqui voce aprende que o alemao é legal', 'Precisa ter vontade de aprender', 'Brasileiros', 3, 1, 'Ensinar o básico de alemão apartir do zero', sysdate(), sysdate(), '2d509ce5-1ee0-4a8f-ae04-59d0db3bf137', 'fcb00036-7579-457f-a9a4-b8e632024bed'),
('d2115140-3c6f-4e3d-8331-49c9a898a6e7', 'INICIANTE', 'Curso de Ingles Intermediário com o professor thiago', 'Agora estou com curso de ingles intermediario', 'Vamos reforçar seu ingles?', 'Básico do ingles', 'Praticantes de ingles', 4, 2, 'reforçar seu ingles básico', sysdate(), sysdate(), '2d509ce5-1ee0-4a8f-ae04-59d0db3bf137', 'd0e1d76e-112c-4d95-ab6c-da3b4aadf25d'),
('1cda99c5-9f63-4df4-bdfc-3520bd98d2a2', 'AVANCADO', 'Italiano Avançado', 'Curso voltado para pessoas que já sabe o básico de italiano', 'Curso atualizado sobre o idioma italiano', 'Tudo sobre o idioma italiano', 'Praticantes de Italiano', 4, 2, 'Aprimorar o seu conhecimento', sysdate(), sysdate(), '9438b07e-6f03-4023-b5a2-b5aab3ce3104', 'ef2e5cce-1683-400e-a135-79c8e01dc44e');

INSERT INTO language(id, name, created_at, updated_at, course_id, announcement_id)
VALUES
('172a3ff2-3dfb-4ad1-80b3-1536c1402407', 'INGLÊS', sysdate(), sysdate(), '72284e66-2116-4a3a-a8d8-b9466b3ee6de', null),
('fb9d7b2e-7d40-42ec-9530-b207b0b97c2b', 'INGLES', sysdate(), sysdate(), '70123s66-2346-4afa-afd8-b9466gfgd6de', null),
('8b4e9303-8382-4a08-a31f-c1805088ff3e', 'ESPANHOL', sysdate(), sysdate(), '6b71ea9f-53c1-48ab-9139-84b6fea688bf', null),
('cab790d2-7e8c-40c2-8064-6c9a74c5e40d', 'FRANCES', sysdate(), sysdate(), '97a0ebe4-c210-4031-bf9d-17cce5cb35be', null),
('ddc9c179-ef06-46c5-a5b9-ebde6313256a', 'ALEMAO', sysdate(), sysdate(), 'bf9878d0-a050-45d7-93e6-7136cf387951', null),
('fb076231-cca9-43e5-ac26-85ec2d97f283', 'INGLÊS', sysdate(), sysdate(), 'd2115140-3c6f-4e3d-8331-49c9a898a6e7', null),
('030adc26-5d0c-4c05-92d7-91d2d314a5de', 'ITALIANO', sysdate(), sysdate(), '1cda99c5-9f63-4df4-bdfc-3520bd98d2a2', null);

-- CURSO 1
INSERT INTO file(id, old_name, new_name, format, link, created_at, updated_at)
VALUES
('8758ee37-b6f5-4cc4-b650-e205bd10e42f', 'video1.mp4', 'video1.mp4', 'mp4', 'video1.mp4', sysdate(), sysdate()),
('61d06f3b-1707-42fb-81d8-164243169482', 'video2.mp4', 'video2.mp4', 'mp4', 'video2.mp4', sysdate(), sysdate()),
('7d9dbc90-e59d-4a8e-a2e3-cc89ea8e54db', 'video3.mp4', 'video3.mp4', 'mp4', 'video3.mp4', sysdate(), sysdate());

INSERT INTO content(id, title, description, content_type, created_at, updated_at, course_id, file_id)
VALUES
('f31f237e-25db-4c4c-8c70-7b5faf050b83', 'Aula Introdutoria', 'Aqui voce vai ver como sera a metodologia', 'VIDEO', sysdate(), sysdate(), '72284e66-2116-4a3a-a8d8-b9466b3ee6de', '8758ee37-b6f5-4cc4-b650-e205bd10e42f'),
('bc54b5e3-0870-4d5c-b89c-6cbfb935a6c0', 'Historia do idioma', 'Nesta aula voce vai aprender sobre a historia do idioma ingles', 'VIDEO', sysdate(), sysdate(), '72284e66-2116-4a3a-a8d8-b9466b3ee6de', '61d06f3b-1707-42fb-81d8-164243169482'),
('c77be882-5b5f-49e4-b83a-aeedc9bbd746', 'Conceitos Básicos sobre o idioma ingles', 'Nessa aula voce vai aprender os primeiros conceitos', 'VIDEO', sysdate(), sysdate(), '72284e66-2116-4a3a-a8d8-b9466b3ee6de', '7d9dbc90-e59d-4a8e-a2e3-cc89ea8e54db');

-- CURSO 2
INSERT INTO file(id, old_name, new_name, format, link, created_at, updated_at)
VALUES
('faec1505-2a5e-474a-8230-0a803ae1230c', 'video4.mp4', 'video4.mp4', 'mp4', 'video4.mp4', sysdate(), sysdate()),
('acc8ca42-54ff-4059-800b-0cd5317152da', 'video5.mp4', 'video5.mp4', 'mp4', 'video5.mp4', sysdate(), sysdate()),
('fc95b8ad-6e91-4c4b-836a-6c2fe18bc6a9', 'video6.mp4', 'video6.mp4', 'mp4', 'video6.mp4', sysdate(), sysdate());

INSERT INTO content(id, title, description, content_type, created_at, updated_at, course_id, file_id, link)
VALUES
('8f2560bc-3ea8-45fd-8ebf-3b95d7ccc711', 'Aula Inicial', 'Aqui voce vai ver como sera a metodologia', 'VIDEO', sysdate(), sysdate(), '6b71ea9f-53c1-48ab-9139-84b6fea688bf', 'faec1505-2a5e-474a-8230-0a803ae1230c', null),
('2085d754-2107-4d70-bf4a-f44ee306e140', 'O básico sobre o idioma espanhol', 'Aqui voce aprender sobre o basico do idioma espanhol', 'VIDEO', sysdate(), sysdate(), '6b71ea9f-53c1-48ab-9139-84b6fea688bf', 'acc8ca42-54ff-4059-800b-0cd5317152da', null),
('77e4e522-ea2a-439f-b2f2-ef78395bc5a1', 'Questionario 1', 'Aqui voce respondera um questionario para validar os conhecimentos', 'PRACTICAL', sysdate(), sysdate(), '6b71ea9f-53c1-48ab-9139-84b6fea688bf', null, 'www.google.com');

-- Curso 3
INSERT INTO file(id, old_name, new_name, format, link, created_at, updated_at)
VALUES
('094825c4-ccf1-4111-9d31-359b7788b10e', 'video7.mp4', 'video7.mp4', 'mp4', 'video7.mp4', sysdate(), sysdate()),
('f888ae22-a541-463c-b461-24797778b13a', 'video8.mp4', 'video8.mp4', 'mp4', 'video8.mp4', sysdate(), sysdate()),
('39488e64-9ebc-47bc-b1ca-f2547d43507a', 'video109p4', 'video19mp4', 'mp4', 'video9.mp4', sysdate(), sysdate());

INSERT INTO content(id, title, description, content_type, created_at, updated_at, course_id, file_id, link)
VALUES
('8545d144-bfa8-45e0-8ce2-50d5c6019a95', 'Aula inicial', 'Aqui voce vai ver como sera a metodologia', 'VIDEO', sysdate(), sysdate(), '1cda99c5-9f63-4df4-bdfc-3520bd98d2a2', '094825c4-ccf1-4111-9d31-359b7788b10e', null),
('5f1ed083-f903-462b-aeec-36cfc1f01e4d', 'Metodologia', 'A metodologia de ensino do curso', 'VIDEO', sysdate(), sysdate(), '1cda99c5-9f63-4df4-bdfc-3520bd98d2a2', 'f888ae22-a541-463c-b461-24797778b13a', null),
('e705ac2c-fa57-4173-9b3d-8b18c8b7e437', 'Primeira aula', 'Nessa aula voce vai aprender os primeiros conceitos', 'VIDEO', sysdate(), sysdate(), '1cda99c5-9f63-4df4-bdfc-3520bd98d2a2', '39488e64-9ebc-47bc-b1ca-f2547d43507a', null),
('5101937f-a24f-40f0-b812-0a31d5f351ad', 'Primeira Prática', 'Nessa aula voce vai colocar em prática o que voce aprendeu', 'PRACTICAL', sysdate(), sysdate(), '1cda99c5-9f63-4df4-bdfc-3520bd98d2a2', null, 'http://google.com.br');

INSERT INTO student_course(student_id, course_id, isRated, score)
VALUES
('36a39c36-a2fa-4c3f-a805-3a000721d018', '72284e66-2116-4a3a-a8d8-b9466b3ee6de', false, 0),
('9008a0ef-fdff-4cea-9884-8cf5bc91c8ee', '97a0ebe4-c210-4031-bf9d-17cce5cb35be', false, 0),
('9008a0ef-fdff-4cea-9884-8cf5bc91c8ee', '6b71ea9f-53c1-48ab-9139-84b6fea688bf', true, 5),
('e78d4e78-f9db-453d-ac32-07292061e6b6', 'd2115140-3c6f-4e3d-8331-49c9a898a6e7', false, 0);

INSERT INTO finished_content(student_id, content_id, created_at, updated_at)
VALUES
('36a39c36-a2fa-4c3f-a805-3a000721d018', 'f31f237e-25db-4c4c-8c70-7b5faf050b83', sysdate(), sysdate()),
('36a39c36-a2fa-4c3f-a805-3a000721d018', 'bc54b5e3-0870-4d5c-b89c-6cbfb935a6c0', sysdate(), sysdate()),
('36a39c36-a2fa-4c3f-a805-3a000721d018', '8f2560bc-3ea8-45fd-8ebf-3b95d7ccc711', sysdate(), sysdate());

INSERT INTO translator_announcement(id, title, subtitle, description, price, phone, created_at, updated_at, user_id)
VALUES
('a8995bb8-4f93-4f45-83de-f00aa6ff95cd', 'Tradutor de inglês para reuniões remotas.', 'Disponivel para reuniões remotas.', 'Domino inglês completamente (fala e escrita) e estou disponível na parte da noite para reuniões remotas.', 80.00, '044912345678' , sysdate(), sysdate(), '36a39c36-a2fa-4c3f-a805-3a000721d018'),
('c3e44a66-10cb-4d3c-912e-3f2642ad7080', 'Tradutor de espanhol para videos ou encontros.', 'Me disponibilizo para traduções de legendas de video e encontros remotos', 'Disponivel todo fim de semana, horário à combinar', 100.00, '04411112222' , sysdate(), sysdate(), '48935754-9a97-40d8-b6b4-0a808597f314'),
('fa720314-d6e5-4c1c-8679-108e3c0bc613', 'Tradutor de italiano para viagens.', 'Disponivel para viajar junto a você e realizar traduções durante todo o seu percurso.', 'Se você pretende viajar para uma região onde o idioma predominante é o italiano, podemos combinar um valor e viajarmos juntos, prometo que você entenderá tudo o que for dito!', 400.00, '044999991111' , sysdate(), sysdate(), 'e78d4e78-f9db-453d-ac32-07292061e6b6'),
('5ad5f118-037c-4d81-b350-19bc11c790d6', 'Tradutora de ingles para jogos', 'Traduzo legendas, falas de personagens e todo o texto do seu jogo.', 'Sou formada em letras e adoro jogar em tempo livre, se você precisa de uma mãozinha com o seu jogo, conte comigo!', 80.00, '044122224444' , sysdate(), sysdate(), '9205972a-0f97-49e1-aca1-fc81da3ad3a9');

INSERT INTO language(id, name, created_at, updated_at, announcement_id, course_id)
VALUES
('277359aa-c55c-453a-8f0c-660156508762', 'INGLÊS', sysdate(), sysdate(), 'a8995bb8-4f93-4f45-83de-f00aa6ff95cd', null),
('8073d586-6c5b-4830-a394-0d7663c70de7', 'ENGLISH', sysdate(), sysdate(), '5ad5f118-037c-4d81-b350-19bc11c790d6', null),
('e93390a0-54f9-4d39-b5a5-59193488d2be', 'ESPANHOL', sysdate(), sysdate(), 'c3e44a66-10cb-4d3c-912e-3f2642ad7080', null),
('59ef5318-fb18-415f-aa8a-cff2b4f57dad', 'ITALIANO', sysdate(), sysdate(), 'fa720314-d6e5-4c1c-8679-108e3c0bc613', null);


-- INSERT INTO language(id, name, created_at, updated_at, announcement_id,) -- DEIXAR ANNOUNCEMENT_ID ID SER NULL E ADICIOANR COURSE_ID
-- VALUES('apdkaspdkaspodkopsa', null, sysdate(), sysdate(), '5ad5f118-037c-4d81-b350-19bc11c790d6');


