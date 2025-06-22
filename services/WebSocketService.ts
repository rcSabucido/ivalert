export class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 5;
    private readonly reconnectDelay = 2000; // 2 secs
   

    connect(serverUrl: string, onLevelUpdate: (level: number) => void) {
        if (this.ws) {
            this.ws.close();
        }

        const POLL_PASSWORD =  process.env.EXPO_PUBLIC_POLL_PASSWORD;
        const wsUrl = serverUrl;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('Websocket connected');
            if (this.ws && POLL_PASSWORD) {
                this.ws.send(JSON.stringify({ 
                    password: POLL_PASSWORD,
                }));
            }
            this.reconnectAttempts = 0; 
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.new_level !== undefined) {
                    onLevelUpdate(data.new_level);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('Websocket connection closed');
            this.attemptReconnect(serverUrl, onLevelUpdate);
        };

        this.ws.onerror = (error) => {
            console.error('Websocket error:', error);
        };
    }

    private attemptReconnect(serverUrl: string, onLevelUpdate: (level: number) => void): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => {
                this.connect(serverUrl, onLevelUpdate);
            }, this.reconnectDelay);
        }
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}