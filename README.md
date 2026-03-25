# 🧩 Task Module - DDD + Clean Architecture

Este projeto implementa um módulo de gerenciamento de tarefas (**Tasks**) seguindo princípios de:

* Domain-Driven Design (DDD)
* Clean Architecture
* TypeScript com NestJS
* Boas práticas de validação e tratamento de erros

---

## 🚀 Tecnologias

* Node.js
* TypeScript
* NestJS
* Jest (testes)
* Swagger (documentação)

---

## 📐 Arquitetura

O projeto foi estruturado com separação clara de responsabilidades:

```
src/
 ├── domain/        # Entidades, enums e regras de negócio
 ├── application/   # Use cases (casos de uso)
 ├── infra/         # Implementações (repository)
 ├── presentation/  # Controllers e DTOs
 ├── shared/        # Utilitários (Either)
```

---

## 🧠 Decisões de Arquitetura

### 🟢 Uso de In-Memory Repository

Foi utilizado um repositório em memória (`InMemoryTaskRepository`) ao invés de banco de dados.

**Motivo:**

* O desafio não exige persistência real
* Foco em arquitetura e domínio
* Evita complexidade desnecessária (Docker, banco, migrations)

👉 Em um cenário real, essa implementação poderia ser substituída facilmente por:

* Prisma
* TypeORM
* MongoDB

Sem alterar os use cases, graças à abstração via interface do repository.

---

### 🟡 Organization Mockada

O `organizationId` não é enviado no request.

**Motivo:**

* Em sistemas reais, esse dado vem de:

  * autenticação (JWT)
  * contexto do usuário (multi-tenant)

**Solução adotada:**

```ts
const organizationId = 'default-org-id'
```

👉 Isso simula um ambiente multi-tenant sem adicionar complexidade de autenticação.

---

### 🔵 Either Pattern

Foi utilizado o padrão **Either** para tratamento de erros:

* `left` → erro
* `right` → sucesso

**Benefícios:**

* Evita uso de exceptions descontroladas
* Torna o fluxo explícito
* Facilita testes

---

## ▶️ Como rodar o projeto

### 📦 Instalar dependências

```bash
npm install
```

---

### 🚀 Rodar a aplicação

```bash
npm run start:dev
```

A API estará disponível em:

```
http://localhost:3000
```

---

### 📚 Swagger (Documentação)

Após iniciar a aplicação, acesse:

```
http://localhost:3000/api/docs
```

---

### 🧪 Rodar os testes

```bash
npm run test
```

---

## 📡 Endpoints

### ➕ Criar tarefa

**POST** `/api/v1/tasks`

#### Body:

```json
{
  "title": "Implement feature X",
  "description": "Optional description",
  "assigneeId": "user-123",
  "priority": "HIGH",
  "dueDate": "2026-03-30T23:59:59Z"
}
```

---

### 🔄 Atualizar status

**PATCH** `/api/v1/tasks/:id/status`

#### Body:

```json
{
  "status": "IN_PROGRESS"
}
```

---

## 🧪 Testes implementados

* ✔ Criação de tarefa (sucesso e erro)
* ✔ Validação de regras de domínio
* ✔ Transição de status
* ✔ Casos de erro (status inválido e task inexistente)

---

## 🏁 Conclusão

Este projeto demonstra:

* Separação clara de responsabilidades
* Regras de negócio centralizadas no domínio
* Tratamento de erros consistente com Either Pattern
* Código limpo, tipado e testável
* Estrutura pronta para evolução (ex: integração com banco de dados)

---
