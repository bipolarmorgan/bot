import Item from "../classes/BaseItem";

export default class Motorcycle extends Item {
    constructor() {
        super({
            config: {
                id: 'motorcycle',
                displayname: '🏍 Motorcycle',
                description: 'It\'s time to ride like a GANG GANG GANG!',
            },
            options: {
                buyable: true,
                sellable: true,
                usable: false,
                price: 55500,
                cost: Math.floor(6500 * 0.3),
            }
        });
    }
}