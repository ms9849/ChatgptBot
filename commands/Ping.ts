import { SlashCommandBuilder } from "discord.js";

class Ping {
	data: SlashCommandBuilder;

	constructor() {
		this.data = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('pong!');
	}

	async execute(interaction) {
		await interaction.reply('Pong!');
	}
}

module.exports = new Ping();