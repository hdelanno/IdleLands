
const isBattleDebug = process.env.BATTLE_DEBUG;

import _ from 'lodash';

import { Event } from '../event';
import { GameState } from '../../../core/game-state';

import { Party as PartyClass } from '../../../plugins/party/party';

import { MessageCategories } from '../../../shared/adventure-log';

import { SETTINGS } from '../../../static/settings';

export const WEIGHT = isBattleDebug ? 250 : 36;

// Create a party
export class Party extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {

    if(player.$personalities.isActive('Solo') || player.level < SETTINGS.minPartyLevel) return;

    const validPlayers = _.reject(
      GameState.getInstance().getPlayers(),
      p => p.$partyName || p === player
      || p.$personalities.isActive('Solo')
      || p.$personalities.isActive('Camping')
      || p.level < SETTINGS.minPartyLevel
      || p.map !== player.map
    );

    if(player.$partyName) {
      if(player.party.players.length < SETTINGS.maxPartyMembers && validPlayers.length >= 1) {
        const newPlayer = _.sample(validPlayers);
        player.party.playerJoin(newPlayer);
        this.emitMessage({
          affected: player.party.players,
          eventText: this._parseText('%partyName picked up a stray %player on their travels!', newPlayer, { partyName: player.party.name }),
          category: MessageCategories.PARTY
        });
      }
      return;
    }

    if(validPlayers.length < 3) return;

    const partyInstance = new PartyClass({ leader: player });

    const newPlayers = _.sampleSize(validPlayers, 3);

    player.$statistics.incrementStat('Character.Party.Create');

    _.each(newPlayers, p => {
      partyInstance.playerJoin(p);
    });

    const partyMemberString = _(newPlayers).map(p => `«${p.fullname}»`).join(', ');
    const eventText = this.eventText('party', player, { partyName: partyInstance.name, partyMembers: partyMemberString });

    this.emitMessage({ affected: partyInstance.players, eventText, category: MessageCategories.PARTY });

    return player.party.players;
  }

}

