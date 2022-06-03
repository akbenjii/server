"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _WaddleInstance = _interopRequireDefault(require("./WaddleInstance"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FindFourInstance extends _WaddleInstance.default {
  constructor(waddle) {
    super(waddle);
    this.waddle = waddle;
    this.game = 'four';
  } // Functions


  init() {
    this.map = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
    this.turn = this.users[0].data.id;
    this.send('init_four', {
      users: [this.users[0].data.id, this.users[1].data.id],
      turn: this.turn
    });
    super.gameReady();
    super.init();
  }

  placeCounter(args, user) {
    if (this.turn !== user.data.id) return;
    this.map[args.column][args.row] = user.data.id;
    this.send('place_counter', {
      column: args.column,
      row: args.row,
      user: user.data.id
    });
    let verticalMatch = this.checkVerticalMatch(args.column, user.data.id);
    let horizontalMatch = this.checkHorizontalMatch(args.row, user.data.id);
    let diagonalMatch = this.checkDiagonalMatch(args.column, args.row, user.data.id);

    if (verticalMatch || horizontalMatch || diagonalMatch) {
      let winner = user.data.id;
      this.send('four_over', {
        winner: winner
      });
      user.data.findFourWon = user.data.findFourWon + 1;
      user.update({
        findFourWon: user.data.findFourWon
      });

      for (let x in this.users) {
        if (this.users[x].data.id === winner) {
          this.users[x].updateCoins(25);
          this.users[x].send('end_ruffle_mingame', {
            coins: this.users[x].data.coins,
            game: "four",
            coinsEarned: 25,
            stamps: this.users[x].stamps.list
          });
        } else {
          this.users[x].updateCoins(10);
          this.users[x].send('end_ruffle_mingame', {
            coins: this.users[x].data.coins,
            game: "four",
            coinsEarned: 10,
            stamps: this.users[x].stamps.list
          });
        }

        this.waddle.remove(this.users[x]);
      }

      this.waddle.reset();
    } else {
      this.tied = true;

      for (var column in this.map) {
        for (var row in this.map[column]) {
          if (this.map[column][row] === 0) {
            this.tied = false;
          }
        }
      }

      if (this.tied) {
        this.send('four_over', {
          winner: 0
        });

        for (let x in this.users) {
          this.users[x].updateCoins(10);
          this.users[x].send('end_ruffle_mingame', {
            coins: this.users[x].data.coins,
            game: "four",
            coinsEarned: 10,
            stamps: this.users[x].stamps.list
          });
          this.waddle.remove(this.users[x]);
        }

        this.waddle.reset();
      }

      if (this.turn === this.users[0].data.id) {
        this.turn = this.users[1].data.id;
      } else {
        this.turn = this.users[0].data.id;
      }

      this.send('change_turn', {
        turn: this.turn
      });
    }
  }

  checkVerticalMatch(column, user) {
    let adjacent = 0;

    for (let row = 0; row < 7; row++) {
      if (this.map[column][row] === user) {
        adjacent = adjacent + 1;
      }

      if (adjacent >= 4) return true;

      if (this.map[column][row] !== user) {
        adjacent = 0;
      }
    }
  }

  checkHorizontalMatch(row, user) {
    let adjacent = 0;

    for (let column = 0; column < 7; column++) {
      if (this.map[column][row] === user) {
        adjacent = adjacent + 1;
      }

      if (adjacent >= 4) return true;

      if (this.map[column][row] !== user) {
        adjacent = 0;
      }
    }
  }

  checkDiagonalMatch(column, row, user) {
    let adjacent = 0;

    for (let i = 0; i < 7; i++) {
      if (!this.map[column + i]) {
        adjacent = 0;
        break;
      }

      if (!this.map[column + i][row - i]) {
        adjacent = 0;
        break;
      }

      if (this.map[column + i][row - i] === user) {
        adjacent = adjacent + 1;
      }

      if (adjacent >= 4) return true;

      if (this.map[column + i][row - i] !== user) {
        adjacent = 0;
      }
    }

    for (let i = 0; i < 7; i++) {
      if (!this.map[column - i]) {
        adjacent = 0;
        break;
      }

      if (!this.map[column - i][row - i]) {
        adjacent = 0;
        break;
      }

      if (this.map[column - i][row - i] === user) {
        adjacent = adjacent + 1;
      }

      if (adjacent >= 4) return true;

      if (this.map[column - i][row - i] !== user) {
        adjacent = 0;
      }
    }
  }

  remove(user) {
    let winner = this.users[0].data.id === user.data.id ? this.users[1] : this.users[0];
    this.send('four_over', {
      winner: winner.data.id
    });

    for (let x in this.users) {
      this.users[x].send('end_ruffle_mingame', {
        coins: this.users[x].data.coins,
        game: "four",
        coinsEarned: 0,
        stamps: this.users[x].stamps.list
      });
      this.waddle.remove(this.users[x]);
    }

    this.waddle.reset();
  }

}

exports.default = FindFourInstance;