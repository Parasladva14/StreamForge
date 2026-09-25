class NotificationWebSocket {

  constructor() {
    this.socket = null;
  }

  connect(onMessage) {

    const wsBase = import.meta.env.VITE_WS_URL || "ws://localhost:8000";
    this.socket = new WebSocket(
      `${wsBase}/ws/notifications`
    );

    this.socket.onopen = () => {
      console.log("✅ Notification WebSocket Connected");
    };

    this.socket.onmessage = (event) => {

      const data = JSON.parse(event.data);

      onMessage(data);

    };

    this.socket.onclose = () => {
      console.log("❌ Notification WebSocket Closed");
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket Error", error);
    };

  }

  disconnect() {

    if (this.socket) {
      this.socket.close();
    }

  }

}

export default new NotificationWebSocket();