import Item from '../classes/BaseItem';

export default class Diamond extends Item {
    constructor() {
        super({
            config: {
                id: 'diamond',
                displayname: '💠 Diamond',
                description: 'Precious collectable item! _O.o_',
            },
            options: {
                buyable: true,
                sellable: true,
                usable: false,
                price: 1000000,
                cost: Math.floor(1000000 * 0.3),
            }
        });
    }
}