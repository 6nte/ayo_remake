const { Events, EmbedBuilder } = require('discord.js');
const { welcomeChannelId } = require('../config.json');
const { logoUrl, bannerUrl, colors } = require('../config.json');

module.exports = {
  name: Events.GuildMemberAdd,
  execute(member) {
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
    
    if (!welcomeChannel) return;

    const welcomeEmbed = new EmbedBuilder()
      .setColor(colors.main)
      .setTitle('Willkommen!')
      .setDescription(`${member.user} (#${member.guild.memberCount}) **Willkommen auf dem Server**, \n \n Bitte lies dir das **Regelwerk vollständig** durch. \n Der **Support** ist jeder Zeit **erreichbar**. \n\n **Vielen Dank**, dass du dem **Server beigetreten** bist und viel **Spaß**!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setImage(bannerUrl)
      .setTimestamp();

    welcomeChannel.send({ embeds: [welcomeEmbed] });
  },
};

// discord.gg/hope-leaks