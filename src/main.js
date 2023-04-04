require('dotenv').config()
const { createCanvas, loadImage } = require('canvas');

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
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


const setMembersCount = async (eventData, isJoined) => {
    const membersCountName = '「📊」ᴍᴇᴍʙᴇʀꜱ:'
    const membersCountChannel = client.channels.cache.get('1091143370476355594')
    console.log(membersCountChannel)
    console.log(eventData.guild.members.cache.size)
    console.log((isJoined ? 1 : 0))
    const memberCount = eventData.guild.members.cache.size + (isJoined ? 1 : 0)
    console.log(memberCount)
    try {
        await membersCountChannel.setName(`${membersCountName} ${memberCount}`)
    } catch (error) {
        console.error(`Error updating channel name: ${error}`)
    }
}

// When a member joins a guild, run this code
client.on('guildMemberAdd', async member => {
    // Send a welcome message to the channel
    try {
        member.roles.add(roleId);
        setMembersCount(member, true)
        const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === '1091734945732493312');
        if (!welcomeChannel) return;
     
         // Check if the message content starts with "!welcome"
        const canvas = createCanvas(486, 104);
        const context = canvas.getContext('2d');
    
        // Background image
        const background = await loadImage('materials/banner.jpg');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
    
        context.save();
        let avatarLink = member.user.displayAvatarURL({ format: 'png' }).replace(".webp", ".png")
        // User avatar
        const avatar = await loadImage(avatarLink);
        const centerX = 15 + 75 / 2;
        const centerY = 15 + 75 / 2;
        const radius = 75 / 2;
        // Create a circular path
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.closePath();
        context.clip();
        context.drawImage(avatar, 15, 15, 75, 75);
        // Draw the white border
        context.strokeStyle = '#ffffff';
        context.lineWidth = 3; // Adjust this value to change the border thickness
        context.stroke();
    
        // Reset the clipping region
        context.restore();
    
        // Text
        context.font = '24px sans-serif';
        context.fillStyle = '#ffffff';
        const text = `Welcome ${member.user.username}`;
        const textMetrics = context.measureText(text);
        const textWidth = textMetrics.width;
    
        // Calculate the starting position for centered text
        const startX = (canvas.width - textWidth) / 2;
    
        // Draw the centered text
        context.fillText(text, startX, 60);
    
    
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-image.png' });
    
        welcomeChannel.send({ content: `Welcome ${member.user.toString()} to ${member.guild.name}!`, files: [attachment] });
    
    } catch (err) {
        console.log(err)
    }

});

client.on(Events.GuildMemberRemove, member => {
    setMembersCount(member, false)
})

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

client.on("messageCreate", async msg => {
     // Ignore messages from bots
    if (msg.author.bot) return;
})

// Log in to Discord with your client's token
client.login(token);