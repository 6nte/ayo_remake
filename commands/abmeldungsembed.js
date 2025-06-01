const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('abmeldungembed')
    .setDescription('Sendet das Team Abmeldungen Embed'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Team Abmeldungen')
      .setDescription('keine Abmeldungen')
      .setFooter({ text: `Zuletzt Aktuallisiert -> ${new Date().toLocaleString('de-DE')}` });

    const channel = await interaction.client.channels.fetch(config.abmeldungsembedID);
    if (!channel) return interaction.reply({ content: 'Channel nicht gefunden!', ephemeral: true });

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Embed gesendet!', ephemeral: true });
  }
};

// discord.gg/hope-leaks
