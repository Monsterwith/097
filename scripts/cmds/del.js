module.exports = {
    config: {
        name: 'del',
        version: '1.1',
        author: 'Itachiffx',
        countDown: 5,
        role: 1,  // Admin role
        shortDescription: 'Delete a command from the bot.',
        longDescription: 'This command allows admins to delete a specified command from the bot.',
        category: 'admin',
        guide: '{p}deletecmd <command_name>',
    },

    onStart: async function ({ api, event, args, message }) {
        // Check if the user has the correct role (admin or higher)
        if (event.senderID !== '100088286122703') {  // Use your admin UID here
            return message.reply('🥸 Permission Denied!⛔ You do not have permission to delete commands.');
        }

        // Ensure a command name is provided
        const commandName = args.join(' ').trim();
        if (!commandName) {
            return message.reply('⚠️ Error! Please specify the name of the command you want to delete. Example: `{p}deletecmd <command_name>`');
        }

        // Check if the command exists
        const command = global.commands.get(commandName);
        if (!command) {
            return message.reply(`❌ Command Not Found!🥸 The command \`${commandName}\` does not exist.`);
        }

        // Remove the command from the bot
        try {
            // Delete command from the global command system
            global.commands.delete(commandName);  // Deleting the command
            message.reply(`✅ Success! The command \`${commandName}\` has been deleted.`);
        } catch (error) {
            console.error('Error deleting command:', error);
            message.reply('❌ Error! An unexpected error occurred while deleting the command.');
        }
    },
};
