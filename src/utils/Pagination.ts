import { Message, MessageEmbed, MessageReaction, User } from 'discord.js';

export default async function Pagination(msg: Message, pages: MessageEmbed[], timeout: number = 120000) {
	let page = 0;
	const curPage: Message = await msg.channel.send(pages[page].setTimestamp().setFooter(`Page ${page + 1} / ${pages.length} | ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true })));
	await curPage.react('⏪');
	await curPage.react('⏩');
	const reactionCollector = curPage.createReactionCollector(
		(reaction: MessageReaction, user: User) => ['⏪', '⏩'].includes(reaction.emoji.name) && !user.bot && user.id === msg.author.id,
		{ time: timeout }
	);
	reactionCollector.on('collect', (reaction: MessageReaction) => {
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