
import { Achievement, AchievementTypes } from '../achievement';

export class Bossy extends Achievement {
  static achievementData(player) {

    const value = player.$statistics.countChild('Character.BossKills');
    const baseValue = 15;

    let tier = 1;
    while(value >= baseValue * tier) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      str: tier*10,
      con: tier*10
    }];

    if(tier >= 5) {
      rewards.push({ type: 'title', title: 'Bossy' });
    }

    if(tier >= 6) {
      rewards.push({ type: 'petattr', petattr: 'a goblin head on a spear' });
    }

    return [{
      tier,
      name: 'Bossy',
      desc: `+${(tier*10).toLocaleString()} STR/CON for killing ${baseValue*tier} bosses.`,
      type: AchievementTypes.COMBAT,
      rewards
    }];
  }
}
