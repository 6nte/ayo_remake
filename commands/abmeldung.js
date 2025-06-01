const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');
const ms = require('ms');
const { logoUrl, bannerUrl, colors } = require('../config.json');


const abmeldungen = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('abmeldung')
    .setDescription('Meldet dich ab')
    .addStringOption(opt => opt.setName('zeit').setDescription('Wie lange? z.B. 2h, 1d').setRequired(true))
    .addStringOption(opt => opt.setName('grund').setDescription('Grund der Abmeldung').setRequired(true)),
  async execute(interaction) {
    const zeit = interaction.options.getString('zeit');
    const grund = interaction.options.getString('grund');
    const dauer = ms(zeit);

    if (!dauer || dauer < 60000) return interaction.reply({ content: 'Ungültige Zeitangabe!', ephemeral: true });

    const userId = interaction.user.id;
    const userTag = interaction.user.tag;
    const now = new Date();
    const until = new Date(now.getTime() + dauer);

    abmeldungen.set(userId, { userTag, grund, now, until, msgId: null });

    await interaction.reply({ content: 'Du hast dich erfolgreich abgemeldet.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Deine Abmeldung')
      .addFields(
        { name: 'Wer', value: userTag, inline: false },
        { name: 'Warum', value: grund, inline: false },
        { name: 'Wann', value: now.toLocaleString('de-DE'), inline: false },
        { name: 'Wieder Zurück', value: until.toLocaleString('de-DE'), inline: false },
      )
      .setFooter({ text: 'Du kannst die Abmeldung unten löschen.' });

    try {
      const dm = await interaction.user.send({ embeds: [embed], components: [row] });
      abmeldungen.get(userId).dmMsgId = dm.id;
    } catch (e) {
    }

    await updateTeamAbmeldungEmbed(interaction.client);

    setTimeout(async () => {
      abmeldungen.delete(userId);
      await updateTeamAbmeldungEmbed(interaction.client);
    }, dauer);
  }
};

async function updateTeamAbmeldungEmbed(client) {
  const channel = await client.channels.fetch(config.abmeldungsembedID);
  if (!channel) return;

  const messages = await channel.messages.fetch({ limit: 20 });
  let abmeldungMsg = messages.find(msg =>
    msg.author.id === client.user.id &&
    msg.embeds.length > 0 &&
    msg.embeds[0].title === 'Team Abmeldungen'
  );

  let abmeldungText = '';
  for (const v of abmeldungen.values()) {
    abmeldungText += `**${v.userTag}**\nWarum: ${v.grund}\nBis: ${v.until.toLocaleString('de-DE')}\n\n`;
  }
  if (!abmeldungText) abmeldungText = 'keine Abmeldungen';

  const embed = new EmbedBuilder()
    .setTitle('Team Abmeldungen')
    .setDescription(abmeldungText)
    .setFooter({ text: `Zuletzt Aktuallisiert -> ${new Date().toLocaleString('de-DE')}` });

  if (abmeldungMsg) {
    await abmeldungMsg.edit({ embeds: [embed] });
  } else {
    await channel.send({ embeds: [embed] });
  }
}

module.exports.handleButton = async function(interaction) {
  if (interaction.customId !== 'abmeldung_loeschen') return;
  const userId = interaction.user.id;
  if (!abmeldungen.has(userId)) {
    return interaction.reply({ content: 'Keine aktive Abmeldung gefunden.', ephemeral: true });
  }
  abmeldungen.delete(userId);
  await updateTeamAbmeldungEmbed(interaction.client);
  await interaction.reply({ content: 'Deine Abmeldung wurde gelöscht.', ephemeral: true });
};

// discord.gg/hope-leaks
