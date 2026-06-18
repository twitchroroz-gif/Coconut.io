import { Client, Room } from "colyseus.js";
import { SERVER_PORT, InputData } from "coconutclash-shared";

export class NetworkManager {
  private static instance: NetworkManager;
  private client: Client;
  public room: Room | null = null;
  public sessionId: string = "";

  private constructor() {
    // Connect to the Colyseus server
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    // In dev, use the specific port. In prod (Coolify), the reverse proxy handles port routing on 80/443
    const port = (host === "localhost" || host === "127.0.0.1") ? `:${SERVER_PORT}` : "";
    
    this.client = new Client(`${protocol}://${host}${port}`);
  }

  public static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  public async joinGame(name: string): Promise<Room> {
    try {
      this.room = await this.client.joinOrCreate("game_room", { name });
      this.sessionId = this.room.sessionId;
      return this.room;
    } catch (e) {
      console.error("Failed to join room", e);
      throw e;
    }
  }

  public leaveGame() {
    if (this.room) {
      this.room.leave();
      this.room = null;
    }
  }

  public sendInput(input: InputData) {
    if (this.room) {
      this.room.send("input", input);
    }
  }
}

// Export singleton instance
export const networkManager = NetworkManager.getInstance();
