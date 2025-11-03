# Quick Start - Uso Rápido de Agentes

## 🚀 Setup Rápido (5 minutos)

### 1. Instalar Dependencias

```bash
# Opción A: Usar el script de instalación
./agents/install.sh

# Opción B: Instalar manualmente
cd agents/testing-agent && npm install && cd ../..
cd agents/code-review-agent && npm install && cd ../..
cd agents/best-practices-agent && npm install && cd ../..
cd agents/clean-code-agent && npm install && cd ../..
cd agents/documentation-agent && npm install && cd ../..
cd agents/security-agent && npm install && cd ../..
```

### 2. Configurar Cursor MCP

Edita `~/.cursor/mcp.json` y copia la configuración de `mcp-config-example.json`, ajustando las rutas a tu sistema:

```json
{
  "mcpServers": {
    "testing-agent": {
      "command": "node",
      "args": ["/ruta/absoluta/a/tu/proyecto/agents/testing-agent/index.js"]
    }
    // ... otros agentes
  }
}
```

### 3. Reiniciar Cursor

Cierra y vuelve a abrir Cursor completamente.

### 4. ¡Listo! Usa los Agentes

Ahora puedes usar los agentes directamente en el chat de Cursor:

```
Genera tests RSpec para mi modelo User
```

```
Revisa este código para seguridad y estilo
```

## 📋 Checklist de Instalación

- [ ] Node.js 18+ instalado
- [ ] Dependencias de agentes instaladas (`npm install` en cada agente)
- [ ] Archivo `~/.cursor/mcp.json` configurado
- [ ] Cursor reiniciado
- [ ] Agentes funcionando (ver en MCP Output)

## 💡 Uso Rápido

### Testing Agent
```
Genera tests para este código
```

### Code Review Agent
```
Revisa este código antes de commitear
```

### Best Practices Agent
```
¿Este código sigue las mejores prácticas de Rails?
```

### Clean Code Agent
```
Detecta code smells en este código
```

### Documentation Agent
```
Genera documentación para esta API
```

### Security Agent
```
Escaneea este código en busca de vulnerabilidades
```

## 🆘 Problemas Comunes

**Agente no aparece en Cursor:**
- Verifica rutas absolutas en `mcp.json`
- Reinicia Cursor completamente
- Revisa logs en View > Output > MCP

**Error "Module not found":**
- Ejecuta `npm install` en el directorio del agente
- Verifica Node.js versión: `node --version`

**Agente no responde:**
- Ejecuta el agente directamente: `node agents/[nombre]/index.js`
- Revisa errores en la salida

## 📖 Documentación Completa

Para más detalles, consulta:
- [Guía Completa de Uso](./USAGE.md)
- [Guía de Integración](./INTEGRATION.md)
- [README Principal](./README.md)

