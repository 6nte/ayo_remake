const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder 
} = require('discord.js');
const { adminRoleId, logoUrl, bannerUrl, colors } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendticket')
        .setDescription('Sendet das Ticket-Panel'),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return await interaction.reply({
                content: 'Du hast keine Berechtigung, diesen Befehl zu verwenden!',
                ephemeral: true
            });
        }

        try {
            const ticketEmbed = new EmbedBuilder()
                .setTitle('🎫 Ticket Support')
                .setDescription('Wähle eine Kategorie aus dem Dropdown-Menü aus, um ein Ticket zu erstellen.')
                .setColor(colors.info)
                .setTimestamp()
                .setThumbnail(logoUrl)
                .setImage(bannerUrl)
                .setFooter({ text: `${interaction.guild.name} • ${new Date().toISOString().slice(0, 10)}` });

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('ticket_menu')
                        .setPlaceholder('Wähle eine Kategorie')
                        .addOptions([
                            {
                                label: 'Allgemeine Fragen',
                                description: 'Stelle allgemeine Fragen zum Server',
                                value: 'category1',
                                emoji: '❓'
                            },
                            {
                                label: 'Fraktionsbewerbung',
                                description: 'Bewirb dich für eine Fraktion',
                                value: 'category2',
                                emoji: '📝'
                            },
                            {
                                label: 'Donation Anliegen',
                                description: 'Fragen zu Donations',
                                value: 'category3',
                                emoji: '💰'
                            },
                            {
                                label: 'Problem Anliegen',
                                description: 'Melde ein Problem',
                                value: 'category4',
                                emoji: '⚠️'
                            },
                            {
                                label: 'Partner Anliegen',
                                description: 'Партнерство und Kooperationen',
                                value: 'category5',
                                emoji: '🤝'
                            }
                        ])
                );

            await interaction.channel.send({
                embeds: [ticketEmbed],
                components: [row]
            });

            await interaction.reply({
                content: '✅ Ticket-Panel wurde erfolgreich gesendet!',
                ephemeral: true
            });

        } catch (error) {
            console.error('Fehler beim Senden des Ticket-Panels:', error);
            await interaction.reply({
                content: '❌ Es gab einen Fehler beim Senden des Ticket-Panels!',
                ephemeral: true
            });
        }
    },
};

// discord.gg/hope-leaks