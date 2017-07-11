"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_state_1 = require("../../core/game-state");
// import { Logger } from '../../shared/logger';
exports.event = 'plugin:player:request:personalities';
exports.description = 'Request personality data. Generally used only when looking at personalities.';
exports.args = '';
exports.socket = (socket) => {
    const requestpersonalities = () => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        if (!playerName)
            return;
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player)
            return;
        // Logger.info('Socket:Player:RequestPersonalities', `${socket.playerName} (${socket.address.ip}) requesting personalities.`);
        player._updatePersonalities();
    });
    socket.on(exports.event, requestpersonalities);
};
