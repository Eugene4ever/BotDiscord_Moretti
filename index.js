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
    .setImage('https://cdn.discordapp.com/attachments/1489323538036035654/1492543286395801703/7DC3E674-8D3F-4B72-8C6C-8AC898C92425.png?ex=69dbb6c1&is=69da6541&hm=006f39eb9ffa226ec4b6e4807c0ded991ac3e600a6e44b3d8d9efdd29ac96477')
    .setFooter({ text: 'Moretti Family' });

  // Envoie le message avec @everyone
  const msg = await interaction.reply({
    content: '@everyone',
    embeds: [embed],
    allowedMentions: { parse: ['everyone'] },
    fetchReply: true
  });

  // Ajoute les réactions
  await msg.react('✅');
  await msg.react('❌');
});

client.login(TOKEN);
