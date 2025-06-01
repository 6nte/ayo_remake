const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    if (!config.setup_supportnotifyID || !config.setup_supportnotifyLogID) return;

    if (
      (!oldState.channelId || oldState.channelId !== config.setup_supportnotifyID) &&
      newState.channelId === config.setup_supportnotifyID
    ) {
      const logChannel = await newState.guild.channels.fetch(config.setup_supportnotifyLogID).catch(() => null);
      if (!logChannel) return;

      const user = newState.member.user;
      const voiceChannel = await newState.guild.channels.fetch(config.setup_supportnotifyID).catch(() => null);

      const embed = new EmbedBuilder()
        .setColor('#0082ff')
        .setDescription(`Spieler - ${user} \n Server ${guild} - \n Channel - ${voiceChannel}.`)
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    }
  }
};

// discord.gg/hope-leaks