const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  const command = new SlashCommandBuilder()
    .setName('annonce')
    .setDescription('Envoyer une annonce Moretti')
    .addStringOption(opt => opt.setName('heure').setDescription('Heure du rendez-vous').setRequired(true))
    .addStringOption(opt => opt.setName('lieu').setDescription('Lieu du rendez-vous').setRequired(true))
    .addStringOption(opt => opt.setName('raison').setDescription('Raison du rendez-vous').setRequired(true));

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [command.toJSON()] });
  console.log('✅ Slash command /annonce enregistrée');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'annonce') return;

  const heure = interaction.options.getString('heure');
  const lieu = interaction.options.getString('lieu');
  const raison = interaction.options.getString('raison');

  const embed = new EmbedBuilder()
    .setTitle('🚨 Annonce Moretti')
    .setColor(0xB22222)
    .addFields(
      { name: '🕐 Heure', value: heure },
      { name: '📍 Lieu', value: lieu },
      { name: '📌 Raison', value: raison }
    )
    .setFooter({ text: 'Moretti Family' });

  await interaction.reply({ embeds: [embed] });
});

client.login(TOKEN);
