export default {
    version: 'v0.1.2',
    author: 'oadpoaw',
    string: function (length = 5) {
        if (length <= 0) throw new RangeError('Lenght cannot go below 0');
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let str = '';
        for (var i = 0; i < length; i++) str += chars[Math.floor(Math.random() * chars.length)];
        return str;
    },
    nextInt: function (options: RandomOption = { max: 100, min: 0 }) {
        if (options.max <= options.min) throw new RangeError('options.max cannot be less than or equal to options.min');
        return Math.floor(Math.random() * (options.max - options.min + 1) + options.min);
    },
}

interface RandomOption {
    max: number;
    min: number;
}