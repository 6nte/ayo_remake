const { bilderChannelId } = require('../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    const reactionEmoji = '👍'; 

    if (message.author.bot) return;

    if (message.channel.id === bilderChannelId) {
      const imageAttachment = message.attachments.find(att => att.contentType && att.contentType.startsWith('image/'));

      if (!imageAttachment) {
        try {
          await message.delete();

          const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`<@${message.author.id}> Bitte sende hier nur Bilder`);

          await message.channel.send({ embeds: [embed] });
        } catch (err) {
          console.error('Fehler beim Löschen oder Embed:', err);
        }
      } else {
        try {
          await message.react(reactionEmoji);
        } catch (err) {
          console.error('Fehler beim Reagieren mit Emoji:', err);
        }
      }
    }
  },
};
// discord.gg/hope-leaks