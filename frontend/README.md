
# SmartProcure

### Agentic AI-Based Intelligent Procurement Decision Support and Vendor Evaluation System

SmartProcure is an intelligent procurement management system designed to streamline purchase requests, RFQ management, vendor quotation comparison, and procurement decision-making. The project aims to integrate a coordinated multi-agent AI workflow to assist procurement officers and managers in evaluating vendor proposals using requirement compliance, pricing, delivery timelines, budget constraints, and risk-related factors.

**Project Status:** Frontend Development in Progress

---

## Overview

Traditional procurement workflows often involve manual request reviews, quotation comparisons, and fragmented decision-making. SmartProcure aims to bring these activities into a unified platform with role-specific interfaces and AI-assisted evaluation.

The system is being developed incrementally, beginning with the React frontend and demonstration workflows. Backend services, persistent database storage, and actual AI-agent execution are planned for subsequent development phases.

## Current Implementation

The frontend currently includes the following implemented or partially implemented features:

- **Role-Based Interfaces:** Demo access for Employee, Procurement Officer, Procurement Manager, Vendor, and Admin roles.
- **Purchase Request Management:** Request creation, listing, details, editing, cancellation, and status tracking.
- **Request Review Workflow:** Officer actions to approve, reject, or request revisions, with feedback available to employees.
- **Vendor and RFQ Management:** Vendor listings, RFQ creation, request linkage, and RFQ status management.
- **Quotation Comparison:** Demonstration quotations compared by price, delivery time, and budget eligibility.
- **Five-Agent Evaluation Preview:** A simulated evaluation workflow presenting findings for requirement analysis, vendor evaluation, budget analysis, risk analysis, and recommendations.
- **Recommendation Summary:** A demonstration recommendation with supporting comparison details for review.
- **Order Tracking Interface:** Sample purchase-order and delivery-status information for demonstrating the planned workflow.
- **Local Demo Data:** Browser `localStorage` is used by mock services to retain supported demonstration records.

Implementation varies by module. Some screens and workflows remain in development, and not all features are connected end to end.

## Planned AI-Agent Architecture

SmartProcure is designed around five cooperating AI agents:

| Agent | Planned Responsibility |
|---|---|
| Requirement Analysis Agent | Compare purchase requirements with vendor quotation specifications. |
| Vendor Evaluation Agent | Assess vendor proposals using relevant evaluation criteria and available vendor information. |
| Budget Analysis Agent | Analyze quoted prices against the allocated procurement budget. |
| Risk Analysis Agent | Identify potential procurement risks and concerns requiring review. |
| Recommendation Agent | Consolidate evaluation findings into a recommendation for the Procurement Manager. |

The planned workflow will connect these agents through an orchestrated evaluation process. Their outputs will support human decision-making rather than automatically replacing procurement approvals.

**Current limitation:** The five-agent evaluation displayed in the frontend is simulated. Actual AI execution, agent orchestration, and backend integration have not yet been implemented.

## Intended Procurement Workflow

1. An employee creates and submits a purchase request.
2. A Procurement Officer reviews the request and approves, rejects, or requests a revision.
3. An approved request is used to create a Request for Quotation (RFQ).
4. Invited vendors submit quotations against the RFQ.
5. The Procurement Officer initiates quotation evaluation.
6. The planned multi-agent workflow analyzes the requirements, quotations, budget, vendor information, and potential risks.
7. The Procurement Manager reviews the recommendation and makes the final approval decision.
8. Following approval, the procurement process proceeds to vendor selection and purchase-order creation.
9. Order status and delivery progress can be tracked through the relevant interfaces.

This is the intended end-to-end workflow; some transitions are not yet connected in the current frontend.

## Technology Stack

### Implemented Frontend

- **React.js** — Component-based user interface
- **Vite** — Development server and build tooling
- **React Router** — Client-side navigation
- **Tailwind CSS** — Interface styling
- **Lucide React** — Icons
- **JavaScript** — Frontend logic
- **Browser localStorage** — Mock data persistence

### Planned Backend and AI Services

- **Java Spring Boot** — Backend APIs and business logic
- **PostgreSQL** — Relational database
- **Python FastAPI** — AI service endpoints
- **LangGraph** — Multi-agent workflow orchestration

The planned technologies are targets for future integration, not a claim that these services are currently running.

## Project Structure

The frontend is organized around pages, reusable components, layouts, and mock services.

```text
SmartProcure/
├── public/
├── src/
│   ├── components/      # Shared interface components
│   ├── context/         # Demo role and authentication context
│   ├── layouts/         # Application layouts
│   ├── pages/           # Procurement screens and workflows
│   ├── services/
│   │   └── mock/        # Mock procurement data services
│   ├── styles/          # Additional stylesheets
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

The structure may evolve as shared evaluation services, backend API clients, and additional modules are introduced.

## Getting Started

### Prerequisites

- Node.js (a current LTS version is recommended)
- npm
- Git

### Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/ayushgunjal2415/SmartProcure.git
   ```

2. Enter the project directory:

   ```bash
   cd SmartProcure
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the Vite development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, typically:

   `http://localhost:5173/`

## Development Roadmap

### Phase 1 — Frontend Foundation
- [x] React and Vite project setup
- [x] Role-specific demo navigation
- [x] Initial procurement request workflows
- [x] Request review and revision feedback
- [x] RFQ and quotation demonstration data
- [x] Quotation comparison and simulated evaluation interface
- [x] Initial order-tracking interface

### Phase 2 — Procurement Workflow Integration
- [ ] Shared evaluation service and persistent demo evaluation records
- [ ] Connect Officer evaluation submission to the Manager approval queue
- [ ] Implement Manager approval, rejection, and reevaluation decisions
- [ ] Add Manager evaluation decision history
- [ ] Connect approved evaluations to the purchase-order workflow
- [ ] Complete vendor quotation submission and remaining role-specific screens
- [ ] Test end-to-end frontend workflows and data consistency

### Phase 3 — Backend and Database
- [ ] Develop Spring Boot REST APIs
- [ ] Design and integrate the PostgreSQL database
- [ ] Implement persistent procurement, vendor, quotation, and evaluation records
- [ ] Add API validation, error handling, and role-based authorization
- [ ] Replace mock service calls with backend API integration

### Phase 4 — AI-Agent Integration
- [ ] Develop AI service endpoints using Python FastAPI
- [ ] Implement the five planned procurement agents
- [ ] Orchestrate agent execution using LangGraph
- [ ] Connect agent outputs to the quotation evaluation workflow
- [ ] Add structured evaluation results, traceable reasoning, and failure handling
- [ ] Validate recommendations against sample procurement scenarios

### Phase 5 — Testing and Finalization
- [ ] Test role-based access and procurement workflow transitions
- [ ] Validate budget calculations and quotation comparisons
- [ ] Test backend APIs and database operations
- [ ] Evaluate AI-agent outputs against defined scenarios
- [ ] Improve usability, documentation, and deployment readiness

*Roadmap items will be marked complete as they are implemented and verified.*

## Development Approach

The project follows an incremental development approach:

1. Build and refine the frontend.
2. Connect related workflows through shared mock services.
3. Integrate backend APIs and database persistence.
4. Implement and orchestrate AI agents.
5. Test the complete workflow before finalization.

This approach allows individual modules to be demonstrated and tested before the complete system is integrated.

## Academic Project Disclaimer

SmartProcure is an academic project under active development. Demonstration data, simulated AI findings, and sample order records are used to illustrate the proposed functionality. They do not represent verified vendor assessments or production procurement decisions.

## Contributors

Add the project team members and their contributions here.

---

**SmartProcure — Making procurement workflows more structured, transparent, and data-driven.**
