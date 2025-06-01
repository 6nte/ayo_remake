const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup_supportnotify')
    .setDescription('Setzt den Support Voice- und Log-Channel für Support-Benachrichtigungen')
    .addChannelOption(opt =>
      opt.setName('voicechannel')
        .setDescription('Der Voice Channel für Support-Benachrichtigungen')
        .setRequired(true)
    )
    .addChannelOption(opt =>
      opt.setName('logchannel')
        .setDescription('Der Log Channel für Join-Nachrichten')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const { adminRoleId } = config;
    if (!interaction.member.roles.cache.has(adminRoleId)) {
      return await interaction.reply({
        content: 'Du hast keine Berechtigung, diesen Befehl zu verwenden!',
        ephemeral: true
      });
    }

    if (config.setup_supportnotifyID) {
      return await interaction.reply({
        content: 'Supportnotify ist bereits eingerichtet. Nutze `/resetsupportnotify`, um neu zu konfigurieren.',
        ephemeral: true
      });
    }

    const voiceChannel = interaction.options.getChannel('voicechannel');
    const logChannel = interaction.options.getChannel('logchannel');

    config.setup_supportnotifyID = voiceChannel.id;
    config.setup_supportnotifyLogID = logChannel.id;

    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    await interaction.reply({
      content: `Supportnotify eingerichtet!\nVoiceChannel: <#${voiceChannel.id}>\nLogChannel: <#${logChannel.id}>`,
      ephemeral: false
    });
  }
};

// discord.gg/hope-leaks