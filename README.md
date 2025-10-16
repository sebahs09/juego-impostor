# 🎭 El Impostor

Un juego social de deducción y engaño donde los jugadores deben descubrir quién es el impostor a través de descripciones y discusiones estratégicas.

## 🎯 Objetivo del Juego

- **🔵 Civiles:** Descubrir quién es el impostor antes de que sea demasiado tarde
- **🔴 Impostor:** Permanecer oculto y ganar puntos sin ser descubierto

## 👥 Roles

### Civiles (Mayoría)
- Reciben la misma palabra secreta
- Deben describir su palabra sin revelarla directamente
- Trabajan juntos para identificar al impostor

### Impostor(es)
- Reciben la palabra "IMPOSTOR"
- Deben actuar como civiles sin conocer la palabra real
- Ganan puntos si no son descubiertos

## 🎮 Modos de Juego

### 📱 Modo Local
- Jugar en un solo dispositivo
- Los jugadores ven su palabra uno por uno
- Perfecto para reuniones presenciales
- Discusión cara a cara

### 🔗 Modo Online
- **Crear Sala:** Genera un código único para compartir
- **Unirse a Sala:** Ingresa el código para conectarte
- Cada jugador en su propio dispositivo
- Conexión P2P en tiempo real con PeerJS

### 🗣️ Modo Oral
- Fase de turnos con descripciones
- Discusión libre por voz
- El anfitrión controla los turnos

### ✉️ Modo Chat
- Fase de turnos con descripciones
- Chat de texto integrado
- Sistema de votación opcional

## 🎲 Temáticas Disponibles

1. **Minecraft** - Personajes y elementos del juego
2. **Fútbol** - Jugadores famosos
3. **Comida** - Platos y alimentos
4. **Clash Royale** - Cartas del juego

## 📖 Cómo Jugar

### Configuración Inicial

1. **Ingresa tu nombre** en la pantalla de inicio
2. **Selecciona modo de juego:**
   - **Modo Local:** Un solo dispositivo
   - **Modo Online:** Múltiples dispositivos conectados

### Modo Online - Crear Sala

1. Selecciona "Crear Sala"
2. Comparte el código generado con tus amigos
3. Espera a que todos se unan al lobby
4. Configura:
   - Temática del juego
   - Número de impostores
   - Modo de juego (Oral o Chat)
5. Presiona "Iniciar Juego"

### Modo Online - Unirse a Sala

1. Selecciona "Unirse a Sala"
2. Ingresa el código compartido por el anfitrión
3. Espera en el lobby
4. ¡Listo para jugar!

## 🎯 Fases del Juego

### 1️⃣ Fase de Turnos

- Cada jugador describe su palabra en orden
- **No reveles tu palabra directamente**
- Da pistas sutiles para que otros civiles te identifiquen
- El impostor debe improvisar sin conocer la palabra
- Solo el **anfitrión** puede pasar turnos

**Ejemplo:**
- Palabra: "Pizza"
- Descripción: "Es redonda, tiene queso y se come caliente"

### 2️⃣ Fase de Discusión

**Modo Oral:**
- Discusión libre por voz (Discord, WhatsApp, etc.)
- Analiza las descripciones de cada jugador
- Identifica respuestas sospechosas

**Modo Chat:**
- Chat de texto integrado en el juego
- Todos pueden escribir mensajes
- Opción de votación disponible

### 3️⃣ Declaración de Ganador

Solo el **anfitrión** puede declarar al ganador:

- **🔴 Ganó Impostor:** Si no fue descubierto
  - Suma puntos según la ronda actual
  - Vuelve al lobby automáticamente
  
- **🔵 Ganó Tripulación:** Si descubrieron al impostor
  - No suma puntos
  - Vuelve al lobby automáticamente

- **Siguiente Ronda:** Continuar jugando sin volver al lobby
  - Incrementa el contador de rondas
  - Vuelve a la fase de turnos

## 🎨 Diseño

- Interfaz moderna con gradientes animados
- Efectos visuales profesionales
- Responsive para móviles y desktop
- Tipografía Poppins
- Paleta de colores púrpura/azul

## 🏆 Sistema de Puntos Progresivos

El sistema de puntos aumenta con cada ronda para hacer el juego más emocionante:

- **Ronda 1:** +1 punto si gana el impostor
- **Ronda 2:** +2 puntos si gana el impostor
- **Ronda 3:** +3 puntos si gana el impostor
- **Ronda N:** +N puntos si gana el impostor

⚠️ **Importante:** La tripulación NO suma puntos, solo detiene al impostor

### Tabla de Puntuaciones

- Muestra todos los jugadores ordenados por puntos
- 🥇🥈🥉 Medallas para los 3 primeros lugares
- Los puntos se acumulan durante toda la sesión
- Se resetea al crear una nueva sala

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Gradientes, animaciones, glassmorphism
- **JavaScript Vanilla** - Lógica del juego
- **PeerJS** - Conexión P2P en tiempo real (WebRTC)
- **GitHub Pages** - Hosting gratuito

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Dispositivos móviles (iOS y Android)
- ✅ Tablets
- ✅ Desktop
- ✅ Conexión HTTPS requerida para WebRTC

## 🚀 Instalación y Despliegue

### Jugar Online (Recomendado)
Visita: [https://sebahs09.github.io/juego-impostor/](https://sebahs09.github.io/juego-impostor/)

### Ejecutar Localmente
```bash
# Clonar el repositorio
git clone https://github.com/sebahs09/juego-impostor.git

# Abrir con un servidor local (requerido para PeerJS)
# Opción 1: Python
python -m http.server 8080

# Opción 2: Node.js
npx http-server -p 8080

# Abrir en el navegador
http://localhost:8080
```

## 💡 Consejos y Estrategias

### 🎭 Para Civiles:
- **Da pistas sutiles** que solo otros civiles entiendan
- **Haz preguntas específicas** sobre la palabra
- **Observa las reacciones** de los demás jugadores
- **Compara descripciones** para encontrar inconsistencias
- **Trabaja en equipo** para identificar al impostor

### 🕵️ Para Impostores:
- **Escucha atentamente** las primeras descripciones
- **Da respuestas vagas** pero creíbles
- **No te contradigas** con lo que dijeron otros
- **Actúa con confianza** como si conocieras la palabra
- **Desvía la atención** hacia otros jugadores

### 👑 Para Anfitriones:
- **Controla el ritmo** del juego
- **Da tiempo suficiente** para cada fase
- **Sé justo** al declarar ganadores
- **Mantén el orden** en las discusiones

## 🎯 Características Especiales

### Chat en Vivo
- Chat flotante disponible durante el juego
- Notificaciones de mensajes no leídos
- Historial de mensajes persistente

### Sistema de Turnos
- Orden aleatorio de jugadores
- Indicador visual del turno actual
- Solo el anfitrión controla los turnos

### Desconexión Automática
- Detecta cuando un jugador cierra la página (F5)
- Elimina automáticamente jugadores desconectados
- Actualiza la lista en tiempo real

## 🐛 Solución de Problemas

### No puedo conectarme a una sala
- Verifica que el código sea correcto (no distingue mayúsculas/minúsculas)
- Asegúrate de tener conexión a internet
- Intenta recargar la página con `Ctrl + Shift + R`
- Verifica que estés usando HTTPS

### El juego no sincroniza
- Todos los jugadores deben estar en la misma versión
- Recarga la página en todos los dispositivos
- Verifica la conexión a internet

### Problemas en móvil
- Usa Chrome o Safari actualizado
- Permite permisos de conexión si se solicitan
- Verifica que no haya firewall bloqueando WebRTC

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

**Sebastián** - Creador y desarrollador principal

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el juego:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## ⭐ Agradecimientos

- Inspirado en juegos como "Spyfall" y "Among Us"
- Gracias a PeerJS por la conexión P2P
- Comunidad de GitHub por el feedback

---

**¡Diviértete descubriendo al impostor!** 🎭🕵️‍♂️

© 2025 El Impostor - Creado por Sebastián
