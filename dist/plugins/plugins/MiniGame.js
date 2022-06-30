"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MiniGame extends _Plugin.default {
  constructor(users, rooms) {
    super(users, rooms);
    this.events = {
      'start_game': this.startGame,
      'send_move': this.sendMove,
      'game_over': this.gameOver,
      'end_ruffle_mingame': this.endRuffleMinigame,
      'check_legit': this.checkLegit,
      'place_counter': this.placeCounter,
      'set_cannon_data': this.setCannonData
    };
    this.defaultScoreGames = [904, 905, 906, 912, 916, 917, 918, 919, 950, 952];
  }

  startGame(args, user) {
    if (user.inWaddleGame) {
      user.waddle.startGame(user);
    }
  }

  endRuffleMinigame(args, user) {
    user.send('check_legit', {
      game: args.game,
      coinsEarned: args.coins
    });
    user.pending = true;
    user.pendingCoins = args.coins;
  }

  async checkLegit(args, user) {
    let categoryStamps = [];
    let ownedCategoryStamps = [];
    let category;

    switch (args.game.toLowerCase()) {
      case "aquagrabber":
        category = 13;
        break;

      case "astrobarrier":
        category = 14;
        break;

      case "card":
        category = 38;
        break;

      case "cjfire":
        category = 32;
        break;

      case "cjsnow":
        category = 60;
        break;

      case "cjwater":
        category = 34;
        break;

      case "cartsurfer":
        category = 28;
        break;

      case "catchinwaves":
        category = 15;
        break;

      case "icefishing":
        category = 52;
        break;

      case "jetpackadventure":
        category = 11;
        break;

      case "pizzatron":
        category = 54;
        break;

      case "pufflelaunch":
        category = 48;
        break;

      case "pufflerescue":
        category = 57;
        break;

      case "smoothie":
        category = 58;
        break;

      case "sysdef":
        category = 46;
        break;

      case "thinice":
        category = 16;
        break;

      case "treasurehunt":
        category = 56;
        break;
    }

    for (var stamp in this.crumbs.stamps) {
      if (this.crumbs.stamps[stamp].groupid == category) {
        categoryStamps.push(stamp);
        if (user.stamps.includes(parseInt(stamp))) ownedCategoryStamps.push(stamp);
      }
    }

    let payoutFrequency = args.coins * 50;
    let unixTime = new Date().getTime();

    if (user.lastPayout > unixTime - payoutFrequency) {
      return user.send('error', {
        error: 'You have earned too many coins too quickly! These coins have not been added as we fear they may have been cheated.'
      });
    }

    if (user.pending && user.pendingCoins === args.coins && args.coins < 15000) {
      if (categoryStamps.length > 1 && ownedCategoryStamps.length === categoryStamps.length) {
        args.coins = Math.round(args.coins * 1.5);
      }

      user.pending = false;
      user.pendingCoins = 0;
      user.lastPayout = new Date().getTime();
      user.updateCoins(args.coins);

      for (var x in args.stamps) {
        if (!user.stamps.includes(args.stamps[x])) {
          user.stamps.add(args.stamps[x]);
        }
      }

      user.send('end_ruffle_mingame', {
        coins: user.data.coins,
        game: args.game,
        coinsEarned: args.coins,
        stamps: user.stamps.list
      });

      if (user.partyData.team && this.handler.partyData.games.includes(args.game.toLowerCase())) {
        let data = await this.db.submitScore(user.data.id, args.game.toLowerCase(), args.coins);

        if (data) {
          let partyCompletion = await this.db.getPartyCompletion(user.data.id, "PenguinGames0722");
          user.send('get_party_completion', partyCompletion);
        } // update totals


        if (user.partyData.team == "blue") {
          if (this.handler.partyData.blueTotal) {
            this.handler.partyData.blueTotal += args.coins;
          } else {
            this.handler.partyData.blueTotal = args.coins;
          }
        } else if (user.partyData.team == "red") {
          if (this.handler.partyData.redTotal) {
            this.handler.partyData.redTotal += args.coins;
          } else {
            this.handler.partyData.redTotal = args.coins;
          }
        }
      }
    } else {
      user.send('error', {
        error: 'There was an error adding your coins'
      });
    }
  }

  sendMove(args, user) {
    if (user.inWaddleGame) {
      user.waddle.sendMove(args, user);
    }
  }

  async gameOver(args, user) {
    if (!user.room.game) {
      return;
    }

    let coins = await this.getCoinsEarned(user, args.score);
    user.updateCoins(coins);
    user.sledrace.setFinished(user.data.username, coins);
  }

  async getCoinsEarned(user, score) {
    if (user.inWaddleGame) {
      return await user.waddle.getPayout(user, score);
    } else if (user.room.id in this.defaultScoreGames) {
      return score;
    } else {
      return Math.ceil(score / 10);
    }
  }

  async placeCounter(args, user) {
    if (user.waddle.game = 'four') {
      await user.waddle.placeCounter(args, user);
    }
  }

  setCannonData(args, user) {
    user.update({
      cannon_data: args.data
    });
  }

}

exports.default = MiniGame;