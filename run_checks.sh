#!/bin/bash
set -e

# ============================================
# Parse command line arguments
# ============================================
FIX_MODE=false
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --fix) FIX_MODE=true ;;
        -h|--help)
            echo "Usage: ./run_checks.sh [--fix]"
            echo ""
            echo "Options:"
            echo "  --fix    Auto-fix formatting and linting issues before checking"
            echo "  -h       Show this help message"
            exit 0
            ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
    shift
done

# ============================================
# Check for uv package manager FIRST
# ============================================
if ! command -v uv &> /dev/null; then
    echo "============================================"
    echo "uv is not installed - installing with pip..."
    echo "============================================"
    pip install uv

    # Verify installation worked
    if ! command -v uv &> /dev/null; then
        echo ""
        echo "ERROR: Failed to install uv with pip."
        echo ""
        echo "Try installing manually:"
        echo "  curl -LsSf https://astral.sh/uv/install.sh | sh"
        echo "  brew install uv  (macOS)"
        echo ""
        echo "See: https://docs.astral.sh/uv/getting-started/installation/"
        exit 1
    fi
    echo "✅ uv installed successfully!"
    echo ""
fi

echo "============================================"
echo "Running local checks (mirrors CI pipeline)"
echo "============================================"
echo ""
echo "Using uv package manager..."
echo "Installing/syncing dependencies (including dev)..."
uv sync --all-extras --frozen 2>/dev/null || uv sync --all-extras

# Use uv run to execute commands in the virtual environment
RUFF="uv run ruff"
BANDIT="uv run bandit"
MYPY="uv run mypy"
PYTEST="uv run pytest"

# ============================================
# Auto-fix mode: fix issues before checking
# ============================================
if [[ "$FIX_MODE" == "true" ]]; then
    echo ""
    echo "🔧 Auto-fix mode enabled - fixing issues first..."
    echo ""
    echo "Fixing linting issues with ruff check --fix..."
    $RUFF check --fix custom_components/meraki_ha/ tests/ || true
    echo ""
    echo "Fixing formatting issues with ruff format..."
    $RUFF format custom_components/meraki_ha/ tests/
    echo ""
    echo "✅ Auto-fix complete. Now running checks..."
fi

echo ""
echo "1/5 Running ruff check..."
$RUFF check custom_components/meraki_ha/ tests/

echo ""
echo "2/5 Running ruff format check..."
$RUFF format --check custom_components/meraki_ha/ tests/

echo ""
echo "3/5 Running bandit security check..."
$BANDIT -r custom_components/meraki_ha/ -c pyproject.toml -q

echo ""
echo "4/5 Running mypy type check..."
$MYPY custom_components/meraki_ha/ tests/

echo ""
echo "5/5 Running pytest..."
$PYTEST tests/ -x -q --ignore=tests/test_e2e_web_ui.py

echo ""
echo "============================================"
echo "✅ All checks passed!"
echo "============================================"
