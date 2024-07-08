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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idObj = void 0;
const discord_js_1 = require("discord.js");
const config_json_1 = __importDefault(require("./config.json"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.idObj = {
    parentId: null,
    convId: null
};
class App {
    constructor() {
        this.commands = [];
    }
    start() {
        console.log("Starting Class");
        this.client = new discord_js_1.Client({
            intents: [discord_js_1.GatewayIntentBits.Guilds]
        });
        this.client.commands = new discord_js_1.Collection();
        this.getCommands();
        this.executeCommands();
        this.registerCommands();
        this.client.login(config_json_1.default.discordToken);
    }
    getCommands() {
        const commandsPath = path_1.default.join(__dirname, 'commands');
        const commandFiles = fs_1.default.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path_1.default.join(commandsPath, file);
            const command = require(filePath);
            this.commands.push(command.data.toJSON());
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                this.client.commands.set(command.data.name, command);
            }
            else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    executeCommands() {
        this.client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isChatInputCommand())
                return;
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                yield command.execute(interaction);
            }
            catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    yield interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                }
                else {
                    yield interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }));
    }
    registerCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rest = new discord_js_1.REST({ version: '10' }).setToken(config_json_1.default.discordToken);
            const data = yield this.rest.put(discord_js_1.Routes.applicationCommands(config_json_1.default.appId), { body: this.commands });
        });
    }
}
const app = new App();
app.start();
