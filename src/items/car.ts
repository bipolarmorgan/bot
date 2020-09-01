import Item from "../classes/BaseItem";

export default class Car extends Item {
    constructor() {
        super({
            config: {
                id: 'car',
                displayname: '🚗 Car',
                description: 'Your gateaway car that increases payout/chances on robbing someone',
            },
            options: {
                buyable: true,
                sellable: true,
                usable: false,
                price: 75000,
                cost: Math.floor(25000 * 0.3),
            }
        })
    }
}