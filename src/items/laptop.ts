import Item from "../classes/BaseItem";

export default class Laptop extends Item {
    constructor() {
        super({
            config: {
                id: 'laptop',
                displayname: '💻 Laptop',
                description: 'Use this to work as a developer and earn that salary!',
            },
            options: {
                buyable: true,
                sellable: true,
                usable: false,
                price: 1500,
                cost: Math.floor(1500 * 0.3),
            }
        });
    }
}