import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {all, digit} from '../Options';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardResource} from '../../../common/CardResource';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {cancelled} from '../Options';
import {Tag} from '../../../common/cards/Tag';
export class ServerSabotage extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SERVER_SABOTAGE,
      tags: [Tag.CRIME],
      cost: 7,

      behavior: {
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'U47',
        renderData: CardRenderer.builder((b) => {
          // TODO(kberg): Use icon.
          b.corruption(1).minus().resource(CardResource.DATA, {amount: 2, digit, all}).br.text('ALL').undergroundResources(1, {cancelled});
        }),
        description: 'Gain 1 corruption. Remove up to 2 data from any player. Remove all unclaimed underground resources ' +
          'from the board back into the pile. Their spaces can be identified again.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    game.defer(new RemoveResourcesFromCard(player, CardResource.DATA, 2));
    if (game.underworldData === undefined) {
      return;
    }
    UnderworldExpansion.removeAllUnclaimedTokens(game);
    return undefined;
  }
}
