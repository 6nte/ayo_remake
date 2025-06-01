const { 
    Events, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits
} = require('discord.js');
const { ticketCategories, teamRoleId, transcriptLogChannelId, logoUrl, bannerUrl, colors } = require('../config.json');
const discordTranscripts = require('discord-html-transcripts');
const fs = require('fs');
const path = require('path');

const transcriptsDir = path.join(__dirname, '..', 'transcripts');
if (!fs.existsSync(transcriptsDir)) {
    fs.mkdirSync(transcriptsDir);
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isStringSelectMenu() && !interaction.isButton()) return;

        if (interaction.customId === 'ticket_menu') {
            try {
                await interaction.deferReply({ ephemeral: true });

                const categoryValue = interaction.values[0];
                const categoryId = ticketCategories[categoryValue];
                const ticketName = `ticket-${interaction.user.username}`;

                const channel = await interaction.guild.channels.create({
                    name: ticketName,
                    type: ChannelType.GuildText,
                    parent: categoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: teamRoleId,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                    ],
                });

                const ticketEmbed = new EmbedBuilder()
                    .setTitle('🎫 Ticket Support')
                    .setDescription(`Willkommen ${interaction.user}!\nEin Team-Mitglied wird sich in Kürze um dein Anliegen kümmern.`)
                    .setColor(colors.info)
                    .setTimestamp()
                    .setThumbnail(logoUrl)
                    .setImage(bannerUrl)
                    .setFooter({ text: `${interaction.guild.name} • Ticket Support` });

                const buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('claim_ticket')
                            .setLabel('Ticket übernehmen')
                            .setEmoji('✋')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('close_ticket')
                            .setLabel('Ticket schließen')
                            .setEmoji('🔒')
                            .setStyle(ButtonStyle.Danger)
                    );

                await channel.send({
                    embeds: [ticketEmbed],
                    components: [buttons]
                });

                await interaction.editReply({
                    content: `✅ Dein Ticket wurde erstellt: ${channel}`,
                    ephemeral: true
                });

            } catch (error) {
                console.error('Fehler beim Erstellen des Tickets:', error);
                await interaction.editReply({
                    content: '❌ Es gab einen Fehler beim Erstellen des Tickets!',
                    ephemeral: true
                });
            }
        }

        if (interaction.customId === 'claim_ticket') {
            if (!interaction.member.roles.cache.has(teamRoleId)) {
                return await interaction.reply({
                    content: '❌ Du benötigst die Team-Rolle, um Tickets zu übernehmen!',
                    ephemeral: true
                });
            }

            const claimEmbed = new EmbedBuilder()
                .setTitle('🎫 Ticket übernommen')
                .setDescription(`Dieses Ticket wurde von ${interaction.user} übernommen.`)
                .setColor(colors.success)
                .setTimestamp()
                .setThumbnail(logoUrl)
                .setImage(bannerUrl)
                .setFooter({ text: `${interaction.guild.name} • Ticket Support` });

            await interaction.reply({ embeds: [claimEmbed] });
        }

        if (interaction.customId === 'close_ticket') {
            if (!interaction.member.roles.cache.has(teamRoleId)) {
                return await interaction.reply({
                    content: '❌ Du benötigst die Team-Rolle, um Tickets zu schließen!',
                    ephemeral: true
                });
            }

            try {
                const closeEmbed = new EmbedBuilder()
                    .setTitle('🔒 Ticket wird geschlossen')
                    .setDescription(`Das Ticket wurde von ${interaction.user} geschlossen.`)
                    .setColor(colors.error)
                    .setTimestamp()
                    .setThumbnail(logoUrl)
                    .setImage(bannerUrl)
                    .setFooter({ text: `${interaction.guild.name} • Ticket Support` });

                await interaction.reply({ embeds: [closeEmbed] });

                const fileName = `transcript-${interaction.channel.name}-${Date.now()}.html`;
                const attachment = await discordTranscripts.createTranscript(interaction.channel, {
                    filename: fileName,
                    saveImages: true,
                    poweredBy: false
                });

                fs.writeFileSync(
                    path.join(transcriptsDir, fileName),
                    attachment.attachment
                );

                const logChannel = interaction.guild.channels.cache.get(transcriptLogChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('📑 Ticket Transcript')
                        .setDescription(`Ticket: ${interaction.channel.name}\nGeschlossen von: ${interaction.user.tag}`)
                        .setColor(colors.info)
                        .setTimestamp()
                        .setThumbnail(logoUrl)
                        .setImage(bannerUrl)
                        .setFooter({ text: `${interaction.guild.name} • Ticket Support` });

                    await logChannel.send({
                        embeds: [logEmbed],
                        files: [attachment]
                    });
                }

                const ticketUser = interaction.guild.members.cache.find(
                    member => interaction.channel.name.includes(member.user.username.toLowerCase())
                );

                if (ticketUser) {
                    try {
                        const userEmbed = new EmbedBuilder()
                            .setTitle('📑 Dein Ticket Transcript')
                            .setDescription(`Hier ist das Transcript deines Tickets: ${interaction.channel.name}`)
                            .setColor(colors.info)
                            .setTimestamp()
                            .setThumbnail(logoUrl)
                            .setImage(bannerUrl)
                            .setFooter({ text: `${interaction.guild.name} • Ticket Support` });

                        await ticketUser.send({
                            embeds: [userEmbed],
                            files: [attachment]
                        });
                    } catch (error) {
                        console.error('Konnte Transcript nicht an User senden:', error);
                    }
                }

                setTimeout(() => {
                    interaction.channel.delete()
                        .catch(error => console.error('Fehler beim Löschen des Channels:', error));
                }, 5000);

            } catch (error) {
                console.error('Fehler beim Schließen des Tickets:', error);
                await interaction.reply({
                    content: '❌ Es gab einen Fehler beim Schließen des Tickets!',
                    ephemeral: true
                });
            }
        }
    },
};

// discord.gg/hope-leaks