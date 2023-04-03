require('dotenv').config()

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = process.env


// Create a new client instance
const client = new Client({ intents: 
    [ 
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        
    ] 
});

// Set the desired role ID and nicknames
const roleId = '1091133095308177539'; // Replace with the actual role ID
const guildId = '1090370325096697969'

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    const guild = client.guilds.cache.get(guildId);
    const role = guild.roles.cache.get(roleId);
    
    console.log(role.name)
});



// When a member joins a guild, run this code
client.on('guildMemberAdd', member => {
    // Send a welcome message to the channel
    console.log("new user joined.")
    try {
        member.roles.add(roleId);
        console.log(`New Role Added to ${member.name}`)

        console.log(member.user.username)

    } catch (err) {
        console.log(err)
    }

});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;

    const addedRole = newRoles.find(role => !oldRoles.has(role.id));

    if (!addedRole) return 

    const nickName = addedRole.name.split("」")
    
    newMember.setNickname(`${nickName[0]}」 ${newMember.user.username}`)
        .catch(error => {
            console.error(`Failed to update nickname for user ${newMember.user.username}:`, error);
        });
});

client.on("messageCreate", msg => {
    // Ignore messages from bots
    if (msg.author.bot) return;

    // const currentNickname = msg.member.user.username
    // console.log(msg.member.user.username)
    // msg.member.setNickname("aa")
    // console.log(msg.member.user.username)
})

// Log in to Discord with your client's token
client.login(token);