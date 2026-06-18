const { Client } = require("colyseus.js");

const client = new Client("ws://localhost:2567");

async function run() {
  try {
    console.log("Connecting...");
    const room = await client.joinOrCreate("game_room", { name: "test" });
    console.log("Connected to room:", room.name);
    setTimeout(() => {
      room.leave();
      console.log("Left room");
      process.exit(0);
    }, 2000);
  } catch (e) {
    console.error("Error connecting:", e);
    process.exit(1);
  }
}

run();
