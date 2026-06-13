const {
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder, 
    ActionRowBuilder, 
    ComponentType
} = require('discord.js ');

const data = {
    name: 'show-pets',
    description: 'show-pets desc'
} 

async function run ({interaction}) {
    const pets = [
        {
            label: 'Dog',
            description: 'Dog desc',
            value: 'dog'
        },
        {
            label: 'Cat',
            description: 'Cat desc',
            value: 'cat'
        }
    ];

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(interaction.id)
        .setPlaceholder('Select a pet')
        .setMinValues(0)
        .setMinValues(pets.length)
        .addOptions(
            pets.map((pet) => 
                new StringSelectMenuOptionBuilder)
                .setLabel(pet.label)
                .setDescription(pet.description)
        );

    const actionRow = new ActionRowBuilder.addComponents(selectMenu);

    interaction.reply({
        components: [actionRow]
    });
};

module.exports = {data, run};