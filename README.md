# PM-SYS/BE — Project & Budget Tracking System Backend

Enterprise-level project management and budget tracking backend built on FastAPI using a clean layered modular architecture.

## 📁 Directory Structure
Each module under `app/modules/` follows this standard enterprise template structure:
```
module_name/
├── config/           # Module-specific config and settings
├── controllers/      # Routers and controllers (thin API layer)
├── models/           # SQLAlchemy models / Database entities
├── repositories/     # Data-access repositories (no SQL leak to services)
├── schemas/          # Pydantic input/output validation schemas
└── services/         # Core business logic
```

For instance, this structure applies to:
- `departments` (MOD-01)
- `budgets` (MOD-02)
- `projects` (MOD-03)
- `tasks` (MOD-04)
- `work_orders` (MOD-05)
- `attendance` (MOD-06)
- `performance_reviews` (MOD-07)
- `payroll` (MOD-08)
- `audit_trail` (MOD-09)
- `reporting` (MOD-10)
- `auth` (MOD-11)
- `users` (MOD-12)
- `notifications` (MOD-13)
- `file_storage` (MOD-14)
- `realtime` (MOD-15)
- `core` (MOD-16)

---

## 📝 TODO Implementation Checklist
- [ ] **Database & Session Plumbing**:
  - Implement base schema models inside `app/core/`.
  - Connect SQLAlchemy async engine, configure Alembic for automated migrations.
- [ ] **Automated Table Creation / Component Scan**:
  - Activate `Base.metadata.create_all` database binding logic inside `app/main.py`.
  - Implement the recursive component scanning method inside `register_controllers` to auto-discover routers inside any sub-module's `controllers/` directory.
- [ ] **Domain Module Implementations**:
  - Implement models and repositories for `users`, `departments`, `projects`, `budgets`.
  - Build services with budget allocation caps.
  - Implement work order tracking, developer attendance logs, and performance metrics.
- [ ] **Hardening & Security**:
  - Integrate JWT tokens (access + refresh keys) with dependency-injection role guards.
  - Set up slowapi rate limiters, Celery background tasks, and structured logging.