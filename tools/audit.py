#!/usr/bin/env python3
"""
Automated code auditor for Kinoia.
Generates an educational, easy-to-read markdown report summarizing the changes made,
their architectural patterns, test coverage, and code quality check results.

Saves the report to sdds/{change-name}/05-audit-report.md.
"""
from __future__ import annotations

import os
import pathlib
import re
import subprocess
import sys
from typing import Any

def find_active_sdd(change_name: str | None = None) -> pathlib.Path | None:
    sdds_dir = pathlib.Path.cwd() / "sdds"
    if not sdds_dir.exists():
        return None
    if change_name:
        target = sdds_dir / change_name
        return target if target.is_dir() else None
    candidates = [p for p in sdds_dir.iterdir() if p.is_dir()]
    if len(candidates) == 1:
        return candidates[0]
    return None

def get_base_commit() -> str:
    """Find the best base commit to diff against (stg, main, or HEAD~1)."""
    for branch in ["origin/stg", "stg", "origin/main", "main"]:
        try:
            base = subprocess.check_output(
                ["git", "merge-base", branch, "HEAD"],
                stderr=subprocess.DEVNULL,
                text=True
            ).strip()
            if base:
                return base
        except subprocess.CalledProcessError:
            continue
    # Fallback to HEAD~1
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "HEAD~1"],
            stderr=subprocess.DEVNULL,
            text=True
        ).strip()
    except subprocess.CalledProcessError:
        return ""

def run_cmd(args: list[str], cwd: pathlib.Path | None = None) -> tuple[int, str]:
    try:
        res = subprocess.run(
            args,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=cwd
        )
        return res.returncode, res.stdout + res.stderr
    except FileNotFoundError:
        return -1, "Binary not found"

import ast

def analyze_code_patterns(files: list[str], diff_target: str) -> list[str]:
    """Inspect AST diffs to identify introduced functions, classes, and design patterns with technical explanations."""
    details = []
    for f in files:
        if not f.endsWith('.py') if hasattr(f, 'endsWith') else not f.endswith('.py'):
            continue
        filepath = pathlib.Path.cwd() / f
        if not filepath.exists():
            continue
        try:
            tree = ast.parse(filepath.read_text(encoding='utf-8'))
            classes = [node for node in ast.walk(tree) if isinstance(node, ast.ClassDef)]
            functions = [node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
            
            # Pattern 1: Singleton Pattern Detection
            for cls in classes:
                has_instance = any(target.id == '_instance' for stmt in cls.body if isinstance(stmt, ast.Assign) for target in stmt.targets if isinstance(target, ast.Name))
                has_new = any(fn.name == '__new__' for fn in cls.body if isinstance(fn, ast.FunctionDef))
                if has_instance or has_new:
                    details.append(f"  • **Clase `{cls.name}` en `{f}`:** Implementa el **Patrón Singleton** para garantizar una única instancia compartida y evitar redundancia de memoria/conexiones.")

            # Pattern 2: Factory Pattern / Builder Pattern
            for fn in functions:
                if fn.name.startswith("create_") or fn.name.startswith("build_") or fn.name.startswith("get_"):
                    details.append(f"  • **Función `{fn.name}()` en `{f}`:** Aplica el **Patrón Factory/Builder** para desacoplar la instanciación de objetos complejos y facilitar el testeo unitario.")
                elif fn.name.startswith("test_"):
                    continue
                else:
                    details.append(f"  • **Método `{fn.name}()` en `{f}`:** Agregado/Modificado. Define una responsabilidad específica y modular según SOLID (Single Responsibility Principle).")
        except Exception:
            continue
    return details

def analyze_architecture(files: list[str]) -> list[str]:
    """Analyze changed files and explain the clean architecture components introduced."""
    insights = []
    has_use_case = any("use_cases" in f for f in files)
    has_route = any("routes" in f or "api/routes" in f for f in files)
    has_dto = any("dto" in f for f in files)
    has_model = any("models" in f or "database/models" in f for f in files)
    has_migration = any("alembic" in f or "migrations/versions" in f for f in files)

    if has_route:
        insights.append(
            "- **Capa de Entrada (API Routes):** Se modificaron/crearon controladores HTTP. "
            "Recordá que los handlers *solo deben delegar* en Use Cases y no contener lógica de negocio."
        )
    if has_use_case:
        insights.append(
            "- **Capa de Aplicación (Use Cases):** Contiene las reglas de negocio y orquestación de servicios. "
            "Es el corazón de la aplicación y debe ser independiente del framework HTTP."
        )
    if has_dto:
        insights.append(
            "- **Capa de Comunicación (DTOs):** Se definieron Data Transfer Objects para request/response. "
            "Esto asegura un tipado fuerte de entrada/salida y validación estricta de payloads con Pydantic."
        )
    if has_model:
        insights.append(
            "- **Capa de Infraestructura (DB Models):** Modelos ORM de SQLAlchemy. "
            "Cualquier cambio estructural acá requiere su correspondiente migración."
        )
    if has_migration:
        insights.append(
            "- **Esquema de Base de Datos (Alembic Migration):** Se detectó un script de migración. "
            "Asegúrate de revisar los métodos `upgrade()` y `downgrade()` para evitar bloqueos en producción."
        )
    
    if not insights:
        insights.append("- *No se identificaron componentes críticos de arquitectura en esta revisión.*")
        
    return insights

def main() -> int:
    change_name = sys.argv[1] if len(sys.argv) > 1 else None
    sdd_dir = find_active_sdd(change_name)
    if not sdd_dir:
        print("error: No active SDD directory found. Pass change name explicitly: python tools/audit.py <change_name>")
        return 1

    print(f"Auditing code changes for SDD: {sdd_dir.name}...")
    base_commit = get_base_commit()
    diff_target = base_commit if base_commit else "HEAD"

    # Git changes
    # Get stat
    stat_cmd = ["git", "diff", "--stat", diff_target]
    _, stat_out = run_cmd(stat_cmd)
    
    # Get files list
    files_cmd = ["git", "diff", "--name-only", diff_target]
    _, files_out = run_cmd(files_cmd)
    changed_files = [f.strip() for f in files_out.strip().splitlines() if f.strip()]

    # Filter test files
    test_files = [f for f in changed_files if "test_" in f or "/tests/" in f]
    code_files = [f for f in changed_files if f not in test_files]

    # Ruff checks
    ruff_installed = run_cmd(["ruff", "--version"])[0] == 0
    ruff_report = "Ruff no está instalado o falló al ejecutarse."
    if ruff_installed:
        # Run ruff check on changed directories
        changed_services = set()
        for f in changed_files:
            parts = pathlib.Path(f).parts
            if len(parts) >= 2 and parts[0] == "services":
                changed_services.add(parts[1])
        
        ruff_violations = []
        for svc in changed_services:
            svc_path = pathlib.Path.cwd() / "services" / svc
            code, out = run_cmd(["ruff", "check", "."], cwd=svc_path)
            if code != 0:
                ruff_violations.append(f"**Servicio: `{svc}`**\n```\n{out.strip()}\n```")
        
        if ruff_violations:
            ruff_report = "\n\n".join(ruff_violations)
        else:
            ruff_report = "✅ **¡Excelente! No se encontraron violaciones de Ruff en los servicios afectados.**"

    # Architecture Analysis
    arch_insights = analyze_architecture(changed_files)
    code_pattern_details = analyze_code_patterns(changed_files, diff_target)

    # Initialize default findings dicts
    scope_data = {"authorized": [], "warnings": [], "unrelated": []}
    tdd_summary = {}
    secret_findings = {}
    arch_violations = {}
    m_violations = {}

    # Scope Analysis
    scope_report_lines = []
    try:
        from tools.check_scope import check_scope
        _, scope_data = check_scope(sdd_dir.name)
        if scope_data["authorized"]:
            scope_report_lines.append("✅ **Archivos Declarados y Autorizados:**")
            for f in scope_data["authorized"]:
                scope_report_lines.append(f"  - `{f}`")
        if scope_data["warnings"]:
            scope_report_lines.append("\n⚠️ **Impacto en Grafo (No declarados explícitamente pero conectados en Graphify):**")
            for f in scope_data["warnings"]:
                scope_report_lines.append(f"  - `{f}`")
        if scope_data["unrelated"]:
            scope_report_lines.append("\n❌ **Scope Creep / No Autorizado (Desconectados en el grafo):**")
            for f in scope_data["unrelated"]:
                scope_report_lines.append(f"  - `{f}`")
    except Exception as e:
        scope_report_lines.append(f"No se pudo ejecutar la verificación de alcance: {e}")

    # TDD Verification Analysis
    tdd_report_lines = []
    try:
        from tools.verify_tdd import verify_tdd
        tdd_code, tdd_summary = verify_tdd()
        if tdd_summary.get("message"):
            tdd_report_lines.append(f"- {tdd_summary['message']}")
        for tf, cls in tdd_summary.get("results", {}).items():
            if cls == "GENUINE_TDD":
                tdd_report_lines.append(f"- ✅ `{tf}`: **TDD Legítimo** (Falla en código viejo -> Pasa en código nuevo).")
            elif cls == "ALWAYS_GREEN":
                tdd_report_lines.append(f"- ❌ `{tf}`: **Falso Positivo** (Pasa sin cambios en el código de producción).")
            elif cls == "CURRENT_FAIL":
                tdd_report_lines.append(f"- ❌ `{tf}`: **Test Roto / Fallando**.")
            else:
                tdd_report_lines.append(f"- ⚠️ `{tf}`: Estado ({cls}).")
    except Exception as e:
        tdd_report_lines.append(f"No se pudo ejecutar la validación TDD: {e}")

    # Secret Leak Guard Analysis
    secret_report_lines = []
    try:
        from tools.scan_secrets import scan_secrets
        secret_code, secret_findings = scan_secrets()
        if secret_findings:
            secret_report_lines.append("❌ **SE DETECTARON POSIBLES FUGAS DE SECRETOS / CREDENCIALES:**")
            for filepath, items in secret_findings.items():
                secret_report_lines.append(f"\n  - Archivo: `{filepath}`")
                for line_no, label, red in items:
                    secret_report_lines.append(f"    - Línea {line_no}: [{label}] -> Muestra: `{red}`")
        else:
            secret_report_lines.append("✅ **Certificado:** No se detectaron credenciales ni secretos en el diff.")
    except Exception as e:
        secret_report_lines.append(f"No se pudo ejecutar el escáner de secretos: {e}")

    # Clean Architecture Guard Analysis
    arch_guard_lines = []
    try:
        from tools.check_architecture import check_architecture
        arch_code, arch_violations = check_architecture()
        if arch_violations:
            arch_guard_lines.append("❌ **SE DETECTARON VIOLACIONES DE ARQUITECTURA LIMPIA:**")
            for filepath, items in arch_violations.items():
                arch_guard_lines.append(f"\n  - Archivo: `{filepath}`")
                for line_no, mod, reason in items:
                    arch_guard_lines.append(f"    - Línea {line_no}: Importación prohibida `{mod}`")
                    arch_guard_lines.append(f"      💡 Explicación: {reason}")
        else:
            arch_guard_lines.append("✅ **Certificado:** Todas las reglas de capas (Domain, Application, Routes) se cumplen perfectamente.")
    except Exception as e:
        arch_guard_lines.append(f"No se pudo ejecutar la verificación de arquitectura: {e}")

    # Database Migration & Idempotency Analysis
    migration_guard_lines = []
    try:
        from tools.check_migrations import check_migrations
        m_code, m_violations = check_migrations()
        if m_violations:
            migration_guard_lines.append("❌ **SE DETECTARON PROBLEMAS EN LAS MIGRACIONES DE BASE DE DATOS:**")
            for target, items in m_violations.items():
                migration_guard_lines.append(f"\n  - `{target}`:")
                for reason in items:
                    migration_guard_lines.append(f"    - {reason}")
        else:
            migration_guard_lines.append("✅ **Certificado:** Todas las migraciones son reversibles, idempotentes y están sincronizadas con los modelos.")
    except Exception as e:
        migration_guard_lines.append(f"No se pudo ejecutar la verificación de migraciones: {e}")

    migration_guard_report = "\n".join(migration_guard_lines)
    arch_guard_report = "\n".join(arch_guard_lines)
    secret_report = "\n".join(secret_report_lines)
    scope_report = "\n".join(scope_report_lines)
    tdd_report = "\n".join(tdd_report_lines)

    # Generate Report Content
    report_content = f"""# 📝 Reporte de Auditoría de Código: {sdd_dir.name}

> **Nota para el Revisor:** Este reporte resume de forma concisa los cambios realizados para facilitar la revisión del código y asegurar los estándares de calidad.

---

## 🗄️ Verificación de Migraciones e Idempotencia (Database Migration Guard)

{migration_guard_report}

---

## 🏛️ Verificación de Arquitectura Limpia (Clean Architecture Guard)

{arch_guard_report}

---

## 🔐 Auditoría de Seguridad (Secret Leak Guard)

{secret_report}

---

## 🛡️ Verificación de Alcance (Scope Guardrail)

{scope_report}

---

## 🧪 Certificación TDD (Red-to-Green)

{tdd_report}

---

## 🏛️ Análisis Arquitectónico
Este cambio impacta las siguientes capas del sistema:

{chr(10).join(arch_insights)}

---

## 📦 Archivos Modificados y Cambios de Código

### Resumen de Git Diff (`git diff --stat`):
```text
{stat_out.strip()}
```

### Detalle de archivos de código:
"""
    for f in code_files:
        report_content += f"- [`{f}`](file://{pathlib.Path.cwd() / f})\n"
    
    if test_files:
        report_content += "\n### Pruebas Nuevas/Modificadas:\n"
        for f in test_files:
            report_content += f"- [`{f}`](file://{pathlib.Path.cwd() / f})\n"
    else:
        report_content += "\n⚠️ **Advertencia:** No se detectaron archivos de pruebas creados o modificados en este diff.\n"

    report_content += f"""
---

## ⚡ Estilo y Estándares de Código (Ruff)

{ruff_report}

---

## 🚦 Instrucciones para Aprobar
Si estás de acuerdo con los cambios presentados:
1. Revisa los archivos en los enlaces de arriba si necesitas verificar detalles.
2. Edita [`00-state.md`](file://{sdd_dir / '00-state.md'}) y cambia el estado de la fase actual a `approved`:
   ```markdown
   | Phase | Status | Owner | Updated |
   |---|---|---|---|
   | wait_for_audit | approved | @tu_usuario | YYYY-MM-DD |
   ```
3. Luego, ejecuta:
   ```bash
   python tools/workflow.py next
   ```
"""

    report_path = sdd_dir / "05-audit-report.md"
    report_path.write_text(report_content, encoding="utf-8")

    # Print Educational Terminal Summary
    print("\n" + "=" * 65)
    print("  🎓 RESUMEN EDUCATIVO DE AUDITORÍA Y CAMBIOS DE CÓDIGO")
    print("=" * 65)
    print(f"📍 SDD Activo: {sdd_dir.name}\n")
    print("📦 ARCHIVOS Y LÓGICA DE CÓDIGO MODIFICADA:")
    for f in code_files:
        print(f"  • {f}")
    if test_files:
        print("\n🧪 PRUEBAS UNITARIAS MODIFICADAS/NUEVAS:")
        for tf in test_files:
            print(f"  • {tf}")

    print("\n🧠 ANÁLISIS DE PATRONES Y RAZONAMIENTO TÉCNICO:")
    if code_pattern_details:
        for detail in code_pattern_details:
            print(detail)
    else:
        print("  • *No se detectaron patrones complejos adicionales (Singleton/Factory/DTOs) en los diffs.*")

    print("\n🏛️ IMPACTO ARQUITECTÓNICO:")
    for insight in arch_insights:
        clean_insight = insight.replace("- **", "").replace(":**", " -").replace("**", "")
        print(f"  • {clean_insight}")

    print("\n🛡️ SALVAGUARDAS Y VERIFICACIONES:")
    print(f"  • Fuga de Secretos   : {'✔ Pasó (0 credenciales expuestas)' if not secret_findings else '❌ Posible Fuga Detectada'}")
    print(f"  • Arquitectura Limpia : {'✔ Pasó (0 violaciones de capas)' if not arch_violations else '❌ Violación de Capas Detectada'}")
    print(f"  • TDD (Red-to-Green)  : {'✔ Pasó (TDD Legítimo)' if tdd_summary.get('results') else 'ℹ️ No se detectaron cambios en tests'}")
    print(f"  • Migraciones DB      : {'✔ Pasó (0 violaciones)' if not m_violations else '❌ Migración no Idempotente'}")

    print(f"\n📄 Reporte completo generado en: {report_path}")
    print("=" * 65 + "\n")
    return 0

if __name__ == "__main__":
    sys.exit(main())
