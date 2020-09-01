import Item from "../classes/BaseItem";

export default class Wrench extends Item {
    constructor() {
        super({
            config: {
                id: 'wrench',
                displayname: '🔧 Wrench',
                description: 'Use this so you can work as a Mechanic!',
            },
            options: {
                buyable: true,
                sellable: true,
                usable: false,
                price: 1100,
                cost: Math.floor(1100 * 0.3),
            }
        });
    }
}