const { Events } = require('discord.js');
const { verifyRoleId } = require('../config.json');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'verify-button') {
            try {
                const member = interaction.member;
                const verifyRole = interaction.guild.roles.cache.get(verifyRoleId);

                if (!verifyRole) {
                    return await interaction.reply({
                        content: 'Die Verifizierungs-Rolle wurde nicht gefunden! Bitte kontaktiere einen Administrator.',
                        ephemeral: true
                    });
                }

                if (member.roles.cache.has(verifyRoleId)) {
                    return await interaction.reply({
                        content: 'Du bist bereits verifiziert!',
                        ephemeral: true
                    });
                }

                await member.roles.add(verifyRole);
                
                await interaction.reply({
                    content: '✅ Du wurdest erfolgreich verifiziert!',
                    ephemeral: true
                });

            } catch (error) {
                console.error('Fehler bei der Verifizierung:', error);
                await interaction.reply({
                    content: 'Es gab einen Fehler bei der Verifizierung! Bitte kontaktiere einen Administrator.',
                    ephemeral: true
                });
            }
        }
    },
};

// discord.gg/hope-leaks