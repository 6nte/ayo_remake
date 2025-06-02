const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    PermissionFlagsBits,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require('discord.js');
const { adminRoleId, verifyRoleId, colors } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendverify')
        .setDescription('Sendet das Verifizierungs-Embed'),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return await interaction.reply({
                content: 'Du hast keine Berechtigung, diesen Befehl zu verwenden!',
                ephemeral: true
            });
        }

        try {
            const verifyEmbed = new EmbedBuilder()
                .setColor(colors.main)
                .setTitle('Verifizierung')
                .setDescription(`Reagiere auf die Nachricht und Verifiziere dich somit um auf **${interaction.guild.name}** zu spielen.`)
                .setThumbnail("logoUrl")
                .setImage("bannerUrl")
                .setTimestamp();

            const verifyButton = new ButtonBuilder()
                .setCustomId('verify-button')
                .setEmoji('✅')
                .setLabel('Klick Mich')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder()
                .addComponents(verifyButton);

            await interaction.channel.send({
                embeds: [verifyEmbed],
                components: [row]
            });

            await interaction.reply({
                content: 'Verifizierungs-Embed wurde erfolgreich gesendet!',
                ephemeral: true
            });

        } catch (error) {
            console.error('Fehler beim Senden des Verify-Embeds:', error);
            await interaction.reply({
                content: 'Es gab einen Fehler beim Senden des Verify-Embeds!',
                ephemeral: true
            });
        }
    },
};

// discord.gg/hope-leaks
