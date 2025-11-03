#!/bin/bash

# Script para instalar dependencias de todos los agentes

echo "🚀 Installing dependencies for all AI agents..."

PROJECT_ROOT="/Users/leon/workspace/tamagochi"

# Lista de agentes
AGENTS=(
  "testing-agent"
  "code-review-agent"
  "best-practices-agent"
  "clean-code-agent"
  "documentation-agent"
  "security-agent"
)

# Instalar dependencias de cada agente
for agent in "${AGENTS[@]}"; do
  AGENT_DIR="$PROJECT_ROOT/agents/$agent"
  
  if [ -f "$AGENT_DIR/package.json" ]; then
    echo ""
    echo "📦 Installing dependencies for $agent..."
    cd "$AGENT_DIR"
    
    if npm install; then
      echo "✅ $agent dependencies installed successfully"
    else
      echo "❌ Failed to install dependencies for $agent"
      exit 1
    fi
    
    cd "$PROJECT_ROOT"
  else
    echo "⚠️  No package.json found for $agent, skipping..."
  fi
done

echo ""
echo "✨ All agent dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Update ~/.cursor/mcp.json with agent paths"
echo "2. Restart Cursor"
echo "3. See agents/USAGE.md for usage instructions"

