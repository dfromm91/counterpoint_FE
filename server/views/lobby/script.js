let roomsIntervalId = null;
let isPolling = false;

document.addEventListener("DOMContentLoaded", () => {
  wireForms();
  document.getElementById("refreshBtn")?.addEventListener("click", loadRooms);
  loadRooms();
  roomsIntervalId = setInterval(loadRooms, 5000);
});

window.addEventListener("beforeunload", () => {
  if (roomsIntervalId) clearInterval(roomsIntervalId);
});

function wireForms() {
  const createForm = document.getElementById("createRoomForm");
  const joinForm = document.getElementById("joinRoomForm");

  createForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const roomName = document.getElementById("createRoomName").value.trim();
    const playerName = document.getElementById("createPlayerName").value.trim();
    if (!roomName || !playerName) {
      showError("createRoomError", "Please fill in all fields");
      return;
    }
    localStorage.setItem("playerName", playerName);
    window.location.href = `/room/${encodeURIComponent(roomName)}`;
  });

  joinForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const roomName = document.getElementById("joinRoomName").value.trim();
    let playerName = document.getElementById("joinPlayerName").value.trim();
    if (!roomName) {
      showError("joinRoomError", "Please enter a room name");
      return;
    }
    if (!playerName) {
      playerName = localStorage.getItem("playerName")?.trim() || "";
      if (!playerName) {
        playerName = prompt("Enter your name:");
        if (!playerName) return;
      }
    }
    localStorage.setItem("playerName", playerName);
    window.location.href = `/room/${encodeURIComponent(roomName)}`;
  });
}

async function loadRooms() {
  if (isPolling) return;
  isPolling = true;

  const roomsList = document.getElementById("roomsList");
  if (!roomsList) {
    isPolling = false;
    return;
  }

  try {
    const resp = await fetch("/rooms", {
      headers: { Accept: "application/json" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    const rooms = Object.entries(data); // [ [roomKey, roomObj], ... ]

    // Clear initial loading if present
    if (roomsList.firstElementChild?.classList.contains("loading")) {
      roomsList.innerHTML = "";
    }

    // Track existing nodes
    const existing = {};
    roomsList.querySelectorAll(".room-item").forEach((el) => {
      existing[el.dataset.roomKey] = el;
    });

    if (rooms.length === 0) {
      roomsList.innerHTML =
        '<div class="loading">No rooms available. Create one above!</div>';
      isPolling = false;
      return;
    }

    // Add / update
    rooms.forEach(([roomKey, room]) => {
      const count = Array.isArray(room?.players) ? room.players.length : 0;
      const status = count < 2 ? "open" : "full";

      let el = existing[roomKey];
      if (!el) {
        el = document.createElement("div");
        el.className = "room-item";
        el.dataset.roomKey = roomKey;
        el.innerHTML = `
          <div class="room-info">
            <div class="room-name"></div>
            <div class="room-details"></div>
          </div>
          <div class="room-right">
            <span class="status-dot"></span>
            <div class="room-status"></div>
            <button class="room-join-btn" type="button" data-room="${encodeURIComponent(
              roomKey
            )}">Join</button>
          </div>
        `;
        roomsList.appendChild(el);

        // Immediate redirect on click
        el.querySelector(".room-join-btn").addEventListener("click", (evt) => {
          const key = decodeURIComponent(
            evt.currentTarget.getAttribute("data-room")
          );
          // Try existing input/localStorage first
          let playerName =
            document.getElementById("joinPlayerName")?.value?.trim() ||
            localStorage.getItem("playerName")?.trim() ||
            "";
          if (!playerName) {
            playerName = prompt("Enter your name:");
            if (!playerName) return;
          }
          localStorage.setItem("playerName", playerName);
          window.location.href = `/room/${encodeURIComponent(key)}`;
        });
      }

      // Patch content
      el.querySelector(".room-name").textContent = roomKey;
      el.querySelector(".room-details").textContent = `${count}/2 players`;

      const dot = el.querySelector(".status-dot");
      const statusEl = el.querySelector(".room-status");
      dot.className = `status-dot ${status}`;
      statusEl.className = `room-status status-${status}`;
      statusEl.textContent = status;

      const btn = el.querySelector(".room-join-btn");
      btn.disabled = status === "full";
      btn.title = status === "full" ? "Room is full" : "Join this room";
    });

    // Remove vanished rooms
    Object.keys(existing).forEach((key) => {
      if (!rooms.find(([rk]) => rk === key)) {
        existing[key].remove();
      }
    });
  } catch (e) {
    console.error("loadRooms error:", e);
  } finally {
    isPolling = false;
  }
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 5000);
}

// Optional quickJoin left for compatibility
function quickJoin(roomName) {
  let playerName = localStorage.getItem("playerName")?.trim() || "";
  if (!playerName) {
    playerName = prompt("Enter your name:");
    if (!playerName) return;
  }
  localStorage.setItem("playerName", playerName);
  window.location.href = `/room/${encodeURIComponent(roomName)}`;
}
