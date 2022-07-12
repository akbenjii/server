import Plugin from '../Plugin'


export default class Item extends Plugin {

    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'add_mine_coins': this.addMineCoins,
            'delete_mine' : this.deleteKey
        }
        this.totalcoins = {};
    }

    addMineCoins(args, user) {
        if (!(args.miningId in this.totalcoins)) {
            this.totalcoins[args.miningId] = 0;
        }

        if (args.coins > 100) {
            user.send('error', {error: 'There was an error adding your coins'});
            return user.send('mining_error', {miningError:3,total:this.totalcoins})
        } else if (user.lastMined && ((new Date).getTime() - user.lastMined < args.timer - 100)) {
            return user.send('mining_error', {miningError:2,total:this.totalcoins})
        } else if (this.totalcoins[args.miningId] >= 100) {
            return user.send('mining_error', {miningError:1,total:this.totalcoins})
        } 
        
        user.updateCoins(args.coins)
        this.totalcoins[args.miningId] += args.coins;
        user.lastMined = (new Date).getTime()
        if (this.totalcoins[args.miningId] >= 100) {
            return user.send('mining_error', {miningError:1,total:this.totalcoins})
        }
        return user.send('mining_error', {miningError:0,total:this.totalcoins})
    }

    deleteKey(args,user) {
        delete this.totalcoins[args.miningId];
        return user.send("reset_mining", {})
    }

}