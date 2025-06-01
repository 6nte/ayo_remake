const { Events, EmbedBuilder } = require('discord.js');
const { leaveChannelId } = require('../config.json');
const { logoUrl, bannerUrl, colors } = require('../config.json');


module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    try {
      const leaveChannel = member.guild.channels.cache.get(leaveChannelId);
      
      if (!leaveChannel) {
        console.error(`Leave channel with ID ${leaveChannelId} not found!`);
        return;
      }

      const leaveEmbed = new EmbedBuilder()
        .setColor(colors.main)
        .setTitle('Auf Wiedersehen!')
        .setDescription(`👋 **${member.user.tag}** hat den Server verlassen!`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setImage(bannerUrl)
        .addFields(
          { name: 'Verbleibende Member', value: `${member.guild.memberCount}`, inline: true }
        )
        .setFooter({ text: `User ID: ${member.id}` })
        .setTimestamp();

      await leaveChannel.send({ embeds: [leaveEmbed] })
        .catch(error => console.error('Error sending leave message:', error));

    } catch (error) {
      console.error('Error in guildMemberRemove event:', error);
    }
  },
};

// discord.gg/hope-leaks