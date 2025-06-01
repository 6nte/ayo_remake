const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { adminRoleId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Stellt den Slowmode für diesen Channel ein')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Wähle die Slowmode-Zeit')
                .setRequired(true)
                .addChoices(
                    { name: '5 Sekunden', value: '5' },
                    { name: '10 Sekunden', value: '10' },
                    { name: '15 Sekunden', value: '15' },
                    { name: '30 Sekunden', value: '30' },
                    { name: '1 Minute', value: '60' },
                    { name: '2 Minuten', value: '120' },
                    { name: '5 Minuten', value: '300' },
                    { name: '10 Minuten', value: '600' },
                    { name: '15 Minuten', value: '900' },
                    { name: '30 Minuten', value: '1800' },
                    { name: '1 Stunde', value: '3600' },
                    { name: '2 Stunden', value: '7200' },
                    { name: '6 Stunden', value: '21600' }
                )),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return await interaction.reply({
                content: '❌ Du benötigst die Admin-Rolle, um diesen Befehl zu verwenden!',
                ephemeral: true
            });
        }

        const seconds = parseInt(interaction.options.getString('time'));
        
        try {
            await interaction.channel.setRateLimitPerUser(seconds);
            
            let timeString;
            if (seconds < 60) {
                timeString = `${seconds} Sekunden`;
            } else if (seconds < 3600) {
                timeString = `${Math.floor(seconds / 60)} Minuten`;
            } else {
                timeString = `${Math.floor(seconds / 3600)} Stunden`;
            }

            await interaction.reply({
                content: `✅ Slowmode wurde auf **${timeString}** eingestellt!`
            });

        } catch (error) {
            console.error('Fehler beim Setzen des Slowmodes:', error);
            await interaction.reply({
                content: '❌ Es gab einen Fehler beim Einstellen des Slowmodes!',
                ephemeral: true
            });
        }
    },
};

// discord.gg/hope-leaks