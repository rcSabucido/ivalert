export class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 5;
    private readonly reconnectDelay = 2000; // 2 seconds
    private closedIntentionally = false;
    private onLevelUpdate: ((level: number) => void) | null = null;
    private serverUrl: string = '';

    connect(serverUrl: string, onLevelUpdate: (level: number) => void) {
        this.serverUrl = serverUrl;
        this.onLevelUpdate = onLevelUpdate;

        if (this.ws) {
            this.cleanupWebSocket();
            this.ws.close();
        }

        const POLL_PASSWORD = process.env.EXPO_PUBLIC_POLL_PASSWORD;
        this.ws = new WebSocket(serverUrl);
        this.closedIntentionally = false;

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            if (POLL_PASSWORD) {
                this.ws?.send(JSON.stringify({ password: POLL_PASSWORD }));
            }
            this.reconnectAttempts = 0;
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.new_level !== undefined && this.onLevelUpdate) {
                    this.onLevelUpdate(data.new_level);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        // Use arrow function to capture correct `this`
        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
            if (!this.closedIntentionally) {
                console.log('WS not closed intentionally');
                this.attemptReconnect();
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => {
                this.connect(this.serverUrl, this.onLevelUpdate!);
            }, this.reconnectDelay);
        } else {
            console.warn("Max reconnect attempts reached. Giving up.");
        }
    }

    disconnect(): void {
        console.log('Disconnect called');
        if (this.ws) {
            this.closedIntentionally = true;
            this.cleanupWebSocket();
            this.ws.close();
            this.ws = null;
        }
    }

    private cleanupWebSocket() {
        if (this.ws) {
            this.ws.onopen = null;
            this.ws.onmessage = null;
            this.ws.onclose = null;
            this.ws.onerror = null;
        }
    }
}
