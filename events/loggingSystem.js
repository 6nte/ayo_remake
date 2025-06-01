const { 
    Events, 
    EmbedBuilder, 
    AuditLogEvent 
} = require('discord.js');
const { logs, logoUrl, bannerUrl, colors } = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.on(Events.GuildMemberAdd, async member => {
            const channel = member.guild.channels.cache.get(logs.memberLog);
            if (!channel) return;

            try {
                const embed = new EmbedBuilder()
                    .setTitle('👋 Member Beigetreten')
                    .setDescription(`${member.user.tag} ist dem Server beigetreten.`)
                    .addFields([
                        { 
                            name: 'Account erstellt', 
                            value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
                            inline: true 
                        }
                    ])
                    .setColor(colors.success)
                    .setTimestamp()
                    .setThumbnail(logoUrl)
                    .setImage(bannerUrl)
                    .setFooter({ text: `ID: ${member.id}` });

                await channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Fehler beim Logging eines Joins:', error);
            }
        });

        client.on(Events.ChannelCreate, async channel => {
            if (!channel.guild) return;
            
            const logChannel = channel.guild.channels.cache.get(logs.channelLog);
            if (!logChannel) return;

            try {
                const auditLog = await channel.guild.fetchAuditLogs({
                    type: AuditLogEvent.ChannelCreate,
                    limit: 1
                });
                const channelLog = auditLog.entries.first();

                const embed = new EmbedBuilder()
                    .setTitle('📝 Channel Erstellt')
                    .setDescription(`Channel ${channel.name} wurde erstellt`)
                    .addFields([
                        { 
                            name: 'Erstellt von', 
                            value: channelLog?.executor?.tag || 'Unbekannt',
                            inline: true 
                        },
                        { 
                            name: 'Channel Typ', 
                            value: channel.type || 'Unbekannt',
                            inline: true 
                        }
                    ])
                    .setColor(colors.success)
                    .setTimestamp()
                    .setThumbnail(logoUrl)
                    .setImage(bannerUrl)
                    .setFooter({ text: `ID: ${channel.id}` });

                await logChannel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Fehler beim Logging einer Channel-Erstellung:', error);
            }
        });

        client.on(Events.ChannelDelete, async channel => {
            if (!channel.guild) return;
            
            const logChannel = channel.guild.channels.cache.get(logs.channelLog);
            if (!logChannel) return;

            try {
                const auditLog = await channel.guild.fetchAuditLogs({
                    type: AuditLogEvent.ChannelDelete,
                    limit: 1
                });
                const channelLog = auditLog.entries.first();

                const embed = new EmbedBuilder()
                    .setTitle('🗑️ Channel Gelöscht')
                    .setDescription(`Channel ${channel.name} wurde gelöscht`)
                    .addFields([
                        { 
                            name: 'Gelöscht von', 
                            value: channelLog?.executor?.tag || 'Unbekannt',
                            inline: true 
                        }
                    ])
                    .setColor(colors.error)
                    .setTimestamp()
                    .setThumbnail(logoUrl)
                    .setImage(bannerUrl)
                    .setFooter({ text: `ID: ${channel.id}` });

                await logChannel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Fehler beim Logging einer Channel-Löschung:', error);
            }
        });

        client.on(Events.GuildRoleCreate, async role => {
            const channel = role.guild.channels.cache.get(logs.roleLog);
            if (!channel) return;

            try {
                const auditLog = await role.guild.fetchAuditLogs({
                    type: AuditLogEvent.RoleCreate,
                    limit: 1
                });
                const roleLog = auditLog.entries.first();

                const embed = new EmbedBuilder()
                    .setTitle('👥 Rolle Erstellt')
                    .setDescription(`Rolle ${role.name} wurde erstellt`)
                    .addFields([
                        { 
                            name: 'Erstellt von', 
                            value: roleLog?.executor?.tag || 'Unbekannt',
                            inline: true 
                        }
                    ])
                    .setColor(colors.success)
                    .setTimestamp()
                    .setThumbnail(logoUrl)
                    .setImage(bannerUrl)
                    .setFooter({ text: `ID: ${role.id}` });

                await channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Fehler beim Logging einer Rollenerstellung:', error);
            }
        });

        client.on(Events.GuildRoleDelete, async role => {
            const channel = role.guild.channels.cache.get(logs.roleLog);
            if (!channel) return;

            try {
                const auditLog = await role.guild.fetchAuditLogs({
                    type: AuditLogEvent.RoleDelete,
                    limit: 1
                });
                const roleLog = auditLog.entries.first();

                const embed = new EmbedBuilder()
                    .setTitle('👥 Rolle Gelöscht')
                    .setDescription(`Rolle ${role.name} wurde gelöscht`)
                    .addFields([
                        { 
                            name: 'Gelöscht von', 
                            value: roleLog?.executor?.tag || 'Unbekannt',
                            inline: true 
                        }
                    ])
                    .setColor(colors.error)
                    .setTimestamp()
                    .setThumbnail(logoUrl)
                    .setImage(bannerUrl)
                    .setFooter({ text: `ID: ${role.id}` });

                await channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Fehler beim Logging einer Rollenlöschung:', error);
            }
        });

        client.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
            const channel = newRole.guild.channels.cache.get(logs.roleLog);
            if (!channel) return;

            try {
                if (oldRole.name !== newRole.name) {
                    const embed = new EmbedBuilder()
                        .setTitle('👥 Rolle Aktualisiert')
                        .setDescription('Rollenname wurde geändert')
                        .addFields([
                            { name: 'Alter Name', value: oldRole.name, inline: true },
                            { name: 'Neuer Name', value: newRole.name, inline: true }
                        ])
                        .setColor(colors.warning)
                        .setTimestamp()
                        .setThumbnail(logoUrl)
                        .setImage(bannerUrl)
                        .setFooter({ text: `ID: ${newRole.id}` });

                    await channel.send({ embeds: [embed] });
                }
            } catch (error) {
                console.error('Fehler beim Logging einer Rollenänderung:', error);
            }
        });

        client.on(Events.MessageDelete, async message => {
            if (!message.guild || message.author?.bot) return;
            
            const channel = message.guild.channels.cache.get(logs.messageLog);
            if (!channel) return;

            try {
                const embed = new EmbedBuilder()
                    .setTitle('🗑️ Nachricht Gelöscht')
                    .setDescription(`Eine Nachricht von ${message.author?.tag || 'Unbekannt'} wurde in ${message.channel} gelöscht`)
                    .addFields([
                        { 
                            name: 'Inhalt', 
                            value: message.content || 'Keine Nachricht (möglicherweise ein Embed)',
                            inline: false 
                        }
                    ])
                    .setColor(colors.error)
                    .setTimestamp()
                    .setThumbnail(logoUrl)
                    .setImage(bannerUrl)
                    .setFooter({ text: `ID: ${message.id}` });

                await channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Fehler beim Logging einer gelöschten Nachricht:', error);
            }
        });
    }
};


// discord.gg/hope-leaks