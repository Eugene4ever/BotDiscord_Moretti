const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const ARME_CHANNEL_ID = '1495715546954727516';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  const commands = [
    new SlashCommandBuilder()
      .setName('annonce')
      .setDescription('Envoyer une annonce Moretti')
      .addStringOption(opt => opt.setName('heure').setDescription('Heure du rendez-vous').setRequired(true))
      .addStringOption(opt => opt.setName('lieu').setDescription('Lieu du rendez-vous').setRequired(true))
      .addStringOption(opt => opt.setName('raison').setDescription('Raison du rendez-vous').setRequired(true)),

    new SlashCommandBuilder()
      .setName('arme')
      .setDescription('Faire une demande d\'armement')
      .addStringOption(opt => opt.setName('date').setDescription('Date de la demande').setRequired(true))
      .addStringOption(opt => opt.setName('prenom_rp').setDescription('Prénom RP').setRequired(true))
      .addStringOption(opt => opt.setName('nom_rp').setDescription('Nom RP').setRequired(true))
      .addStringOption(opt => opt.setName('equipement').setDescription('Équipement demandé').setRequired(true))
      .addStringOption(opt => opt.setName('paiement').setDescription('Mode de paiement').setRequired(true)
        .addChoices(
          { name: '💰 Argent sale', value: 'Argent sale' },
          { name: '🏦 Argent propre', value: 'Argent propre' }
        ))
      .addStringOption(opt => opt.setName('infos').setDescription('Informations supplémentaires (quantité, urgence, détails...)').setRequired(false))
  ];

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands.map(c => c.toJSON()) });
  console.log('✅ Slash commands enregistrées');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // Commande /annonce
  if (interaction.commandName === 'annonce') {
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
      .setImage('https://cdn.discordapp.com/attachments/1489323538036035654/1494587251836063774/BBEA237C-331D-441C-9BE1-69174180A3C9.png?ex=69e71ad8&is=69e5c958&hm=a8da5d0c0937bf57b2c9e63686c2992096f666a473e1853908dbd3971ca8399f')
      .setFooter({ text: 'Moretti Family' });

    const msg = await interaction.reply({
      content: '@everyone',
      embeds: [embed],
      allowedMentions: { parse: ['everyone'] },
      fetchReply: true
    });

    await msg.react('✅');
    await msg.react('❌');
  }

  // Commande /arme
  if (interaction.commandName === 'arme') {
    const date = interaction.options.getString('date');
    const prenom = interaction.options.getString('prenom_rp');
    const nom = interaction.options.getString('nom_rp');
    const equipement = interaction.options.getString('equipement');
    const paiement = interaction.options.getString('paiement');
    const infos = interaction.options.getString('infos') || 'Aucune information supplémentaire';

    const embed = new EmbedBuilder()
      .setTitle('🔫 Demande d\'Armement')
      .setColor(0x2C2C2C)
      .addFields(
        { name: '📅 Date de la demande', value: date },
        { name: '👤 Prénom RP', value: prenom },
        { name: '👤 Nom RP', value: nom },
        { name: '🔫 Équipement demandé', value: equipement },
        { name: '💵 Mode de paiement', value: paiement },
        { name: '📝 Informations supplémentaires', value: infos }
      )
      .setFooter({ text: `Demande envoyée par ${interaction.user.username}` });

    const channel = await client.channels.fetch(ARME_CHANNEL_ID);
    await channel.send({ embeds: [embed] });

    await interaction.reply({ content: '✅ Ta demande d\'armement a bien été envoyée !', ephemeral: true });
  }
});

client.login(TOKEN);
