import Item from "../classes/BaseItem";

export default class Heart extends Item {
    constructor() {
        super({
            config: {
                id: 'heart',
                displayname: '❤️ Heart',
                description: 'Awesome collectable item! _Don\'t ever break it >.>_',
            },
            options: {
                buyable: true,
                sellable: true,
                usable: false,
                price: 500000,
                cost: Math.floor(500000 * 0.3),
            }
        });
    }
}