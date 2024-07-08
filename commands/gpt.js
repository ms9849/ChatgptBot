"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const chat_gpt_authenticator_1 = require("chat-gpt-authenticator");
const app_1 = require("../app");
class gpt {
    constructor() {
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName('gpt')
            .setDescription('Ask Everything to Chat GPT')
            .addStringOption((option) => option.setName('ask')
            .setDescription('질문 입력')
            .setRequired(true));
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            yield interaction.reply("답변 대기중..");
            const question = interaction.options.getString('ask');
            const chatGptAuthTokenService = new chat_gpt_authenticator_1.ChatGPTAuthTokenService("hee26368@naver.com", "wat331331691010#");
            let token = yield chatGptAuthTokenService.getToken();
            token = yield chatGptAuthTokenService.refreshToken();
            const { ChatGPTUnofficialProxyAPI } = yield import('chatgpt');
            const GPT = new ChatGPTUnofficialProxyAPI({
                accessToken: token,
                apiReverseProxyUrl: 'https://bypass.duti.tech/api/conversation'
            });
            if (app_1.idObj.parentId != null && app_1.idObj.convId != null) {
                res = yield GPT.sendMessage(question, {
                    parentMessageId: app_1.idObj.parentId,
                    conversationId: app_1.idObj.convId
                });
            }
            else {
                res = yield GPT.sendMessage(question);
            }
            app_1.idObj.parentId = res.id;
            app_1.idObj.convId = res.conversationId;
            const content = res.text;
            console.log(content);
            let answer = "Q: " + question + "\n\nA:" + content;
            console.log(answer);
            yield interaction.editReply({
                content: answer
            });
        });
    }
}
module.exports = new gpt();
