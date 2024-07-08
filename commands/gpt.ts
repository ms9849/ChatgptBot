import { SlashCommandBuilder } from "discord.js";
import { ChatGPTAuthTokenService } from "chat-gpt-authenticator";
import { idObj } from '../app';
class gpt {
    data;
    constructor() {
        this.data = new SlashCommandBuilder()
		.setName('gpt')
		.setDescription('Ask Everything to Chat GPT')
        .addStringOption((option) =>
            option.setName('ask')
                .setDescription('질문 입력')
                .setRequired(true))

    }
	async execute(interaction) {
        let res;
        await interaction.reply("답변 대기중..");
        const question = interaction.options.getString('ask');
        const chatGptAuthTokenService = new ChatGPTAuthTokenService(
            "hee26368@naver.com",
            "wat331331691010#"
          );
        let token = await chatGptAuthTokenService.getToken();
        token = await chatGptAuthTokenService.refreshToken();
        const { ChatGPTUnofficialProxyAPI } = await import('chatgpt');
        const GPT = new ChatGPTUnofficialProxyAPI({
            accessToken: token,
            apiReverseProxyUrl: 'https://bypass.duti.tech/api/conversation'
        })
        if(idObj.parentId != null && idObj.convId != null) {
            res = await GPT.sendMessage(question, {
                parentMessageId: idObj.parentId,
                conversationId: idObj.convId
            });
        }
        else {
            res = await GPT.sendMessage(question);
        }

        idObj.parentId = res.id;
        idObj.convId = res.conversationId;

        const content = res.text;
        let answer = "Q: " + question + "\n\nA:" + content;
        await interaction.editReply({
            content: answer
        });
	}
}

module.exports = new gpt();