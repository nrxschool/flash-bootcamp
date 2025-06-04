---
marp: true
class: invert
---

# **Dia 3: Backend e a Persistência do Esforço**

- data: 04/05
- prof: Manoel Lúcio

---

## **1. Abertura**

**Hello Web3!**  
Nas aulas anteriores criamos o frontend e o smart contract.

Hoje vamos resolver um problema real: **como ler dados da blockchain de forma eficiente?**

A resposta está no backend + indexadores.

---

## **2. Programação do Dia**

1. Por que um dApp precisa de backend?
2. O que são logs e eventos?
3. Criar um indexador simples com Node.js
4. Armazenar tarefas em um banco (SQLite/Postgres)
5. Criar uma API GraphQL para servir os dados ao frontend

---

## **3. Introdução**

Blockchains não foram feitas para buscas complexas, filtros ou ordenações.

Precisamos de uma camada intermediária que:

- Ouça os eventos do contrato.
- Armazene os dados em um formato consultável.
- Exponha esses dados para o frontend.

---

## **4. Desafio Técnico**

Construir um indexador que:

- Escute os eventos `TaskCreated` e `TaskCompleted`
- Salve os dados das tarefas no banco
- Exponha uma API GraphQL com:

```graphql
query {
  tasks(
    where: { owner: "0xabc", status: "pending" | "done" }
  ) {
    id
    name
    description
    priority
    value
    createdAt
    dueDate
  }
}
```

---

## **5. Objetivo da Aula**

- Entender a arquitetura de um backend Web3
- Criar um listener de eventos usando `viem`
- Armazenar dados com Prisma + SQLite (Postgres)
- Criar uma API GraphQL para o frontend
- Simular um sistema real de leitura eficiente

---

## **6. Stack Recomendada**

- **viem**: para escutar os eventos
- **Prisma**: ORM para persistência
- **SQLite**: banco local simples (ou Postgres)
- **Express + Apollo Server**: para API GraphQL

---

## **7. Problemas Resolvidos**

- Consultas complexas (por status, prioridade, dono)
- Tempo real e performance no frontend
- Escalabilidade futura para feeds, dashboards, ranking

---

## **8. Recapitulação**

Hoje você aprendeu:

- O papel do backend em dApps
- Como escutar eventos com `viem`
- Como estruturar um banco com Prisma
- Como criar uma API GraphQL
- Como conectar o frontend com o backend

---

## **9. Lição de Casa**

### Desafio de Aprendizagem

- Adicione novos filtros na API: Métricas agregadas (total staked, tarefas concluídas)

### Desafio de Carreira

- Poste um print da sua API funcionando com #nearxflash

---

## **10. Próximos Passos**

**Lançamento**

- Testes de integração usando jest e2e
- Deploy do contrato em testnet (sepolia)
- Deploy do backend na vercel
- Integração do frontend + backend + smartcontracts

_"Missão quase cumprida. Agora é com você!"_
