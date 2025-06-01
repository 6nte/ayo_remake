const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { vorschlagChannelId, logoUrl, bannerUrl, colors } = require('../config.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('vorschlag')
        .setDescription('Reiche einen Vorschlag ein')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Dein Vorschlag')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const vorschlagChannel = interaction.client.channels.cache.get(vorschlagChannelId);
            
            if (!vorschlagChannel) {
                return await interaction.reply({
                    content: 'Der Vorschlag-Kanal wurde nicht gefunden!',
                    ephemeral: true
                });
            }

            const vorschlagText = interaction.options.getString('text');
            const vorschlagEmbed = new EmbedBuilder()
                .setColor(colors.main)
                .setTitle('Neuer Vorschlag')
                .setDescription(`${interaction.user} hat einen Vorschlag eingereicht  \n \n Vorschlag: **${vorschlagText}** \n\n \`/vorschlag\` um einen **Vorschlag** einzureichen`)
                .setThumbnail(logoUrl)
                .setImage(bannerUrl)
                .setTimestamp()
                .setFooter({ text: `Vorschlag von ${interaction.user.tag}` });

            const vorschlagMessage = await vorschlagChannel.send({ embeds: [vorschlagEmbed] });
            
            await vorschlagMessage.react('✅');
            await vorschlagMessage.react('❌');

            await interaction.reply({
                content: `Dein Vorschlag wurde erfolgreich im ${vorschlagChannel} eingereicht!`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Fehler beim Erstellen des Vorschlags:', error);
            await interaction.reply({
                content: 'Es gab einen Fehler beim Erstellen deines Vorschlags!',
                ephemeral: true
            });
        }
    },
};

// discord.gg/hope-leaks