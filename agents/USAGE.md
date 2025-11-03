# Guía de Uso de Agentes AI

Esta guía explica cómo instalar, configurar y usar los agentes AI del proyecto.

## 📋 Tabla de Contenidos

1. [Instalación](#instalación)
2. [Configuración en Cursor](#configuración-en-cursor)
3. [Uso de Agentes](#uso-de-agentes)
4. [Ejemplos Prácticos](#ejemplos-prácticos)
5. [Solución de Problemas](#solución-de-problemas)

## 🚀 Instalación

### Paso 1: Instalar Dependencias

Primero, instala las dependencias de cada agente:

```bash
# Desde la raíz del proyecto
cd agents/testing-agent
npm install

cd ../code-review-agent
npm install

cd ../best-practices-agent
npm install

cd ../clean-code-agent
npm install

cd ../documentation-agent
npm install

cd ../security-agent
npm install
```

**O puedes usar este script:**

```bash
# Script para instalar todas las dependencias
for dir in agents/*/; do
  if [ -f "$dir/package.json" ]; then
    echo "Installing dependencies in $dir"
    cd "$dir" && npm install && cd ../..
  fi
done
```

### Paso 2: Verificar Instalación

Verifica que Node.js esté instalado (versión 18+):

```bash
node --version  # Debe ser v18 o superior
```

## ⚙️ Configuración en Cursor

### Paso 1: Obtener Ruta Absoluta del Proyecto

Primero, necesitas la ruta absoluta de tu proyecto. Ejecuta:

```bash
pwd
# Ejemplo de salida: /Users/leon/workspace/tamagochi
```

### Paso 2: Actualizar Configuración MCP

Edita el archivo `~/.cursor/mcp.json` y agrega los agentes:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "ctx7sk-44c8d342-c1b8-49fd-881c-4b3720729ce1"
      }
    },
    "testing-agent": {
      "command": "node",
      "args": ["/Users/leon/workspace/tamagochi/agents/testing-agent/index.js"]
    },
    "code-review-agent": {
      "command": "node",
      "args": ["/Users/leon/workspace/tamagochi/agents/code-review-agent/index.js"]
    },
    "best-practices-agent": {
      "command": "node",
      "args": ["/Users/leon/workspace/tamagochi/agents/best-practices-agent/index.js"]
    },
    "clean-code-agent": {
      "command": "node",
      "args": ["/Users/leon/workspace/tamagochi/agents/clean-code-agent/index.js"]
    },
    "documentation-agent": {
      "command": "node",
      "args": ["/Users/leon/workspace/tamagochi/agents/documentation-agent/index.js"]
    },
    "security-agent": {
      "command": "node",
      "args": ["/Users/leon/workspace/tamagochi/agents/security-agent/index.js"]
    }
  }
}
```

**⚠️ Importante:** Reemplaza `/Users/leon/workspace/tamagochi` con la ruta absoluta de tu proyecto.

### Paso 3: Reiniciar Cursor

Después de guardar los cambios, **reinicia Cursor completamente** para que los agentes se carguen.

## 💡 Uso de Agentes

Una vez configurados, los agentes están disponibles en Cursor a través del chat de IA. Puedes usarlos de dos formas:

### Método 1: Uso Automático (Recomendado)

Gracias a las reglas en `.cursorrules`, los agentes se usan automáticamente cuando son relevantes. Simplemente pide ayuda normal:

```
Genera tests para este modelo de Rails
```

El sistema automáticamente usará el Testing Agent.

### Método 2: Uso Explícito

Puedes solicitar específicamente un agente:

```
Usa el code-review-agent para revisar este código
```

## 📝 Ejemplos Prácticos

### 1. Testing Agent

**Generar tests para un modelo Rails:**

```
Genera tests RSpec para este modelo:

class User < ApplicationRecord
  validates :email, presence: true
  has_many :posts
end
```

**Generar tests para un componente React Native:**

```
Genera tests Jest para este componente de React Native
```

### 2. Code Review Agent

**Revisar código antes de commitear:**

```
Revisa este código para detectar problemas de seguridad y estilo:

[pega tu código aquí]
```

**Revisar un Pull Request:**

```
Revisa estos cambios de PR para asegurar calidad
```

### 3. Best Practices Agent

**Verificar mejores prácticas:**

```
Verifica si este código Rails sigue las mejores prácticas
```

**Obtener guía de mejores prácticas:**

```
Muéstrame las mejores prácticas para crear un servicio en Rails
```

### 4. Clean Code Agent

**Detectar code smells:**

```
Detecta code smells en este código y sugiere refactorizaciones
```

**Verificar principios SOLID:**

```
Verifica si este código cumple los principios SOLID
```

### 5. Documentation Agent

**Generar documentación de API:**

```
Genera documentación de API para este código GraphQL
```

**Actualizar README:**

```
Genera un README para este módulo
```

### 6. Security Agent

**Escanear vulnerabilidades:**

```
Escaneea este código en busca de vulnerabilidades de seguridad
```

**Verificar autenticación:**

```
Verifica que la autenticación esté implementada correctamente
```

## 🔧 Herramientas Disponibles por Agente

### Testing Agent

- `generate-test`: Genera archivos de test
- `analyze-coverage`: Analiza cobertura de tests
- `generate-test-examples`: Genera ejemplos de tests

### Code Review Agent

- `review-code`: Revisa código completo
- `check-security`: Verifica seguridad
- `validate-style`: Valida estilo de código
- `review-pr`: Revisa Pull Requests

### Best Practices Agent

- `check-best-practices`: Verifica mejores prácticas
- `get-best-practices-guide`: Obtiene guía de mejores prácticas
- `suggest-optimizations`: Sugiere optimizaciones

### Clean Code Agent

- `detect-code-smells`: Detecta code smells
- `suggest-refactoring`: Sugiere refactorizaciones
- `check-solid-principles`: Verifica principios SOLID

### Documentation Agent

- `generate-api-docs`: Genera documentación de API
- `generate-readme`: Genera README
- `update-inline-docs`: Actualiza documentación inline

### Security Agent

- `scan-vulnerabilities`: Escanea vulnerabilidades
- `check-authentication`: Verifica autenticación

## 🐛 Solución de Problemas

### El agente no se carga

1. **Verifica las rutas**: Asegúrate de usar rutas absolutas en `mcp.json`
2. **Verifica Node.js**: `node --version` debe ser 18+
3. **Reinicia Cursor**: Reinicia completamente Cursor
4. **Verifica dependencias**: Asegúrate de que `npm install` se ejecutó en cada agente

### Error "Module not found"

```bash
# Vuelve a instalar dependencias
cd agents/[nombre-agente]
npm install
```

### El agente no responde

1. Abre la consola MCP en Cursor (View > Output > MCP)
2. Revisa los logs de error
3. Ejecuta el agente directamente para ver errores:

```bash
cd agents/testing-agent
node index.js
```

### Error de permisos

```bash
# Dar permisos de ejecución
chmod +x agents/*/index.js
```

## 📚 Recursos Adicionales

- [Documentación MCP](https://modelcontextprotocol.io)
- [README de Agentes](./README.md)
- [Guía de Integración](./INTEGRATION.md)
- [Documentación del Proyecto](../docs/README.md)

## 💬 Ejemplos de Conversaciones Completas

### Ejemplo 1: Desarrollo de Feature Completo

```
Usuario: Voy a crear un modelo User. Ayúdame con todo el proceso.

Asistente: [automáticamente usa múltiples agentes]
1. Genera el modelo con mejores prácticas (Best Practices Agent)
2. Genera tests RSpec (Testing Agent)
3. Revisa el código (Code Review Agent)
4. Genera documentación (Documentation Agent)
```

### Ejemplo 2: Revisión de PR

```
Usuario: Revisa este PR antes de mergear

Asistente: [usando Code Review Agent, Security Agent, Best Practices Agent]
- Detecta problemas de seguridad
- Verifica estilo y convenciones
- Sugiere mejoras
- Calcula score de calidad
```

## 🎯 Tips y Mejores Prácticas

1. **Usa agentes antes de commitear**: Siempre ejecuta code-review y security antes de hacer commit
2. **Genera tests mientras desarrollas**: No esperes al final, genera tests durante el desarrollo
3. **Documenta mientras codificas**: Usa documentation-agent para mantener docs actualizadas
4. **Revisa regularmente**: Ejecuta clean-code-agent periódicamente para mantener código limpio

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en Cursor (View > Output > MCP)
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de usar rutas absolutas en la configuración
4. Reinicia Cursor después de cambios en `mcp.json`

