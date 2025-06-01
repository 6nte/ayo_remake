const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');
const { logoUrl, bannerUrl, colors, adminRoleId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Entbannt einen User über die User ID')
        .addStringOption(option =>
            option
                .setName('userid')
                .setDescription('Die ID des Users, der entbannt werden soll')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('grund')
                .setDescription('Der Grund für den Unban')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return await interaction.reply({
                content: 'Du hast keine Rechte!',
                ephemeral: true
            });
        }

        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('grund') || "Kein Grund angegeben";
        const currentTimestamp = Math.floor(Date.now() / 1000);

        try {
            await interaction.guild.members.unban(userId, reason);

            let user = null;
            try {
                user = await interaction.client.users.fetch(userId);
            } catch {}

            if (user) {
                const dmEmbed = new EmbedBuilder()
                    .setTitle('Du wurdest entbannt')
                    .setDescription(`${interaction.user} hat dich von **${interaction.guild.name}** entbannt.\n\n` +
                        `Grund: ${reason}\n` +
                        `Am: <t:${currentTimestamp}:F>`)
                    .setColor(colors.success)
                    .setTimestamp()
                    .setFooter({ text: `${interaction.guild.name} • Moderation` });

                try {
                    await user.send({
                        content: `${user}`,
                        embeds: [dmEmbed]
                    });
                } catch (error) {
                    console.log('Konnte keine DM an den User senden');
                }
            }

            const successEmbed = new EmbedBuilder()
                .setTitle('Spieler erfolgreich entbannt')
                .setDescription(`Du hast <@${userId}> **erfolgreich** von **${interaction.guild.name}** entbannt.\n\n` +
                    `Grund: ${reason}\n` +
                    `Am: <t:${currentTimestamp}:F>`)
                .setColor(colors.success)
                .setFooter({ text: `ayo Remake`, iconURL: logoUrl });

            await interaction.reply({
                embeds: [successEmbed],
                allowedMentions: { users: [userId] }
            });

        } catch (error) {
            console.error('Fehler beim Entbannen:', error);
            await interaction.reply({
                content: '❌ Es gab einen Fehler beim Entbannen des Users! Ist die ID korrekt und ist der User gebannt?',
                ephemeral: true
            });
        }
    },
};