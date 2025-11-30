# Mini Inbox - Desafio Técnico

Sistema de gerenciamento de tickets de suporte com dashboard de métricas e automação via webhook.

## 📦 Stack

- **Backend**: Python FastAPI + SQLite
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Data**: Pandas ETL com dataset do Hugging Face
- **Automação**: n8n webhook

## ✅ MVP Funcional

### Backend
- `GET /tickets` - Lista todos os tickets
- `PATCH /tickets/{id}` - Atualiza status ou prioridade de um ticket
- `GET /metrics` - Retorna métricas processadas pelo ETL

### Frontend
- `/dashboard` - Dashboard com métricas visuais (total de tickets, prioridades, tipos, filas, idiomas)
- `/tickets` - Lista de tickets com busca e filtros
- `/tickets/[id]` - Detalhes do ticket com ações de edição

### Data
- Script ETL que processa dataset de tickets de suporte
- Gera métricas agregadas em JSON para consumo da API

### n8n
- Webhook ativado quando ticket vira `status=closed` ou `priority=high`
- Loga informações e retorna confirmação

## 🚀 Como Rodar (Docker Compose - Recomendado)

### Pré-requisitos
- Docker e Docker Compose instalados
- Pelo menos 2GB de RAM disponível
- Porta 3000, 8000 e 5678 livres

### Iniciar todos os serviços

1. Clone ou baixe o repositório.
2. Navegue até a pasta raiz do projeto.
3. Execute o comando:

```bash
docker-compose up --build
```

Isso irá:
- Construir as imagens Docker para backend, frontend, data-etl e n8n
- Iniciar os containers:
  - **Backend** (FastAPI): http://localhost:8000
  - **Frontend** (Next.js): http://localhost:3000
  - **n8n**: http://localhost:5678
  - **data-etl**: Executa uma vez para baixar o dataset e gerar as métricas
- Aguardar alguns minutos para o primeiro build e download do dataset (~5000 tickets)

### Verificar se tudo está rodando

- Acesse http://localhost:3000 para o frontend
- Acesse http://localhost:8000/docs para a documentação da API FastAPI
- Acesse http://localhost:5678 para o n8n

### Parar os serviços

```bash
docker-compose down
```

Para remover volumes e imagens (limpar completamente):

```bash
docker-compose down -v --rmi all
```

## 🛠️ Como Rodar Localmente (Sem Docker)

### Pré-requisitos
- Python 3.9+ instalado
- Node.js 18+ e npm instalados
- Git instalado (opcional, para clonar o repo)

### 1. Backend (FastAPI + SQLite)

1. Navegue para a pasta backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Execute o servidor:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. Verifique: Acesse http://localhost:8000/docs para a documentação interativa da API.

O backend criará automaticamente o banco SQLite e inserirá 20 tickets de seed na primeira execução.

### 2. Frontend (Next.js)

1. Em um novo terminal, navegue para a pasta frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Verifique: Acesse http://localhost:3000

### 3. Data Processing (Pandas ETL)

1. Em um novo terminal, navegue para a pasta data:
   ```bash
   cd data
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Execute o script ETL:
   ```bash
   python etl.py
   ```

Isso baixará ~5000 tickets do dataset do Hugging Face e gerará o arquivo `data/processed/metrics.json`, que será consumido pelo endpoint `/metrics` do backend.

### 4. n8n (Automação Webhook - Opcional)

1. Instale o n8n globalmente:
   ```bash
   npm install -g n8n
   ```

2. Inicie o n8n:
   ```bash
   n8n start
   ```

3. Acesse http://localhost:5678

4. Configure o login e senha manualmente (não é automático).

5. Importe o workflow: No menu lateral, vá para "Workflows" → "Add workflow" → "Import from File" → Selecione `n8n/workflow.json`.

6. Após importar, verifique o node "Webhook" e altere o método para POST manualmente (pode ter sido salvo como GET).

7. Ative o workflow clicando no botão "Active" no canto superior direito.

8. O webhook estará disponível em `http://localhost:5678/webhook/ticket-update`.

## 📊 Dataset

**Fonte**: [Hugging Face - Customer Support Tickets](https://huggingface.co/datasets/Tobi-Bueck/customer-support-tickets)

O dataset original está disponível no Kaggle: [Multilingual Customer Support Tickets](https://www.kaggle.com/datasets/tobiasbueck/multilingual-customer-support-tickets)

O script ETL baixa automaticamente via Hugging Face Datasets.

## 🔗 Webhook Payload

Quando um ticket é atualizado para `status=closed` ou `priority=high`, o backend envia automaticamente um webhook para o n8n:

**Endpoint**: `POST http://localhost:5678/webhook/ticket-update`

**Payload**:
```json
{
  "ticket_id": 1,
  "status": "closed",
  "priority": "high"
}
```

**Resposta esperada**:
```json
{
  "success": true,
  "message": "Ticket 1 updated successfully",
  "received": {
    "ticket_id": 1,
    "status": "closed",
    "priority": "high",
    "timestamp": "2025-11-30T18:45:00.000Z"
  }
}
```

## 📁 Estrutura do Projeto

```
/backend
├── main.py              # FastAPI app com endpoints e seeds
├── requirements.txt     # Dependências Python
├── Dockerfile          # Container do backend
└── db.sqlite           # Banco SQLite (gerado automaticamente)

/frontend
├── src/
│   ├── app/            # Pages (Next.js App Router)
│   │   ├── dashboard/  # Dashboard de métricas
│   │   ├── tickets/    # Lista e detalhes de tickets
│   │   └── layout.tsx  # Layout com sidebar
│   ├── components/     # Componentes reutilizáveis
│   └── lib/            # Types e utilities
├── package.json
└── Dockerfile          # Container do frontend

/data
├── raw/                # (Vazio - dataset baixado automaticamente)
├── processed/          # metrics.json (gerado pelo ETL)
│   └── metrics.json
├── etl.py              # Script de processamento
├── requirements.txt
└── Dockerfile          # Container do ETL

/n8n
├── workflow.json       # Workflow exportado do n8n
└── README.md           # Instruções de uso do webhook

docker-compose.yml      # Orquestração de todos os serviços
README.md               # Este arquivo
```

## 🎨 Design

- **Tema**: Dark mode (fundo preto, texto branco, accent azul)
- **Componentes**: Cards, tabelas responsivas, badges coloridos
- **Navegação**: Sidebar fixa com links para Dashboard e Tickets

## 📝 Notas

- O backend usa SQLite e insere 20 tickets de seed automaticamente na primeira execução
- O ETL baixa ~5000 tickets do Hugging Face e gera métricas agregadas
- O webhook do n8n pode não funcionar se o serviço n8n não estiver rodando (erro é ignorado silenciosamente)
- O login e senha do n8n precisam ser criados manualmente pelo usuário
- Todos os serviços estão configurados para rodar em modo de desenvolvimento com hot-reload

## 📸 Screenshots

Adicione aqui prints da interface para ilustrar o funcionamento:

- **Dashboard de Métricas**: Print da página `/dashboard` mostrando os cards e gráficos.
- **Lista de Tickets**: Print da página `/tickets` com a tabela e busca.
- **Detalhes do Ticket**: Print da página `/tickets/[id]` com os botões de edição.
- **Workflow n8n**: Print do n8n mostrando o workflow importado e ativo.

## 🧪 Testando o Sistema

1. Acesse http://localhost:3000/dashboard para ver as métricas agregadas do dataset.
2. Acesse http://localhost:3000/tickets para ver a lista de tickets com busca por texto.
3. Clique em "View Details" em qualquer ticket para ver os detalhes.
4. Mude o status para "Closed" ou a prioridade para "High" para testar o webhook.
5. Verifique os logs do n8n em http://localhost:5678 → Executions (se n8n estiver rodando).
6. Teste a API diretamente: `curl http://localhost:8000/tickets` para listar tickets.

---

Desenvolvido para o **Desafio Técnico Mini Inbox**