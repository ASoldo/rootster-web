import init, { initialize_game } from "./../bevy-game/bevy-game.js";

async function run() {
  try {
    await init();
  } catch (error: any) {
    if (!error.message.startsWith("Using exceptions for control flow,")) {
      throw error;
    }
  }
  try {
    initialize_game("#bevy-canvas");
  } catch (error: any) {
    if (!error.message.startsWith("Using exceptions for control flow,")) {
      throw error;
    }
  }
}

run().catch(console.error);
