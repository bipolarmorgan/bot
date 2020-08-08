/**
 * 
 * @param {import('discord.js').Message} msg 
 * @param {import('discord.js').MessageEmbed} pages 
 * @param {number} timeout 
 */
async function Pagination(msg, pages, timeout = 120000) {
    let page = 0;
    /**
     * @type {import('discord.js').Message}
     */
	const curPage = await msg.channel.send(pages[page].setTimestamp().setFooter(`Page ${page + 1} / ${pages.length} | ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true })));
    await curPage.react('⏪');
    await curPage.react('⏩');
	const reactionCollector = curPage.createReactionCollector(
        (reaction, user) => ['⏪', '⏩'].includes(reaction.emoji.name) && !user.bot && user.id === msg.author.id,
		{ time: timeout }
	);
	reactionCollector.on('collect', reaction => {
		reaction.users.remove(msg.author);
		switch (reaction.emoji.name) {
			case '⏪':
				page = page > 0 ? --page : pages.length - 1;
				break;
			case '⏩':
				page = page + 1 < pages.length ? ++page : 0;
				break;
			default:
				break;
		}
		curPage.edit(pages[page].setTimestamp().setFooter(`Page ${page + 1} / ${pages.length} | ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true })));
	});
	reactionCollector.on('end', () => curPage.reactions.removeAll());
	return curPage;
};

module.exports = Pagination;