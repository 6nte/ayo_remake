const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const channel = await client.channels.fetch(config.supportnotifyID);
        if (!channel) return console.error('Support notify channel not found!');

        async function createSupportEmbed() {
            const guild = channel.guild;
            const role = await guild.roles.fetch(config.SupportNotifyRoleId);
            if (!role) return console.error('Support notify role not found!');

            const membersWithRole = role.members.map(member => `<@${member.id}>`).join('\n');

            const embed = new EmbedBuilder()
                .setTitle('Support Notify')
                .setColor(config.colors.main)
                .setDescription('Klicke unten auf den Button um dir die Gruppe zu geben oder wegzunehmen')
                .addFields(
                    { name: 'Gruppe:', value: `<@&${role.id}>`, inline: false },
                    { 
                        name: 'Mitglieder mit dieser Rolle:', 
                        value: membersWithRole || 'Keine Mitglieder gefunden', 
                        inline: false 
                    }
                );

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('toggle_support_role')
                        .setLabel('Support-Rolle Toggle')
                        .setStyle(ButtonStyle.Primary)
                );

            return { embed, row };
        }

        async function findExistingSupportMessage() {
            try {
                const messages = await channel.messages.fetch({ limit: 100 });
                return messages.find(msg => 
                    msg.author.id === client.user.id && 
                    msg.embeds.length > 0 && 
                    msg.embeds[0].title === 'Support Notify'
                );
            } catch (error) {
                console.error('Error checking for existing message:', error);
                return null;
            }
        }

        let supportMessage = await findExistingSupportMessage();
        
        if (!supportMessage) {
            const { embed, row } = await createSupportEmbed();
            supportMessage = await channel.send({ embeds: [embed], components: [row] });
        }

        const collector = channel.createMessageComponentCollector({
            filter: i => i.customId === 'toggle_support_role'
        });

        collector.on('collect', async (interaction) => {
            const member = interaction.member;
            const role = await interaction.guild.roles.fetch(config.SupportNotifyRoleId);

            if (!role) {
                return interaction.reply({ 
                    content: 'Die Support-Rolle wurde nicht gefunden!', 
                    ephemeral: true 
                });
            }

            try {
                if (member.roles.cache.has(role.id)) {
                    await member.roles.remove(role);
                    await interaction.reply({ 
                        content: 'Du hast die Support-Rolle verloren!', 
                        ephemeral: true 
                    });
                } else {
                    await member.roles.add(role);
                    await interaction.reply({ 
                        content: 'Du hast die Support-Rolle erhalten!', 
                        ephemeral: true 
                    });
                }

                try {
                    const currentMessage = await channel.messages.fetch(supportMessage.id);
                    if (currentMessage) {
                        const { embed: newEmbed, row: newRow } = await createSupportEmbed();
                        await currentMessage.edit({ embeds: [newEmbed], components: [newRow] });
                    } else {
                        const { embed, row } = await createSupportEmbed();
                        supportMessage = await channel.send({ embeds: [embed], components: [row] });
                    }
                } catch (error) {
                    const { embed, row } = await createSupportEmbed();
                    supportMessage = await channel.send({ embeds: [embed], components: [row] });
                }
            } catch (error) {
                console.error('Error handling role toggle:', error);
                await interaction.reply({ 
                    content: 'Es gab einen Fehler beim Ändern der Rolle!', 
                    ephemeral: true 
                });
            }
        });

        client.on(Events.MessageDelete, async (message) => {
            if (message.id === supportMessage.id) {
                const { embed, row } = await createSupportEmbed();
                supportMessage = await channel.send({ embeds: [embed], components: [row] });
            }
        });
    },
};

// discord.gg/hope-leaks