import Plugin from '../Plugin'


export default class MiniGame extends Plugin {

    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'start_game': this.startGame,
            'send_move': this.sendMove,
            'game_over': this.gameOver,
			'end_ruffle_mingame': this.endRuffleMinigame
        }

        this.defaultScoreGames = [904, 905, 906, 912, 916, 917, 918, 919, 950, 952]
    }

    startGame(args, user) {
        if (user.inWaddleGame) {
            user.waddle.startGame(user)
        }
    }
	
	endRuffleMinigame(args, user) {
		if (args.coins > 15000){
			return
		}
		else{
			user.updateCoins(args.coins)
			user.send('end_ruffle_mingame', { coins: user.data.coins, game: args.game, coinsEarned: args.coins })
		}
	}

    sendMove(args, user) {
        if (user.inWaddleGame) {
            user.waddle.sendMove(args, user)
        }
    }

    gameOver(args, user) {
        if (!user.room.game) {
            return
        }

        let coins = this.getCoinsEarned(user, args.score)
        user.updateCoins(coins)

        user.send('game_over', { coins: user.data.coins })
    }

    getCoinsEarned(user, score) {
        if (user.inWaddleGame) {
            return user.waddle.getPayout(user, score)

        } else if (user.room.id in this.defaultScoreGames) {
            return score

        } else {
            return Math.ceil(score / 10)
        }
    }

}
