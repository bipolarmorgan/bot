class Voter {
    /**
     * 
     * @param {{}} data 
     */
    constructor(data) {
        this.id = data.id;
        this.list = data.site;
    }
}
module.exports = Voter;