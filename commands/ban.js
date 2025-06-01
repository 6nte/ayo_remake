const { 
    SlashCommandBuilder, 
    EmbedBuilder,
    PermissionFlagsBits 
} = require('discord.js');
const { logoUrl, bannerUrl, colors, adminRoleId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannt einen User')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Der User, der gebannt werden soll')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('grund')
                .setDescription('Der Grund für den Bann')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return await interaction.reply({
                content: 'Du hast keine Rechte!',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('grund');
        const currentTimestamp = Math.floor(Date.now() / 1000);
        
        try {
            const userEmbed = new EmbedBuilder()
                .setTitle('Du wurdest ausgeschlossen')
                .setDescription(`${interaction.user} hat dich vom Server: **${interaction.guild.name}** gebannt.\n\n` +
                              `Grund: ${reason}\n` +
                              `Am: <t:${currentTimestamp}:F>\n` +
                              `Länge: Permanent`)
                .setColor(colors.error)
                .setTimestamp()
                .setFooter({ text: `${interaction.guild.name} • Moderation` });

            try {
                await user.send({
                    content: `${user}`,
                    embeds: [userEmbed]
                });
            } catch (error) {
                console.log('Konnte keine DM an den User senden');
            }

            await interaction.guild.members.ban(user, { reason });
            const successEmbed = new EmbedBuilder()
                .setTitle('Spieler erfolgreich ausgeschlossen')
                .setDescription(`Du hast ${user} **erfolgreich** von **${interaction.guild.name}** gebannt.\n\n` +
                              `Grund: ${reason}\n` +
                              `Am: <t:${currentTimestamp}:F>\n` +
                              `Länge: Permanent`)
                .setColor(colors.error)
                .setFooter({ text: `ayo Remake`, iconURL: logoUrl });

            await interaction.reply({
                embeds: [successEmbed],
                allowedMentions: { users: [user.id] }
            });

        } catch (error) {
            console.error('Fehler beim Bannen:', error);
            await interaction.reply({
                content: '❌ Es gab einen Fehler beim Bannen des Users!',
                ephemeral: true
            });
        }
    },
};

// discord.gg/hope-leaks