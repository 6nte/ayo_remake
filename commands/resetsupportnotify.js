const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetsupportnotify')
    .setDescription('Setzt die Supportnotify-Konfiguration zurück')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const { adminRoleId } = config;
    if (!interaction.member.roles.cache.has(adminRoleId)) {
      return await interaction.reply({
        content: 'Du hast keine Berechtigung, diesen Befehl zu verwenden!',
        ephemeral: true
      });
    }

    if (!config.setup_supportnotifyID) {
      return await interaction.reply({
        content: 'Supportnotify ist noch nicht eingerichtet.',
        ephemeral: true
      });
    }

    delete config.setup_supportnotifyID;
    delete config.setup_supportnotifyLogID;

    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    await interaction.reply({
      content: 'Supportnotify-Konfiguration wurde zurückgesetzt.',
      ephemeral: false
    });
  }
};

// discord.gg/hope-leaks