import Item from "../classes/BaseItem";

export default class Shield extends Item {
    constructor() {
        super({
            config: {
                id: 'shield',
                displayname: '🛡️ Shield',
                description: 'Use this to protect yourself from robbers!',
            },
            options: {
                buyable: true,
                sellable: true,
                usable: false,
                price: 5600,
                cost: Math.floor(5600 * 0.3),
            }
        });
    }
}