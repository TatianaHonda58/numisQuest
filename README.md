# 🧭 NumisQuest — API REST e Site Web de Numismática

## O que é esta aplicação

Uma plataforma interativa de numismática, com uma **API REST** e um **site Web**, criada para estudo e prática de desenvolvimento e testes de software.
---

## Regras de negócio

1. **Unicidade de Cadastro:** Não permite cadastrar dois exploradores com o mesmo e-mail ou nome de usuário (`username`). Em caso de duplicidade, a API retorna **HTTP 409**.
2. **Identificador de Moedas e Cédulas:** O endpoint `POST /api/items/identify` exige que ao menos **1 critério** seja preenchido (país, tipo, ano aproximado com margem de ±5 anos, valor facial, material, formato ou característica visual). Se todos os campos vierem vazios, retorna **HTTP 400**. As correspondências encontradas são ordenadas pelo percentual de compatibilidade.
3. **Progressão por Níveis de Experiência (XP):** Ao acertar desafios, o explorador acumula pontos (XP) e evolui automaticamente de nível:
   - *Explorador Iniciante:* `0` a `99` XP
   - *Curador de Museu:* `100` a `249` XP
   - *Mestre Numismata:* `250+` XP
4. **Idempotência de Desafios (Anti-Farm):** Cada desafio concluído só concede XP e medalhas uma única vez por usuário. Tentar enviar novamente uma resposta para um desafio já finalizado retorna HTTP 422. Respostas incorretas retornam HTTP 200 com acertou: false e pontosGanhos: 0, permitindo nova tentativa.


### Funcionalidades

A aplicação possui cinco funcionalidades principais:

| Funcionalidade | Site Web | API |
|---|---|---|
| **Login** | `/login` | `POST /api/auth/login` |
| **Cadastro** | `/cadastro` | `POST /api/auth/register` |
| **Catálogo de Moedas e Cédulas** | `/` (vitrine com filtros e ficha técnica) | `GET /api/items` e `GET /api/items/{id}` |
| **Identificador de Moedas** | `/identificador` | `POST /api/items/identify` |
| **Desafios e Conquistas** | `/desafios` | `GET /api/challenges` e `POST challenges/{id}/submit` |

### Tecnologias

- **Backend:** Node.js, Express, Mongoose, `mongodb-memory-server`, JWT (`jsonwebtoken`), `bcryptjs`
- **Documentação:** Swagger UI (`swagger-ui-express`) com especificação OpenAPI em `docs/swagger.yaml`
- **Frontend:** HTML5, CSS3 (tema Mapa do Tesouro) e JavaScript puro, servido pela própria API.

*Observação:* O banco de dados é em memória: toda vez que a aplicação é reiniciada, os dados voltam ao estado inicial ([src/database/seed.js](src/database/seed.js)).

## Como instalar

- Pré-requisitos: **Node.js 18 ou superior** e **npm**.

```bash
git clone <url-deste-repositorio>
cd cd numisquest
npm install
```

## Como executar

1. Instale as dependências:
```bash
npm install
```   

2. Inicie o servidor:
```bash
npm start
```

3. Para desenvolvimento, com reinício automático ao salvar arquivos:
```bash
npm run dev
```

4. A aplicação sobe na porta **3000**. Para usar outra porta:
 ```bash
PORT=4000 npm start
```   

5. Variáveis de ambiente opcionais:

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta HTTP da aplicação |
| `JWT_SECRET` | `numisquest-dev-secret` | Chave de assinatura dos tokens JWT |

## Dados de teste pré-cadastrados

Os dados são carregados automaticamente com 3 exploradores, 3 peças numismáticas e 3 desafios cada inicialização (src/database/seed.js).

### Exploradores (Usuários)

| Nome | Username | E-mail | Senha | Pontuação (XP) | Nível | Para que serve |
|---|---|---|---|---|---|---|
| Denise Moraes | `denise_exploradora` | `denise@email.com` | `123456` | 0 XP | Explorador Iniciante | Usuária nova, nenhum desafio concluído (ideal para testar progressão desde o início) |
| Felipe Santos | `felipe_curador` | `felipe@email.com` | `123456` | 125 XP | Curador de Museu | Usuário que concluiu 1 desafio e possui a medalha Primeiro Passo (bom para testar bloqueio HTTP 422 de desafio repetido) |
| Poliana Carvalho | `poliana_mestre` | `poliana@email.com` | `123456` | 275 XP | Mestre Numismata | Nível máximo alcançado e todas as 4 medalhas desbloqueadas |

### Peças do Catálogo

| Título | Tipo | País | Ano | Material | Código | Para que serve |
|---|---|---|---|---|---|---|
| 100 Réis - República Velha (1901) | Moeda | Brasil | 1901 | Cuproníquel | KM# 503 | Peça antiga de circulação comum; ótima para testar filtros por ano (`1901`) e material (`Cuproníquel`) |
| 1 Real - Entrega da Bandeira Olímpica (2012) | Moeda | Brasil | 2012 | Cuproníquel e Aço revestido de bronze (Bimetálica) | Y.REAL-BM-070 | Moeda comemorativa bimetálica; ótima para testar o Identificador por características visuais (`Bandeira Olímpica`) |
| 50.000 Cruzeiros Reais - Baiana (1994) | Cédula | Brasil | 1994 | Papel-moeda | P#241 | Única cédula do catálogo inicial; ideal para testar filtro por tipo (`Cédula`) e período (`Cruzeiro Real`) |

### Desafios

| Título | Categoria | Dificuldade | Recompensa | Medalha Associada | 
|---|---|---|---|---|
| Missão Diária: A Joia das Olimpíadas Rio 2016 | Missão Diária | Fácil | +25 XP | `primeiro_passo` (Primeiro Passo) |
| Desafio de Identificação: Peça Mistério de 1901 | Identificação | Médio | +50 XP | `olho_de_lince` (Olho de Lince) |
| Quiz Histórico: A Cédula da Baiana | Quiz | Médio | +50 XP | `historiador_numismatico` (Historiador Numismático) |

### Fórmula do índice de compatibilidade no Identificador:
```
compatibilidade (%) = arredondar((critérios_atendidos / critérios_informados) × 100)
```

- Exemplos com os dados de teste:

| Explorador | Ação | XP Anterior | Ganho | XP Final | Novo Nível / Resultado |
|---|---|---|---|---|---|
| Denise (`0 XP`) | Acerta Desafio 2 (+50 XP) | 0 XP | +50 XP | **50 XP** | Explorador *Iniciante* + Medalhas Primeiro Passo e Olho de Lince |
| Denise (`50 XP`) | Acerta Desafio 3 (+50 XP) | 50 XP | +50 XP | **100** XP | Evolui para *Curador de Museu* + Medalha Historiador Numismático |
| Felipe (`125 XP`) | Tenta refazer Desafio 1 | 125 XP | - | **125 XP** | Bloqueado com *HTTP 422* (desafio já concluído) |
|Poliana (`275 XP`) | Consulta perfil (`/api/users/me`) | 275 XP | - | **275 XP** | *Mestre Numismata* (todas as 4 medalhas desbloqueadas) |

### Acesse no navegador:
| Local | URL |
|---|---|
| Site Web (Catálogo de Moedas e Cédulas) | `http://localhost:3000` |
| Identificador de Moedas | `http://localhost:3000/identificador` |
| Desafios e Conquistas | `http://localhost:3000/desafios` |
| Login |  `http://localhost:3000/login` |
| Cadastro | `http://localhost:3000/cadastro` |
| API REST (base) | `http://localhost:3000/api` |
| Health check | `http://localhost:3000/api/health` |
| **Swagger UI** (documentação interativa) | `http://localhost:3000/api-docs` |
| Arquivo YAML da especificação | `http://localhost:3000/api-docs/swagger.yaml` |

### Endpoints da API

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| GET | `/api/health` | - | Verifica a disponibilidade da API |
| POST | `/api/auth/register` | - | Cadastra um novo explorador |
| POST | `/api/auth/login` | - | Faz login e retorna o token JWT |
| GET | `/api/users/me` | Bearer | Dados do explorador (XP, nível e quadro de medalhas) |
| GET | `/api/items` | - | Lista peças do catálogo com filtros (`tipo`, `pais`, `ano`, `material`, `q`) |
| GET | `/api/items/{id}` | - | Detalha a ficha técnica e histórica de uma peça |
| POST | `/api/items/identify` | - | Identifica peças por características físicas e visuais |
| GET | `/api/challenges` | Bearer | Lista desafios disponíveis e status de conclusão |
| POST | `/api/challenges/{id}/submit` | Bearer | Envia resposta (selectedOptionIndex), valida acerto e computa XP |
| PATCH | `/api/users/me` | Bearer | Atualiza nome ou username do explorador autenticado | `200`, `400`, `401`, `409` |
| DELETE | `/api/challenges/progress` | Bearer | Reseta XP, desafios concluídos e medalhas do explorador | `200`, `401`, `404` |

A especificação completa está em *docs/swagger.yaml*.

### Códigos de resposta

| Código | Quando acontece |
|---|---|
| `200` / `201` | Sucesso |
| `400` | Dados inválidos (campo obrigatório ausente, nenhum critério no identificador, índice de opção/ID inválido ou JSON malformado) |
| `401` | Token ausente/inválido ou e-mail/senha incorretos |
| `404` | Explorador, peça numismática ou desafio não encontrado |
| `409` | E-mail ou nome de usuário já cadastrado |
| `422` | Regra de negócio violada (tentativa de concluir novamente um desafio já finalizado) |

### Exemplo rápido com curl

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"denise@email.com","password":"123456"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl -s "http://localhost:3000/api/items?tipo=Moeda"

curl -s -X POST http://localhost:3000/api/items/identify \
  -H 'Content-Type: application/json' \
  -d '{"pais":"Brasil","material":"Cuproníquel","anoEmissao":1901}'

curl -s http://localhost:3000/api/challenges \
  -H "Authorization: Bearer $TOKEN"

curl -s -X POST http://localhost:3000/api/challenges/<id-do-desafio>/submit \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"selectedOptionIndex":1}'
  ```

## Estrutura do projeto

```
├── docs/swagger.yaml          # Especificação OpenAPI 3 da API
├── public/                    # Site Web (HTML, CSS, JS e imagens das peças)
│   ├── css/style.css          # Tema visual Mapa do Tesouro
│   ├── images/                # Fotografias de anverso e reverso das peças
│   ├── js/app.js              # Sessão JWT, cabeçalho dinâmico e helper de fetch
│   ├── index.html             # Catálogo de moedas e cédulas com filtros
│   ├── identificador.html     # Ferramenta de identificação por características
│   ├── desafios.html          # Quizzes, missões e quadro de medalhas
│   ├── login.html             # Tela de autenticação
│   └── cadastro.html          # Tela de cadastro de novo explorador
└── src/
    ├── server.js              # Sobe o MongoDB em memória, carrega os dados e inicia o servidor
    ├── app.js                 # Configuração do Express, rotas e Swagger UI
    ├── config/env.js          # Porta, JWT e parâmetros dos níveis de XP
    ├── database/              # Conexão (mongodb-memory-server) e dados de teste (seed.js)
    ├── models/                # User, Item e Challenge (Mongoose)
    ├── routes/                # index, auth, users, item e challenge
    ├── services/              # Lógica do Identificador de Moedas e da Gamificação
    └── middlewares/           # Autenticação JWT e tratamento centralizado de erros
```
