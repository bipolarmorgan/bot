import Item from "../classes/BaseItem";

export default class Padlock extends Item {
    constructor() {
        super({
            config: {
                id: 'padlock',
                displayname: '🔒 Padlock',
                description: 'Increase the protection of your coins by buying this awesome padlock!',
            },
            options: {
                buyable: true,
                sellable: true,
                usable: true,
                price: 3400,
                cost: Math.floor(3400 * 0.3),
            }
        });
    }
}