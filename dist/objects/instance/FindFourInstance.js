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
      this.send('four_over', {
        winner: user.data.id
      });

      for (let x in this.users) {
        this.waddle.remove(this.users[x]);
      }

      this.waddle.reset();
    } else {
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

      console.log(`Vertical Match: ${adjacent}`);
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

      console.log(`Horizontal Match: ${adjacent}`);
      if (adjacent >= 4) return true;

      if (this.map[column][row] !== user) {
        adjacent = 0;
      }
    }
  }

  checkDiagonalMatch(column, row, user) {
    let adjacent = 0;

    if (column > row) {
      let offset = column - row;

      for (let i = 0; i < 7; i++) {
        if (!this.map[i][i + offset]) break;

        if (this.map[i][i + offset] === user) {
          adjacent = adjacent + 1;
        }

        console.log(`Diagonal Match: ${adjacent}`);
        if (adjacent >= 4) return true;

        if (this.map[i][i + offset] !== user) {
          adjacent = 0;
        }
      }
    } else {
      let offset = row - column;

      for (let i = 0; i < 7; i++) {
        if (!this.map[i + offset][i]) break;

        if (this.map[i + offset][i] === user) {
          adjacent = adjacent + 1;
        }

        console.log(`Diagonal Match: ${adjacent}`);
        if (adjacent >= 4) return true;

        if (this.map[i + offset][i] !== user) {
          adjacent = 0;
        }
      }
    }
  }

  remove(user) {
    let winner = this.users[0].data.id === user.data.id ? this.users[1].data.id : this.users[0].data.id;
    this.send('four_over', {
      winner: winner
    });

    for (let x in this.users) {
      this.waddle.remove(this.users[x]);
    }
  }

}

exports.default = FindFourInstance;