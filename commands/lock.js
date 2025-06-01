const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    PermissionFlagsBits 
} = require('discord.js');
const { logoUrl, bannerUrl, colors } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Sperrt einen Channel')
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
                SendMessages: false,
                AddReactions: false
            });

            const embed = new EmbedBuilder()
                .setTitle('🔒 Channel gesperrt')
                .setDescription(`Dieser Channel wurde von ${interaction.user} gesperrt.`)
                .setColor(colors.error)
                .setTimestamp()
                .setThumbnail(logoUrl)
                .setImage(bannerUrl)
                .setFooter({ text: `${interaction.guild.name} • Channel Lock` });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Fehler beim Sperren des Channels:', error);
            await interaction.reply({
                content: '❌ Es gab einen Fehler beim Sperren des Channels!',
                ephemeral: true
            });
        }
    },
};

// discord.gg/hope-leaks