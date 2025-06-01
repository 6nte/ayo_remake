const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    PermissionFlagsBits 
} = require('discord.js');
const { logoUrl, bannerUrl, colors } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Entsperrt einen Channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return await interaction.reply({
                content: '❌ Du hast keine Berechtigung, diesen Befehl zu verwenden!',
                ephemeral: true
            });
        }

        const channel = interaction.channel;

        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: null,
                AddReactions: null
            });

            const embed = new EmbedBuilder()
                .setTitle('🔓 Channel entsperrt')
                .setDescription(`Dieser Channel wurde von ${interaction.user} entsperrt.`)
                .setColor(colors.success)
                .setTimestamp()
                .setThumbnail(logoUrl)
                .setImage(bannerUrl)
                .setFooter({ text: `${interaction.guild.name} • Channel Unlock` });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Fehler beim Entsperren des Channels:', error);
            await interaction.reply({
                content: '❌ Es gab einen Fehler beim Entsperren des Channels!',
                ephemeral: true
            });
        }
    },
};

// discord.gg/hope-leaks