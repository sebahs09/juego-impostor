# 🔥 Configurar Firebase para Modo Online

## Paso 1: Crear Proyecto Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Haz clic en **"Agregar proyecto"**
3. Nombre del proyecto: `juego-impostor` (o el que prefieras)
4. **Desactiva** Google Analytics (no lo necesitas)
5. Haz clic en **"Crear proyecto"**
6. Espera a que se cree (30 segundos aprox)

---

## Paso 2: Crear Realtime Database

1. En el menú lateral izquierdo, haz clic en **"Realtime Database"**
2. Haz clic en **"Crear base de datos"**
3. Ubicación: **United States** (o la más cercana a ti)
4. Modo de seguridad: **"Empezar en modo de prueba"**
   - Esto permite lectura/escritura por 30 días
   - Después puedes configurar reglas más seguras
5. Haz clic en **"Habilitar"**

---

## Paso 3: Obtener Configuración

1. Ve a **Configuración del proyecto** (⚙️ icono arriba a la izquierda)
2. En la sección "Tus apps", haz clic en el ícono **</>** (Web)
3. Apodo de la app: `Juego Impostor Web`
4. **NO** marques "También configurar Firebase Hosting"
5. Haz clic en **"Registrar app"**
6. Verás un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "juego-impostor-xxxxx.firebaseapp.com",
  databaseURL: "https://juego-impostor-xxxxx-default-rtdb.firebaseio.com",
  projectId: "juego-impostor-xxxxx",
  storageBucket: "juego-impostor-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

7. **COPIA TODO EL OBJETO `firebaseConfig`**

---

## Paso 4: Configurar en tu Proyecto

1. Abre el archivo `index.html`
2. Busca la línea que dice: `// REEMPLAZA ESTA CONFIGURACIÓN CON LA TUYA DE FIREBASE`
3. Reemplaza TODO el objeto `firebaseConfig` con el que copiaste de Firebase
4. Guarda el archivo

**Ejemplo:**

```javascript
// ANTES (en index.html)
const firebaseConfig = {
    apiKey: "TU-API-KEY-AQUI",
    authDomain: "juego-impostor.firebaseapp.com",
    // ...
};

// DESPUÉS (con tu configuración real)
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "juego-impostor-xxxxx.firebaseapp.com",
    databaseURL: "https://juego-impostor-xxxxx-default-rtdb.firebaseio.com",
    projectId: "juego-impostor-xxxxx",
    storageBucket: "juego-impostor-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

---

## Paso 5: Subir Cambios a GitHub

```bash
cd "C:\Users\sebas\Desktop\proyecto final\impostor"
git add .
git commit -m "Configurar Firebase para modo online"
git push
```

Espera 1-2 minutos y tu juego online funcionará en:
**https://sebahs09.github.io/juego-impostor**

---

## Paso 6: Configurar Reglas de Seguridad (Opcional pero Recomendado)

Después de probar que funciona, ve a Firebase → Realtime Database → Reglas y reemplaza con:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true,
        ".indexOn": ["code", "host"]
      }
    }
  }
}
```

Esto permite que cualquiera pueda crear/unirse a salas pero con mejor organización.

---

## ✅ Verificar que Funciona

1. Abre tu juego: `https://sebahs09.github.io/juego-impostor`
2. Selecciona **"Modo Online"**
3. Haz clic en **"Crear Sala"**
4. Si ves un código de 6 letras, ¡funciona! 🎉
5. Abre el juego en otro dispositivo/navegador
6. Ingresa el código y únete
7. Deberías ver ambos jugadores en la lista

---

## 🔧 Solución de Problemas

### Error: "Firebase no está configurado"
- Verifica que copiaste bien el `firebaseConfig` en `index.html`
- Asegúrate de que el `databaseURL` esté incluido

### Error: "Permission denied"
- Ve a Firebase → Realtime Database → Reglas
- Cambia a modo de prueba (permite lectura/escritura por 30 días)

### La sala no aparece
- Verifica que la Realtime Database esté creada
- Revisa la consola del navegador (F12) para ver errores

---

## 📊 Límites Gratuitos de Firebase

- **Realtime Database:** 1 GB almacenamiento, 10 GB/mes descarga
- **Conexiones simultáneas:** 100 usuarios
- **Más que suficiente para tu juego** 🎮

---

## 🎯 Próximos Pasos

Una vez que funcione el modo online:
1. Comparte el link con amigos
2. Prueba crear salas y unirte desde diferentes dispositivos
3. ¡Disfruta del juego!

---

**¿Necesitas ayuda?** Revisa la consola del navegador (F12) para ver mensajes de error.
