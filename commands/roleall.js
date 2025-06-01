const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { adminRoleId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleall')
        .setDescription('Gibt allen Mitgliedern eine bestimmte Rolle')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Die Rolle, die allen gegeben werden soll')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return await interaction.reply({
                content: '❌ Du benötigst die Admin-Rolle, um diesen Befehl zu verwenden!',
                ephemeral: true
            });
        }

        const role = interaction.options.getRole('role');
        
        if (!role.editable) {
            return await interaction.reply({
                content: '❌ Ich kann diese Rolle nicht vergeben, da sie über meiner höchsten Rolle liegt!',
                ephemeral: true
            });
        }

        await interaction.deferReply(); 

        try {
            const startEmbed = new EmbedBuilder()
                .setColor(colors.success)
                .setTitle('Die Rollenverteilung hat begonnen')
                .setDescription(`❗ Die Rolle ${role} wird an alle Member verteilt.`)
                .setThumbnail("logoUrl")
                .setImage("bannerUrl")
                .setTimestamp();

            await interaction.editReply({ embeds: [startEmbed] });

            const members = await interaction.guild.members.fetch();
            let count = 0;

            for (const [id, member] of members) {
                if (!member.user.bot && !member.roles.cache.has(role.id)) {
                    await member.roles.add(role).catch(console.error);
                    count++;
                }
            }

            const finishEmbed = new EmbedBuilder()
                .setColor(colors.success)
                .setTitle('Rollen verteilen abgeschlossen')
                .setDescription(`✅ Es wurden an ${count} Member die ${role} Rolle verteilt.`)
                .setThumbnail("logoUrl")
                .setImage("bannerUrl")
                .setTimestamp();

            await interaction.channel.send({ embeds: [finishEmbed] });

        } catch (error) {
            console.error('Fehler beim Verteilen der Rollen:', error);
            await interaction.editReply({
                content: '❌ Es gab einen Fehler beim Verteilen der Rollen!',
                ephemeral: true
            });
        }
    },
};

// discord.gg/hope-leaks