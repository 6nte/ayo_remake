const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    const abmeldung = require('../commands/abmeldung.js');
if (interaction.isButton()) {
  await abmeldung.handleButton(interaction);
}

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ 
          content: 'Bei der Ausführung des Befehls ist ein Fehler aufgetreten!', 
          ephemeral: true 
        });
      } else {
        await interaction.reply({ 
          content: 'Bei der Ausführung des Befehls ist ein Fehler aufgetreten!', 
          ephemeral: true 
        });
      }
    }
  },
};

// discord.gg/hope-leaks