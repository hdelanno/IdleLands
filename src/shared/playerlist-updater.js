
import { primus } from '../../primus/server';
import { GameState } from '../core/game-state';

// these functions pertain to one person logging in and out
export const AllPlayers = (playerName) => {
  primus.room(playerName).write({ playerListOperation: 'set', data: GameState.getPlayersSimple() });
};

export const PlayerLogin = (playerName) => {
  primus.forEach(spark => {
    if(!spark.authToken || spark.authToken.playerName === playerName) return;
    spark.write({ playerListOperation: 'add', data: GameState.getPlayerNameSimple(playerName) });
  });
};

export const PlayerLogout = (playerName) => {
  primus.forEach(spark => {
    if(!spark.authToken || spark.authToken.playerName === playerName) return;
    spark.write({ playerListOperation: 'del', data: playerName });
  });
};

// these are global updater functions
export const AllPlayersPostMove = () => {
  const data = GameState.getPlayersSimple(['x', 'y', 'map']);
  primus.forEach(spark => spark.write({ playerListOperation: 'updateMass', data }));
};

export const PlayerUpdateAll = (playerName, keys) => {
  const data = GameState.getPlayerNameSimple(playerName, keys);
  primus.forEach(spark => spark.write({ playerListOperation: 'update', data }));
};