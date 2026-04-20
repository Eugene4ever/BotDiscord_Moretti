const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const ARME_CHANNEL_ID = '1495715546954727516';
const BLANCHIMENT_CHANNEL_ID = '1493230158092566638';
const TERRITOIRE_CHANNEL_ID = '1493365620874678354';

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
      .addStringOption(opt => opt.setName('infos').setDescription('Informations supplémentaires').setRequired(false)),

    new SlashCommandBuilder()
      .setName('territoire')
      .setDescription('Déclarer une taxe de territoire')
      .addStringOption(opt => opt.setName('date').setDescription('Date de la déclaration').setRequired(true))
      .addStringOption(opt => opt.setName('prenom_rp').setDescription('Prénom RP').setRequired(true))
      .addStringOption(opt => opt.setName('nom_rp').setDescription('Nom RP').setRequired(true))
      .addStringOption(opt => opt.setName('identite').setDescription('Pièce d\'identité RP').setRequired(true))
      .addStringOption(opt => opt.setName('entreprise').setDescription('Entreprise / Activité').setRequired(true))
      .addStringOption(opt => opt.setName('territoire').setDescription('Territoire concerné').setRequired(true))
      .addStringOption(opt => opt.setName('montant').setDescription('Montant de la taxe versée').setRequired(true))
      .addStringOption(opt => opt.setName('paiement').setDescription('Mode de paiement').setRequired(true)
        .addChoices(
          { name: '💰 Argent sale', value: 'Argent sale' },
          { name: '🏦 Argent propre', value: 'Argent propre' }
        ))
      .addStringOption(opt => opt.setName('infos').setDescription('Informations supplémentaires (détails, fréquence, remarques...)').setRequired(false)),

    new SlashCommandBuilder()
      .setName('blanchiment')
      .setDescription('Signaler un blanchiment')
      .addStringOption(opt => opt.setName('date').setDescription('Date du signalement').setRequired(true))
      .addStringOption(opt => opt.setName('prenom_rp').setDescription('Prénom RP').setRequired(true))
      .addStringOption(opt => opt.setName('nom_rp').setDescription('Nom RP').setRequired(true))
      .addStringOption(opt => opt.setName('identite').setDescription('Numéro / Carte d\'identité RP').setRequired(true))
      .addStringOption(opt => opt.setName('lieu').setDescription('Lieu / Territoire concerné').setRequired(true))
      .addStringOption(opt => opt.setName('motif').setDescription('Motif du signalement').setRequired(true))
      .addStringOption(opt => opt.setName('taxe').setDescription('Taxe appliquée (montant demandé ou payé)').setRequired(true))
      .addStringOption(opt => opt.setName('infos').setDescription('Informations supplémentaires (détails, comportement, récidive...)').setRequired(false))
      .addStringOption(opt => opt.setName('preuve').setDescription('Lien vers une preuve / capture d\'identité').setRequired(false)),
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
      .setTitle('Demande d\'Armement')
      .setColor(0xB22222)
      .addFields(
        { name: '📅 Date de la demande', value: date },
        { name: '👤 Prénom RP', value: prenom },
        { name: '👤 Nom RP', value: nom },
        { name: '🔫 Équipement demandé', value: equipement },
        { name: '💵 Mode de paiement', value: paiement },
        { name: '📝 Informations supplémentaires', value: infos }
      )
      .setImage('https://cdn.discordapp.com/attachments/1489323538036035654/1495757730970079303/Image_Moretti_Arme.png?ex=69e76870&is=69e616f0&hm=1424228051c4dec9d2cfc8f02f2f86ac76e7d2300264bdd6a1f1a2620dd8895b');

    const channel = await client.channels.fetch(ARME_CHANNEL_ID);
    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Ta demande d\'armement a bien été envoyée !', ephemeral: true });
  }

  // Commande /territoire
  if (interaction.commandName === 'territoire') {
    const date = interaction.options.getString('date');
    const prenom = interaction.options.getString('prenom_rp');
    const nom = interaction.options.getString('nom_rp');
    const identite = interaction.options.getString('identite');
    const entreprise = interaction.options.getString('entreprise');
    const territoire = interaction.options.getString('territoire');
    const montant = interaction.options.getString('montant');
    const paiement = interaction.options.getString('paiement');
    const infos = interaction.options.getString('infos') || 'Aucune information supplémentaire';

    const embed = new EmbedBuilder()
      .setTitle('Taxe de Territoire')
      .setColor(0xB22222)
      .addFields(
        { name: '📅 Date de la déclaration', value: date },
        { name: '👤 Prénom RP', value: prenom },
        { name: '👤 Nom RP', value: nom },
        { name: '🪪 Pièce d\'identité RP', value: identite },
        { name: '🏢 Entreprise / Activité', value: entreprise },
        { name: '📍 Territoire concerné', value: territoire },
        { name: '💰 Montant de la taxe versée', value: montant },
        { name: '💵 Mode de paiement', value: paiement },
        { name: '📝 Informations supplémentaires', value: infos }
      );

    const channel = await client.channels.fetch(TERRITOIRE_CHANNEL_ID);
    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ La taxe de territoire a bien été enregistrée !', ephemeral: true });
  }

  // Commande /blanchiment
  if (interaction.commandName === 'blanchiment') {
    const date = interaction.options.getString('date');
    const prenom = interaction.options.getString('prenom_rp');
    const nom = interaction.options.getString('nom_rp');
    const identite = interaction.options.getString('identite');
    const lieu = interaction.options.getString('lieu');
    const motif = interaction.options.getString('motif');
    const taxe = interaction.options.getString('taxe');
    const infos = interaction.options.getString('infos') || 'Aucune information supplémentaire';
    const preuve = interaction.options.getString('preuve') || 'Aucune preuve fournie';

    const embed = new EmbedBuilder()
      .setTitle('Signalement Blanchiment')
      .setColor(0xB22222)
      .addFields(
        { name: '📅 Date du signalement', value: date },
        { name: '👤 Prénom RP', value: prenom },
        { name: '👤 Nom RP', value: nom },
        { name: '🪪 Numéro / Carte d\'identité RP', value: identite },
        { name: '📍 Lieu / Territoire concerné', value: lieu },
        { name: '⚠️ Motif du signalement', value: motif },
        { name: '💰 Taxe appliquée', value: taxe },
        { name: '📝 Informations supplémentaires', value: infos },
        { name: '🖼️ Preuve / Carte d\'identité', value: preuve }
      );

    const channel = await client.channels.fetch(BLANCHIMENT_CHANNEL_ID);
    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Le signalement de blanchiment a bien été envoyé !', ephemeral: true });
  }
});

client.login(TOKEN);
