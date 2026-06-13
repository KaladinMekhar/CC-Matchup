const { Client, GatewayIntentBits } = require('discord.js');
const { MessageAttachment } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
//const sqlite3 = require('sqlite3').verbose();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
})


//get Token from silanah
const token = "";

const prefix = "/";
const registeredTeams = [];
const readyTeams = [];
const readyPlayers = [];
const readyPlayers247 = [];
let readyPlayersCopy = [];
var readyTeamsCombined = [];
const matchedTeams = [];
const matchesInProgress = [];
const matchesInProgressManual = [];
const autoMatchingMakingToggle = false;
const eventRegistrationToggle = false;
var nextSwissDate;
const swissTeams = [];
var db;
const months = ["January","February","March","April","May","June","July","August","September","October","November","December",];
const nonTeamRoles = ["1219469326017368125", "1219668613456334971", "1219476248170991619", "1219465533200535646", "1219461275663339612", "1219464796693332078", "1219461320668352553", "1305391923615367188", 
    "1243787225829736571", "1247687466262069258", "1219470690600878180", "1219865081748258857", "1219471273403613314", "1219461353224540220", "1222281821882945588", "1219476446746116206", "1219462462290792569", 
    "1219472322130346075", "1219462565105504397", "1219462623918293114", "1219472247648157696", "1219462803795083346", "1221922720741330974", "1219462663856193536", "1226302398184558723", "1219473654723776605", 
    "1240083595742150755", "1228554228553748520", "1243770514032558090", "1243788297298509859"];
var scrimJimTeams = [];
var scrimJimChannelId = "1339683418446757898";//shadesmar
//var scrimJimChannelId = "1328247500792008705";//rising stars
var scrimJimMessageId = "1339684638284841111";//shadesmar
//var scrimJimMessageId = "tbd";//shadesmar

client.on("ready", ()=> {
    console.log(`Logged in as ${client.user.tag}`);
    
    //connectDb();
    //dropTable();
    //createTable();
    //selectAllScrimResults();
    //selectAllScrimRecord();
    //deleteAllRows();
});

client.on("messageCreate", (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const userMessage = message.content.slice(prefix.length).split(" ");

    if(userMessage[0].toLowerCase() === "helpscrimjim") {
        var helpMsg = "";//"**List of commands**";
        helpMsg+="\n\n1) ***/ready TeamName*** e.g., /ready Kugane Drift";
        helpMsg+="\nUse this when your team is ready to play either when you first arrive or finish a set";
        helpMsg+="\n\n2) ***/teams***";
        helpMsg+="\nUse this when you want to check the status of all the teams currently ready";
        helpMsg+="\n\n3) ***/start TeamName vs OtherTeamName*** e.g., /start Kugane Drift vs Deadbeats";
        helpMsg+="\nUse this to CHANGE your ready status to playing another team";
        helpMsg+="\n\n4) ***/sets***";
        helpMsg+="\nUse this to show the ongoing sets";
        helpMsg+="\n\n5) ***/done TeamName***";
        helpMsg+="\nUse this to REMOVE your ready status and end all your matches";
        message.channel.send(helpMsg);

        //const visualGuide = new MessageAttachment("https://i.imgur.com/8bkR6Fd.png");
        //interaction.followUp({files: [visualGuide]});
    }

    if(userMessage[0].toLowerCase() === "ready") {
        if(message.content.indexOf(" ") >= 0) {
            var userMessageI = message.content.substring(message.content.indexOf(" ")+1);            
            var alreadyCheckedIn = false;
            var msgSend = "";
            if(readyTeams.length > 0) {
                for (i = 0; i < readyTeams.length; i++) {
                    if(readyTeams[i] === userMessageI) {
                        alreadyCheckedIn = true;
                        break;
                    }
                }
            }
            if(!alreadyCheckedIn) {
                readyTeams[readyTeams.length] = userMessageI;
                msgSend = "**"+userMessageI+"** has been marked as ready.";
                //message.channel.send("**"+userMessageI+"** has been marked as ready.");
            }
            else {
                msgSend = "**"+userMessageI+"** has been marked as ready.";
                //message.channel.send("**"+userMessageI+"** was already marked as ready.");
            }

            if(readyTeams.length > 0) {
                var readyTeamsMsg = "";
                for(var i=0;i<readyTeams.length;i++) {
                    readyTeamsMsg+="\n"+(i+1)+") "+readyTeams[i];
                }
                msgSend+= "\n\n**Ready teams:**"+readyTeamsMsg;
                //message.channel.send("**Ready teams:**\n"+readyTeamsMsg);
            }
            message.channel.send(msgSend);

            if(matchesInProgressManual.length > 0) {
                for (i = 0; i < matchesInProgressManual.length; i++) {
                    var matchInProgressManual = (matchesInProgressManual[i]+"").toLowerCase();
                    if(matchInProgressManual.indexOf(userMessageI.toLowerCase()) >=0) {
                        matchesInProgressManual.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    if(userMessage[0].toLowerCase() === "done") {
        if(message.content.indexOf(" ") >= 0) {
            var userMessageI = message.content.substring(message.content.indexOf(" ")+1);
            console.log(userMessageI);
            if(readyTeams.length > 0) {
                for (i = 0; i < readyTeams.length; i++) {
                    if(readyTeams[i] === userMessageI) {
                        readyTeams.splice(i, 1);
                    }
                }
            }
            if(matchesInProgressManual.length > 0) {
                for (i = 0; i < matchesInProgressManual.length; i++) {
                    var matchInProgressManual = (matchesInProgressManual[i]+"").toLowerCase();
                    if(matchInProgressManual.indexOf(userMessageI.toLowerCase()) >=0) {
                        matchesInProgressManual.splice(i, 1);
                    }
                }
            }
            message.channel.send("**"+userMessageI+"** has been marked as done and removed from all ongoing matches");
        }
    }

    if(userMessage[0].toLowerCase() === "teams") {
        console.log("/teams text used");
        var msgSend = "No teams are ready at present";
        if(readyTeams.length > 0) {
            var readyTeamsMsg = "";
            for(var i=0;i<readyTeams.length;i++) {
                readyTeamsMsg+="\n"+(i+1)+") "+readyTeams[i];
            }
            msgSend = "**Ready teams:**\n"+readyTeamsMsg;
        }
        message.channel.send(msgSend);
    }

    if(userMessage[0].toLowerCase() === "start") {
        const tempMsg = message.content;
        if(tempMsg.indexOf(" ") >= 0 && tempMsg.toLowerCase().indexOf("vs") >= 0) {
            var userMessageI = message.content.substring(message.content.indexOf(" ")+1);
            
            const estDateTime = new Date().toLocaleString("en-US", { timeZone: "US/Eastern" });
            const estTime = estDateTime.substring(estDateTime.indexOf(",")+2)+" (EST)";

            matchesInProgressManual[matchesInProgressManual.length] = userMessageI +". **Start time:** "+estTime;
            message.channel.send(userMessageI+" has been logged as match in progress");

            var team1 = (userMessageI.toLowerCase().substring(0, userMessageI.indexOf("vs"))).trim();
            var team2 = (userMessageI.toLowerCase().substring(userMessageI.indexOf("vs")+2)).trim();
                       

            if(readyTeams.length > 0) {
                for (i = 0; i < readyTeams.length; i++) {
                    const readyTeam = (readyTeams[i]+"").toLowerCase();
                    if(readyTeam=== team1) {
                        readyTeams.splice(i, 1);
                        i--;
                    }
                    if(readyTeam=== team2) {
                        readyTeams.splice(i, 1);
                        i--;
                    }
                }
            }
        }
    }

    if(userMessage[0].toLowerCase() === "sets") {
        if(matchesInProgressManual.length > 0) {
            var matchesInProgressMsg = "";
            for(var i=0;i<matchesInProgressManual.length;i++) {
                matchesInProgressMsg+="\n"+(i+1)+") "+matchesInProgressManual[i];
            }
            message.channel.send("**Matches in progress:**\n"+matchesInProgressMsg);
        }
        else
            message.channel.send("No matches in progress");
    }

    if(userMessage[0].toLowerCase() === "scheduleswiss") {//rarely used
        if(message.content.indexOf(" ") >= 0) {
            var userMessageI = message.content.substring(message.content.indexOf(" ")+1);

            nextSwissDate = userMessageI;
            var scheduleSwissMsg = "New Swiss scrims scheduled for **"+nextSwissDate+"**";
            scheduleSwissMsg+= "\nUse **/scheduleSwiss <date>** again to change the date";
            scheduleSwissMsg+= "\nUse **/cancelSwiss** to cancel";
            message.channel.send(scheduleSwissMsg);
        }
    }

    if(userMessage[0].toLowerCase() === "cancelswiss") {//rarely used
        nextSwissDate = "";
        var cancelSwissMsg = "Swiss cancelled and all teams have been deregistered";
        cancelSwissMsg+= "\nUse **/scheduleSwiss <date>** to schedule new Swiss scrims";
        if(swissTeams.length > 0) {
            for (i = 0; i < swissTeams.length; i++) {
                swissTeams.splice(i, 1);
                i--;
            }
        }
        message.channel.send(cancelSwissMsg);
    }

    if(userMessage[0].toLowerCase() === "whenswiss") {//rarely used
        if(nextSwissDate != null && nextSwissDate != "") {
            var whenSwissMsg = "Next Swiss scrims scheduled for **"+nextSwissDate+"**";
            whenSwissMsg+="\nUse **/registerSwiss <teamname>** to register your team";
            whenSwissMsg+="\nUse **/deregisterSwiss <teamname>** to register your team";
            message.channel.send(whenSwissMsg);
        }
        else
            message.channel.send("No Swiss scrims have been scheduled. Keep an eye out for announcements");
    }
    
    if(userMessage[0].toLowerCase() === "registerswiss") {//rarely used
        if(nextSwissDate != null && nextSwissDate != "") {
            if(message.content.indexOf(" ") >= 0) {
                var userMessageI = message.content.substring(message.content.indexOf(" ")+1);            
                var alreadyRegistered = false;
                var registerSwissMsg = "";
                if(swissTeams.length > 0) {
                    for (i = 0; i < swissTeams.length; i++) {
                        if(swissTeams[i] === userMessageI) {
                            alreadyRegistered = true;
                            break;
                        }
                    }
                }
                if(!alreadyRegistered) {
                    swissTeams[swissTeams.length] = userMessageI;
                    registerSwissMsg = "**"+userMessageI+"** has been registered for next Swiss scrims on **"+nextSwissDate+"**";
                    registerSwissMsg+= "\nUse **deRegisterSwiss <teamname>** to deregister for Swiss";
                }
                else {
                    registerSwissMsg = "**"+userMessageI+"** has been registered for next Swiss scrims on **"+nextSwissDate+"**";
                    registerSwissMsg+= "\nUse **deRegisterSwiss <teamname>** to deregister for Swiss";
                }

                if(swissTeams.length > 0) {
                    var swissTeamsMsg = "";
                    for(var i=0;i<swissTeams.length;i++) {
                        swissTeamsMsg+="\n"+(i+1)+") "+swissTeams[i];
                    }
                    registerSwissMsg+= "\n\n**Teams registered for next Swiss scrims on "+nextSwissDate+"**"+swissTeamsMsg;
                }
                message.channel.send(registerSwissMsg);

            }
        }
        else
            message.channel.send("No Swiss scrims have been scheduled. Keep an eye out for announcements");
    }

    if(userMessage[0].toLowerCase() === "deregisterswiss") {//rarely used
        if(message.content.indexOf(" ") >= 0) {
            var userMessageI = message.content.substring(message.content.indexOf(" ")+1);
            console.log(userMessageI);
            if(swissTeams.length > 0) {
                for (i = 0; i < swissTeams.length; i++) {
                    if(swissTeams[i] === userMessageI) {
                        swissTeams.splice(i, 1);
                    }
                }
            }
            message.channel.send("**"+userMessageI+"** has been deregistered from next Swiss scrims");
        }
    }

    if(userMessage[0].toLowerCase() === "swissteams") {//rarely used
        if(nextSwissDate != null && nextSwissDate != "") {
            if(swissTeams.length > 0) {
                var swissTeamsMsg = "";
                for(var i=0;i<swissTeams.length;i++) {
                    swissTeamsMsg+="\n"+(i+1)+") "+swissTeams[i];
                }
                message.channel.send("\n\n**Teams registered for next Swiss scrims on "+nextSwissDate+"**"+swissTeamsMsg);
            }
            else
                message.channel.send("No teams have registered for Swiss yet");
        }
        else
            message.channel.send("No Swiss scrims have been scheduled. Keep an eye out for announcements");
    }

    if(userMessage[0].toLowerCase() === "cc") {//incomplete
        if(nextSwissDate != null && nextSwissDate != "") {s
            if(swissTeams.length > 0) {
                var swissTeamsMsg = "";
                for(var i=0;i<swissTeams.length;i++) {
                    swissTeamsMsg+="\n"+(i+1)+") "+swissTeams[i];
                }
                message.channel.send("\n\n**Teams registered for next Swiss scrims on "+nextSwissDate+"**"+swissTeamsMsg);
            }
            else
                message.channel.send("No teams have registered for Swiss yet");
        }
        else
            message.channel.send("No Swiss scrims have been scheduled. Keep an eye out for announcements");
    }

    if(userMessage[0].toLowerCase() === "memberlist") {//incomplete
        console.log("in memberlist again");
        //console.log(interaction.member.roles.cache);
        //if(interaction.member.roles.cache.some(r => r.name == "Janitor")) {
            const id = '1015441442178596885';
            const guild = client.guilds.cache.find((g) => g.id === id);
            
            /*const members = guild.members.fetch();
            console.log(members);
            
            members.then(function(result) {
            console.log(result) // "Some User token"
            });
            */

/*
            members.forEach(member => {
                console.log(member.user.username);
            });
*/
            /*
            const list = client.guilds.cache.find((g) => g.id === id);
            // Iterate through the collection of GuildMembers from the Guild getting the username property of each member 
            list.members.forEach(member => console.log(member.user.username)); 
            */

            /*
            const guild = client.guilds.cache.get(id);
            
            if (!guild)
              return console.log(`Can't find any guild with the ID "${id}"`);
            
            guild.members.each(member => {
                console.log(member.user.username)
                let content = member.displayName + "_" + member.user.id + "_" + member.user.nickname + "_" + member.user.username
                    console.log(content)

                    // Do whatever you want with the current member
            });
            */

            
            //guild.members.fetch().then(console.log).catch(console.error);
/*
            //working
            const members = guild.members.cache;
            //const members = guild.members.fetch();
            //console.log(members);
            
            members.forEach(member => {
                //message.channel.send(member.user.username);
                console.log(member.user.username);
            });
  */          

            //guild.members.fetch({ force: true }).then(console.log("SFDDFS")).catch(console.error);

            // Get the Guild and store it under the variable "list"
            //const list = client.guilds.get("1015441442178596885"); 

            // Iterate through the collection of GuildMembers from the Guild getting the username property of each member 
            //list.members.forEach(member => console.log(member.user.username)); 


            guild.members.fetch({ force: true }).then(
                (members) => members.forEach((member) => console.log(member.user.username))
            );

        //}
    }

    if(userMessage[0].toLowerCase() === "checkout") {//unused
        var userMessageI = message.content.substring(message.content.indexOf(" ")+1);
        var checkedIn = false;
        if(readyTeams.length > 0) {
            for (i = 0; i < readyTeams.length; i++) {
                if(readyTeams[i] === userMessageI) {
                    readyTeams.splice(i, 1);
                    message.channel.send("**"+userMessageI+"** has been checked out.\n\nType ***/checkin teamname*** to check in.");
                    checkedIn = true;
                    break;
                }
            }
        }
        if(!checkedIn)
            message.channel.send("**"+userMessageI+"** was not checked in.\n\nType ***/checkin teamname*** to check in.");
    }

    if(userMessage[0].toLowerCase() === "readymatch") {//unused
        if(autoMatchingMakingToggle) {
            var userMessageI = message.content.substring(message.content.indexOf(" ")+1);
            var alreadyMarkedAsReady = false;
            if(readyTeams.length > 0) {
                for (i = 0; i < readyTeams.length; i++) {
                    if(readyTeams[i] === userMessageI) {
                        alreadyMarkedAsReady = true;
                        break;
                    }
                }
            }
            if(!alreadyMarkedAsReady) {
                readyTeams[readyTeams.length] = userMessageI;
                message.channel.send("**"+userMessageI+"** has been marked as Ready. Await your next opponent");
            }
            else
                message.channel.send("**"+userMessageI+"** was already been marked as Ready. Await your next opponent");
            
            if(matchesInProgress.length > 0) {
                for (var i in matchesInProgress) {
                    if((matchesInProgress[i]+"").includes(userMessageI)) {
                        matchesInProgress.splice(i, 1);
                        break;
                    }
                }
            }

            if(readyTeams.length >= 2) {
                if(matchedTeams.length != 0) {
                    for (i = 0; i < readyTeams.length; i++) {
                        if(i===0)
                            readyTeamsCombined = [];
                        for (j = i+1; j < readyTeams.length; j++) {
                            readyTeamsCombined[readyTeamsCombined.length] = readyTeams[i]+" VS "+readyTeams[j];
                            readyTeamsCombined[readyTeamsCombined.length] = readyTeams[j]+" VS "+readyTeams[i];
                        }
                    }
                    
                    loop1:
                    for (i = 0; i < readyTeamsCombined.length; i++) {
                        var readyToBeMatched = true;
                        loop2:
                        for (j = 0; j < matchedTeams.length; j++) {
                            if(readyTeamsCombined[i] === matchedTeams[j]) {
                                readyToBeMatched = false;
                                break loop2;
                            }
                        }
                        if(readyToBeMatched) {
                            var splitReadyTeams =  readyTeamsCombined[i].split(" VS ");
                            
                            message.channel.send("**Next match:** "+splitReadyTeams[0]+" VS "+splitReadyTeams[1]+"\n**Astra:** "+splitReadyTeams[0]+"\n**Umbra:** "+splitReadyTeams[1]+"\n\nPF to be setup by "+splitReadyTeams[0]+". Password **0000**");
                            matchedTeams[matchedTeams.length] = splitReadyTeams[0]+" VS "+splitReadyTeams[1];
                            matchedTeams[matchedTeams.length] = splitReadyTeams[1]+" VS "+splitReadyTeams[0];
                            matchesInProgress[matchesInProgress.length] = splitReadyTeams[0]+" VS "+splitReadyTeams[1];
                            
                            readyTeams.splice(readyTeams.indexOf(splitReadyTeams[0]), 1);
                            readyTeams.splice(readyTeams.indexOf(splitReadyTeams[1]), 1);
                            break loop1;
                        }
                    }
                }
                else {
                    message.channel.send("**Next match:** "+readyTeams[0]+" VS "+readyTeams[1]+"\n**Astra:** "+readyTeams[0]+"\n**Umbra:** "+readyTeams[1]+"\n\nPF to be setup by "+readyTeams[0]+". Password **0000**");
                    
                    matchedTeams[matchedTeams.length] = readyTeams[0]+" VS "+readyTeams[1];
                    matchedTeams[matchedTeams.length] = readyTeams[1]+" VS "+readyTeams[0];
                    matchesInProgress[matchesInProgress.length] = readyTeams[0]+" VS "+readyTeams[1];
                    
                    readyTeams.splice(0, 1);
                    readyTeams.splice(0, 1);
                }
            }
        }
    }

    if(userMessage[0].toLowerCase() === "showevent") {//unused
        if(eventRegistrationToggle) {
            var registeredTeamsMsg = "";
            if(registeredTeams.length > 0) {
                for(var i=0;i<registeredTeams.length;i++) {
                    registeredTeamsMsg+="\n"+registeredTeams[i];
                }
            }
            message.channel.send("**Next team scrims event:** "+eventDetails+"\n\n**Confirmed teams:** "+registeredTeamsMsg);
        }
    }

    /*
     if(userMessage[0].toLowerCase() === "register") {//unused
        if(eventRegistrationToggle) {
            teamAlreadyRegistered = false;
            var userMessageI = message.content.substring(message.content.indexOf(" ")+1);
            for (var i in registeredTeams) {
                if(registeredTeams[i] === userMessageI) {
                    message.channel.send("**"+userMessageI+"** is already registered for next event. Type /remove teamname to remove your team from next event");
                    teamAlreadyRegistered = true;
                    return;
                }
            }
            if(!teamAlreadyRegistered) {
                registeredTeams[registeredTeams.length] = userMessageI;
                message.channel.send("**"+userMessageI+"** is now registered for next event.");
                teamAlreadyRegistered = false;
            }
        }
    }

    if(userMessage[0].toLowerCase() === "remove") {//unused
        if(eventRegistrationToggle) {
            var userMessageI = message.content.substring(message.content.indexOf(" ")+1);
            var teamRemoved = false;
            for (var i in registeredTeams) {
                if(registeredTeams[i] === userMessageI) {
                    registeredTeams.splice(i, 1);
                    message.channel.send("**"+userMessageI+"** is now removed from next event.");
                    teamRemoved = true;
                    return;
                }
            }
            if(!teamRemoved)
                message.channel.send("**"+userMessageI+"** has not yet been registered for next event. Type /register teamname to register for next");
        }
    }
    */

});

client.on("interactionCreate", (interaction) => {
    if(interaction.isChatInputCommand) {
        
        if(interaction.commandName === "ready") {
            const teamName = interaction.options.getString("teamname");
            console.log("/ready command used -> "+teamName);

            var alreadyCheckedIn = false;
            var msgSend = "";
            if(readyTeams.length > 0) {
                for (i = 0; i < readyTeams.length; i++) {
                    if(readyTeams[i].toLowerCase() === teamName.toLowerCase()) {
                        alreadyCheckedIn = true;
                        break;
                    }
                }
            }
            if(!alreadyCheckedIn) {
                readyTeams[readyTeams.length] = teamName;
                msgSend = "**"+teamName+"** has been marked as ready.";
                //message.channel.send("**"+teamName+"** has been marked as ready.");
            }
            else {
                msgSend = "**"+teamName+"** has been marked as ready.";
                //message.channel.send("**"+teamName+"** was already marked as ready.");
            }

            if(readyTeams.length > 0) {
                var readyTeamsMsg = "";
                for(var i=0;i<readyTeams.length;i++) {
                    readyTeamsMsg+="\n"+(i+1)+") "+readyTeams[i];
                }
                msgSend+= "\n\n**Ready teams:**"+readyTeamsMsg;
                //message.channel.send("**Ready teams:**\n"+readyTeamsMsg);
            }
            interaction.reply(msgSend);

            if(matchesInProgressManual.length > 0) {
                for (i = 0; i < matchesInProgressManual.length; i++) {
                    var matchInProgressManual = (matchesInProgressManual[i]+"").toLowerCase();
                    if(matchInProgressManual.indexOf(teamName.toLowerCase()) >=0) {
                        matchesInProgressManual.splice(i, 1);
                        break;
                    }
                }
            }
        }

        if(interaction.commandName === "teams") {
            console.log("/teams command used");
            var msgSend = "No teams are ready at present";
            if(readyTeams.length > 0) {
                var readyTeamsMsg = "";
                for(var i=0;i<readyTeams.length;i++) {
                    readyTeamsMsg+="\n"+(i+1)+") "+readyTeams[i];
                }
                msgSend = "**Ready teams:**\n"+readyTeamsMsg;
            }
            interaction.reply(msgSend);
        }

        if(interaction.commandName === "start") {
            const team1 = interaction.options.getString("team1");
            const team2 = interaction.options.getString("team2");

            const estDateTime = new Date().toLocaleString("en-US", { timeZone: "US/Eastern" });
            const estTime = estDateTime.substring(estDateTime.indexOf(",")+2)+" (EST)";

            matchesInProgressManual[matchesInProgressManual.length] = team1+" vs "+team2 +". **Start time:** "+estTime;
            interaction.reply(team1+" vs "+team2+" has been logged as match in progress");

            if(readyTeams.length > 0) {
                for (i = 0; i < readyTeams.length; i++) {
                    const readyTeam = (readyTeams[i]+"").toLowerCase();
                    if(readyTeam=== team1.toLowerCase()) {
                        readyTeams.splice(i, 1);
                        i--;
                    }
                    if(readyTeam=== team2.toLowerCase()) {
                        readyTeams.splice(i, 1);
                        i--;
                    }
                }
            }
        }

        if(interaction.commandName === "done") {
            const teamName = interaction.options.getString("teamname");
            if(readyTeams.length > 0) {
                for (i = 0; i < readyTeams.length; i++) {
                    if(readyTeams[i].toLowerCase() === teamName.toLowerCase()) {
                        readyTeams.splice(i, 1);
                    }
                }
            }
            if(matchesInProgressManual.length > 0) {
                for (i = 0; i < matchesInProgressManual.length; i++) {
                    var matchInProgressManual = (matchesInProgressManual[i]+"").toLowerCase();
                    if(matchInProgressManual.indexOf(teamName.toLowerCase()) >=0) {
                        matchesInProgressManual.splice(i, 1);
                        i--;
                    }
                }
            }
            interaction.reply("**"+teamName+"** has been marked as done and removed from all ongoing matches");
        
        }

        if(interaction.commandName === "sets") {
            var msgSend = "No matches in progress"
            if(matchesInProgressManual.length > 0) {
                var matchesInProgressMsg = "";
                for(var i=0;i<matchesInProgressManual.length;i++) {
                    matchesInProgressMsg+="\n"+(i+1)+") "+matchesInProgressManual[i];
                }
                msgSend = "**Matches in progress:**\n"+matchesInProgressMsg;
            }
            interaction.reply(msgSend)
        }

        if(interaction.commandName === "result") {//unused
            //console.log(interaction.member.roles.cache);
            if(interaction.member.roles.cache.some(r => r.name == "Team Representative")) {
                const team1 = interaction.options.get("team1").role.name;
                const team2 = interaction.options.get("team2").role.name;
                const winner = interaction.options.get("winner").role.name;
                var score;
                if(interaction.options.get("score") != null)
                    score = interaction.options.get("score").value; 
                const scrimDateTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
                const scrimMonthYear = months[scrimDateTime.substring(0, scrimDateTime.indexOf("/"))-1]+" "+scrimDateTime.substring(scrimDateTime.indexOf(",")-4, scrimDateTime.indexOf(","));
                
                console.log("In result. team1 -> "+team1+" team2 -> "+team2+" winner -> "+winner+" score -> "+score+" scrimDateTime -> "+scrimDateTime+" scrimMonthYear -> "+scrimMonthYear);

                insertScrimResult(interaction, team1, team2, winner, score, scrimDateTime, scrimMonthYear);
            }
        }

        if(interaction.commandName === "removeresult") {//unused untested
            if(interaction.member.roles.cache.some(r => r.name == "Janitor")) {
                const team1 = interaction.options.get("team1").role.name;
                const team2 = interaction.options.get("team2").role.name;
                const scrimMonthYear = interaction.options.get("team2").role.name;
                
                console.log("In result. team1 -> "+team1+" team2 -> "+team2+" winner -> "+winner+" score -> "+score+" scrimDateTime -> "+scrimDateTime+" scrimMonthYear -> "+scrimMonthYear);

                insertScrimResult(interaction, team1, team2, winner, score, scrimDateTime, scrimMonthYear);
            }

        }

        if(interaction.commandName === "scrimboard") {//unused
            const scrimMonthYear = interaction.options.get("month").value+" "+interaction.options.get("year").value;
            
            console.log("In scrimboard. scrimMonthYear -> "+scrimMonthYear);

            selectScrimRecord(interaction, scrimMonthYear);
        }

        if(interaction.commandName === "24x7comp") {
            const allJobs = ["PLD", "WAR", "DRK", "GNB", "WHM", "SCH", "AST", "SGE", "MNK", "DRG", "NIN", "SAM", "RPR", "BRD", "MCH", "DNC", "BLM", "SMN", "RDM"];
    
            var random1 = Math.floor(Math.random() * allJobs.length);
            var random2 = Math.floor(Math.random() * allJobs.length);
            while (random2 === random1) {
                random2 = Math.floor(Math.random() * allJobs.length);
            }
            var random3 = Math.floor(Math.random() * allJobs.length);
            while (random3 === random1 || random3 === random2) {
                random3 = Math.floor(Math.random() * allJobs.length);
            }
            var random4 = Math.floor(Math.random() * allJobs.length);
            while (random4 === random1 || random4 === random2 || random4 === random3) {
                random4 = Math.floor(Math.random() * allJobs.length);
            }
            var random5 = Math.floor(Math.random() * allJobs.length);
            while (random5 === random1 || random5 === random2 || random5 === random3 || random5 === random4) {
                random5 = Math.floor(Math.random() * allJobs.length);
            }
            const astraComp = allJobs[random1] + ", " + allJobs[random2] + ", " + allJobs[random3] + ", " + allJobs[random4] + ", " + allJobs[random5];
    
            random1 = Math.floor(Math.random() * allJobs.length);
            random2 = Math.floor(Math.random() * allJobs.length);
            while (random2 === random1) {
                random2 = Math.floor(Math.random() * allJobs.length);
            }
            random3 = Math.floor(Math.random() * allJobs.length);
            while (random3 === random1 || random3 === random2) {
                random3 = Math.floor(Math.random() * allJobs.length);
            }
            random4 = Math.floor(Math.random() * allJobs.length);
            while (random4 === random1 || random4 === random2 || random4 === random3) {
                random4 = Math.floor(Math.random() * allJobs.length);
            }
            random5 = Math.floor(Math.random() * allJobs.length);
            while (random5 === random1 || random5 === random2 || random5 === random3 || random5 === random4) {
                random5 = Math.floor(Math.random() * allJobs.length);
            }
            const umbraComp = allJobs[random1] + ", " + allJobs[random2] + ", " + allJobs[random3] + ", " + allJobs[random4] + ", " + allJobs[random5];
            
            interaction.reply("**Astra: ** "+astraComp+"\n"+"**Umbra: ** "+umbraComp);
        }

        if(interaction.commandName === "24x7compbalanced") {
            const tankJobs = ["PLD", "WAR", "DRK", "GNB"];
            const healerJobs = ["WHM", "SCH", "AST", "SGE"];
            const meleeJobs = ["MNK", "DRG", "NIN", "SAM", "RPR"];
            const physRangedJobs = ["BRD", "MCH", "DNC"];
            const casterJobs = ["BLM", "SMN", "RDM"];
    
            var tankRandom = Math.floor(Math.random() * tankJobs.length);
            var healerRandom = Math.floor(Math.random() * healerJobs.length);
            var meleeRandom = Math.floor(Math.random() * meleeJobs.length);
            var physRangedRandom = Math.floor(Math.random() * physRangedJobs.length);
            var casterRandom = Math.floor(Math.random() * casterJobs.length);
            const astraComp = tankJobs[tankRandom] + ", " + healerJobs[healerRandom] + ", " + meleeJobs[meleeRandom] + ", " + physRangedJobs[physRangedRandom] + ", " + casterJobs[casterRandom];
    
            tankRandom = Math.floor(Math.random() * tankJobs.length);
            healerRandom = Math.floor(Math.random() * healerJobs.length);
            meleeRandom = Math.floor(Math.random() * meleeJobs.length);
            physRangedRandom = Math.floor(Math.random() * physRangedJobs.length);
            casterRandom = Math.floor(Math.random() * casterJobs.length);
            const umbraComp = tankJobs[tankRandom] + ", " + healerJobs[healerRandom] + ", " + meleeJobs[meleeRandom] + ", " + physRangedJobs[physRangedRandom] + ", " + casterJobs[casterRandom];
            
            interaction.reply("**Astra: ** "+astraComp+"\n"+"**Umbra: ** "+umbraComp);
        }
    
        if(interaction.commandName === "randomcomp") {
            const allJobs = ["PLD", "WAR", "DRK", "GNB", "WHM", "SCH", "AST", "SGE", "MNK", "DRG", "NIN", "SAM", "RPR", "BRD", "MCH", "DNC", "BLM", "SMN", "RDM"];
    
            var random1 = Math.floor(Math.random() * allJobs.length);
            var random2 = Math.floor(Math.random() * allJobs.length);
            while (random2 === random1) {
                random2 = Math.floor(Math.random() * allJobs.length);
            }
            var random3 = Math.floor(Math.random() * allJobs.length);
            while (random3 === random1 || random3 === random2) {
                random3 = Math.floor(Math.random() * allJobs.length);
            }
            var random4 = Math.floor(Math.random() * allJobs.length);
            while (random4 === random1 || random4 === random2 || random4 === random3) {
                random4 = Math.floor(Math.random() * allJobs.length);
            }
            var random5 = Math.floor(Math.random() * allJobs.length);
            while (random5 === random1 || random5 === random2 || random5 === random3 || random5 === random4) {
                random5 = Math.floor(Math.random() * allJobs.length);
            }
            const randomComp = allJobs[random1] + ", " + allJobs[random2] + ", " + allJobs[random3] + ", " + allJobs[random4] + ", " + allJobs[random5];
            
            interaction.reply(randomComp);
        }

        if(interaction.commandName === "add" || interaction.commandName === "a") {
            if(interaction.member.roles.cache.some(r => r.name == "Janitor")) {

                const member = interaction.options.get("playername").member;
                console.log("member -> "+member);

                const memberDisplayName = member.displayName;
                console.log("memberDisplayName -"+member.displayName);

                var alreadyAdded = false;
                var msgSend = "";
                if(readyPlayers.length > 0) {
                    for (i = 0; i < readyPlayers.length; i++) {
                        if(readyPlayers[i] === memberDisplayName) {
                            alreadyAdded = true;
                            break;
                        }
                    }
                }
                if(!alreadyAdded) {
                    readyPlayers[readyPlayers.length] = memberDisplayName;
                    msgSend = "**"+memberDisplayName+"** has been added to ready/wait list.";
                    msgSend += "\n**"+readyPlayers.length+"** players are ready right now.";
                }
                else {
                    msgSend = "**"+memberDisplayName+"** was already added to ready/wait list.";
                    msgSend += "\n**"+readyPlayers.length+"** players are ready right now.";
                }
                interaction.reply(msgSend);
            }
            //else
                //interaction.reply("Contact a Janitor. Or become one.");
        }

        if(interaction.commandName === "addbulk" || interaction.commandName === "ab") {
            if(interaction.member.roles.cache.some(r => r.name == "Janitor")) {

                var playerIndex = 1;
                while (playerIndex <= 20) {
                    paramName = "player"+playerIndex+"name";
                    
                    if(interaction.options.get(paramName) != null) {
                        const member = interaction.options.get(paramName).member;
                        addPlayerToReadyList(member);
                    }

                    playerIndex++;
                }
                
                var msgSend = "\n**"+readyPlayers.length+"** players are ready right now.";
                interaction.reply(msgSend);
            }
            //else
                //interaction.reply("Contact a Janitor. Or become one.");
        }

        if(interaction.commandName === "delete" || interaction.commandName === "r") {
            if(interaction.member.roles.cache.some(r => r.name == "Janitor")) {

                const member = interaction.options.get("playername").member;
                const memberDisplayName = member.displayName;
                var memberFound = false;

                if(readyPlayers.length > 0) {
                    for (i = 0; i < readyPlayers.length; i++) {
                        if(readyPlayers[i] === memberDisplayName) {
                            memberFound = true
                            readyPlayers.splice(i, 1);
                        }
                    }
                }
                if(!memberFound)
                    interaction.reply("**"+memberDisplayName+"** not found in ready/waiting list");
                else
                    interaction.reply("**"+memberDisplayName+"** has been removed from ready/waiting list");
            }
            //else
                //interaction.reply("Contact a Janitor. Or become one.");
        }

        if(interaction.commandName === "clear") {
            if(interaction.member.roles.cache.some(r => r.name == "Janitor")) {
                if(readyPlayers.length > 0) {
                    for (i = 0; i < readyPlayers.length; i++) {
                        readyPlayers.splice(i);
                    }
                }
                interaction.reply("All players removed from ready/wait list");
            }
            //else
                //interaction.reply("Contact a Janitor. Or become one.");
        }

        if(interaction.commandName === "see" || interaction.commandName === "v") {
            if(interaction.member.roles.cache.some(r => r.name == "Janitor")) {
                if(readyPlayers.length > 0) {
                    var readyPlayersMsg = "";
                    for(var i=0;i<readyPlayers.length;i++) {
                        readyPlayersMsg+="\n"+(i+1)+") "+readyPlayers[i];
                    }
                    interaction.reply("**Ready players:**\n"+readyPlayersMsg);
                }
                else
                    interaction.reply("No players are ready at present");
            }
            //else
                //interaction.reply("Contact a Janitor. Or become one.");
        }

        if(interaction.commandName === "manage" || interaction.commandName === "m") {
            if(interaction.member.roles.cache.some(r => r.name == "Janitor")) {
                const UserSelectMenu = new Discord.UserSelectMenuBuilder()
                    .setCustomId('inhouse-ready-players')
                    .setMinValues(1)
                    .setMaxValues(25);
                        
                // Create an action row
                const row = new Discord.ActionRowBuilder()
                    .setComponents(UserSelectMenu); // Select menus take up the whole row, so make sure there is a row for each select menu.

                // Send the message
                interaction.reply({ content: 'Choose a user', components: [row]});
            }
            //else
                //interaction.reply("Contact a Janitor. Or become one.");
        }

        if(interaction.customId === "inhouse-ready-players") {
            let selectedPlayers = [];

            interaction.values.forEach(async value => {
                selectedPlayers[selectedPlayers.length] = `${value}`
            })

            if(selectedPlayers.length > 0) {
                for (i = 0; i < selectedPlayers.length; i++) { //loop through list of players selected by janitor

                    let user = client.users.cache.get(selectedPlayers[i]);
                    let userDisplayName = user.displayName;
                    console.log("user: "+user);
                    console.log("displayName: "+userDisplayName);

                    var alreadyAdded = false;
                    if(readyPlayers.length > 0) {
                        for (j = 0; j < readyPlayers.length; j++) { //loop through list of players already marked as ready
                            if(readyPlayers[j] === userDisplayName) {
                                alreadyAdded = true;
                                break;
                            }
                        }
                    }
                    if(!alreadyAdded) {
                        readyPlayers[readyPlayers.length] = userDisplayName;
                    }

                }
            }
            console.log(readyPlayers);
            interaction.reply("**"+selectedPlayers.length+"** players added to ready list.\n**"+readyPlayers.length+"** players are ready right now.");
        }

        if(interaction.commandName === "createteams" || interaction.commandName === "ct") {
            interaction.reply(createInhouseTeams(readyPlayers, interaction));
            //interaction.reply("Contact a Janitor. Or become one.");
            console.log("interaction first -> "+interaction);
            console.log("readyPlayersCopy -> "+readyPlayersCopy);
        }

        if(interaction.commandName === "addfromvc" || interaction.commandName === "avc") {
            //let channelID = '550399409867718669'; //shadesmar General
            //let channelID = '1219464524911087646'; //Rising Stars Lobby
            let channelID = '1219853196223184978'; //Rising Stars Staff Chat
            console.log("1");
            //console.log(client.channels.cache.get(channelID).members);
            client.channels.cache.get(channelID).members.forEach((member) => {
                addPlayerToReadyList(member);
            });
            var msgSend = "\n**"+readyPlayers.length+"** players are ready right now.";
            interaction.reply(msgSend);
        }

        if(interaction.commandName === "testcolour") {

            //const guild = client.guilds.get("The_server_id");
            const role = interaction.guild.roles.cache.find(role => role.name === "Marked Ignore");
            console.log("testcolour role -> "+role.color);
            
            const embedTest = new Discord.EmbedBuilder()
            .setColor('00ff46')
            .setDescription("Testing colour");
            const embedTest1 = new Discord.EmbedBuilder()
            .setColor('206694')
            .setDescription("Testing colour1");
            interaction.reply({embeds: [embedTest, embedTest1]});

            //interaction.reply("```fix\n Heres some nice, dark green text\n```");
            //interaction.reply(`<@${288834707129368576}>`);
            
            /*
            if(interaction.member.roles.cache.some(r => r.name == "Janitor")) {
                interaction.member.roles
            }
            const member = interaction.options.get("playername").member;
            console.log("testcolour member -> "+member);

            const memberDisplayName = member.displayName;
            console.log("testcolour memberDisplayName -"+member.displayName);*/

        }

        if(interaction.commandName === "247in") {
            console.log("247in");

            var alreadyCheckedIn = false;
            var msgSend = "";
            var repl;
            if(readyPlayers247.length > 0) {
                for (i = 0; i < readyPlayers247.length; i++) {
                    if(readyPlayers247[i] === repl) {
                        alreadyCheckedIn = true;
                        break;
                    }
                }
            }

            if(!alreadyCheckedIn) {
                readyPlayers247[readyPlayers247.length] = repl;
                msgSend = "You are now marked as ready for 24x7";
            }
            else
                msgSend = "You were already marked as ready for 24x7";

            if(readyPlayers247.length > 0) {
                var readyPlayers247Msg = "";
                for(var i=0;i<readyPlayers247.length;i++) {
                    readyPlayers247Msg+="\n"+(i+1)+") "+readyPlayers247[i];
                }
                msgSend+= "\n\n**Ready players for 24x7:**"+readyPlayers247Msg;
            }
            message.channel.send(msgSend);

        }

        if(interaction.commandName === "register") {
            
            const teamName = interaction.options.getString("teamname");
            console.log("register team -> "+teamName);

            var alreadyRegistered = false;
            var msgSend = "";
            if(scrimJimTeams.length > 0) {
                for (i = 0; i < scrimJimTeams.length; i++) {
                    if(scrimJimTeams[i].toLowerCase() === teamName.toLowerCase()) {
                        alreadyRegistered = true;
                        break;
                    }
                }
            }
            if(!alreadyRegistered) {
                scrimJimTeams[scrimJimTeams.length] = teamName;
                msgSend = "**"+teamName+"** has been registered for next Scrim Jims. Use /remove to remove";
                //message.channel.send("**"+teamName+"** has been marked as ready.");
            }
            else {
                msgSend = "**"+teamName+"** was already registered for next Scrim Jims. Use /remove to remove";
                //message.channel.send("**"+teamName+"** was already marked as ready.");
            }

            var msgSendPin = "";
            if(scrimJimTeams.length > 0) {
                var scrimJimTeamsMsg = "";
                for(var i=0;i<scrimJimTeams.length;i++) {
                    scrimJimTeamsMsg+="\n"+(i+1)+") "+scrimJimTeams[i];
                }
                msgSendPin+= "\n\n**Registered teams:**"+scrimJimTeamsMsg;
                msgSend+=msgSendPin;
            }

            const channelStat = client.channels.cache.get(scrimJimChannelId).messages.fetch(scrimJimMessageId).then((msg) => {
                msg.edit(msgSendPin);
            });
            interaction.reply(msgSend);
        }

        if(interaction.commandName === "remove") {

            const teamName = interaction.options.getString("teamname");
            console.log("remove team -> "+teamName);

            var removed = false;
            if(scrimJimTeams.length > 0) {
                for (i = 0; i < scrimJimTeams.length; i++) {
                    if(scrimJimTeams[i].toLowerCase() === teamName.toLowerCase()) {
                        scrimJimTeams.splice(i, 1);
                        removed = true;
                    }
                }
            }

            var msgSend = "";
            if(removed)
                msgSend += "**" + teamName + "** has been removed from next Scrim Jims. Use /register to register";
            else
                msgSend += "**" + teamName + "** was not registered. Use /register to register";
            
            var msgSendPin = "";
            if(scrimJimTeams.length > 0) {
                var scrimJimTeamsMsg = "";
                for(var i=0;i<scrimJimTeams.length;i++) {
                    scrimJimTeamsMsg+="\n"+(i+1)+") "+scrimJimTeams[i];
                }
                msgSendPin+= "\n\n**Registered teams:**"+scrimJimTeamsMsg;
                msgSend+=msgSendPin;
            }

            const channelStat = client.channels.cache.get(scrimJimChannelId).messages.fetch(scrimJimMessageId).then((msg) => {
                msg.edit(msgSendPin);
            });
            interaction.reply(msgSend);
        }

        if(interaction.commandName === "view") {

            console.log("view");

            var msgSend = "";          
            if(scrimJimTeams.length > 0) {
                var scrimJimTeamsMsg = "";
                for(var i=0;i<scrimJimTeams.length;i++) {
                    scrimJimTeamsMsg+="\n"+(i+1)+") "+scrimJimTeams[i];
                }
                msgSend+= "\n\n**Registered teams:**"+scrimJimTeamsMsg;
            }
            else
            msgSend = "No teams registered yet";
            interaction.reply(msgSend);
        }

        if(interaction.commandName === "createMsg") {
            //const channel = client.channels.cache.get('1339683418446757898'); //shadesmar
            //const channel = client.channels.cache.get('1328247500792008705'); //rising stars
            //channel.send("Registered teams for next Scrim Jims: ");           
        }
    }
});

/*
function connectDb() {
    db = new sqlite3.Database("./db/monthlyScrimJimResults.db", sqlite3.OPEN_READWRITE, (err) => {
        if(err)
            return console.log(err.message);
        else
            console.log("DB connected");
    });
}
*/

function createTable() {//already created
    var createTableSql = "CREATE TABLE ScrimJimResults(team1, team2, winner, score, scrimDateTime, scrimMonthYear)";
    db.run(createTableSql);
    createTableSql = "CREATE TABLE ScrimJimRecord(team, wins number, scrimMonthYear)";
    db.run(createTableSql);
}

function dropTable() {//to be used in case of error
    var dropTableSql = "DROP TABLE ScrimJimResults";
    db.run(dropTableSql);
    dropTableSql = "DROP TABLE ScrimJimRecord";
    db.run(dropTableSql);
}

function deleteAllRows() {//to be used in case of error
    var deleteTableSql = "DELETE FROM ScrimJimResults";
    db.run(deleteTableSql);

    var deleteTableSql1 = "DELETE FROM ScrimJimRecord";
    db.run(deleteTableSql1);
}

function insertScrimResult(interaction, team1, team2, winner, score, scrimDateTime, scrimMonthYear) {//unused
    var insertSql;
    if(score != null) {
        insertSql = "INSERT INTO ScrimJimResults(team1, team2, winner, score, scrimDateTime, scrimMonthYear) VALUES(?, ?, ?, ?, ?, ?)";
        db.run(insertSql, [team1, team2, winner, score, scrimDateTime, scrimMonthYear], (err) => {
            if(err) {
                console.log(err.message);
                interaction.reply("There was an error. Contact Silanah");
            }
            else
                insertScrimRecord(interaction, team1, team2, winner, score, scrimDateTime, scrimMonthYear);//interaction.reply("Result logged successfully. If you made a mistake, contact a Janitor to remove the result.");
        });
    }
    else {
        insertSql = "INSERT INTO ScrimJimResults(team1, team2, winner, scrimDateTime, scrimMonthYear) VALUES(?, ?, ?, ?, ?)";
        db.run(insertSql, [team1, team2, winner, scrimDateTime, scrimMonthYear], (err) => {
            if(err) {
                console.log(err.message);
                interaction.reply("There was an error. Contact Silanah");
            }
            else
                insertScrimRecord(interaction, team1, team2, winner, score, scrimDateTime, scrimMonthYear);//interaction.reply("Result logged successfully. If you made a mistake, contact a Janitor to remove the result.");
        });
    }
}

function insertScrimRecord(interaction, team1, team2, winner, score, scrimDateTime, scrimMonthYear) {
    var team1Win = 0;
    if(team1 === winner)
        team1Win = 1;

    var team2Win = 0;
    if(team2 === winner)
        team2Win = 1;

    const insertSql1 = "INSERT INTO ScrimJimRecord(team, wins, scrimMonthYear) VALUES(?, ?, ?)";
    db.run(insertSql1, [team1, team1Win, scrimMonthYear], (err) => {
        if(err) {
            console.log(err.message);
            interaction.reply("There was an error. Contact Silanah");
        }
    });

    const insertSql2 = "INSERT INTO ScrimJimRecord(team, wins, scrimMonthYear) VALUES(?, ?, ?)";
    db.run(insertSql2, [team2, team2Win, scrimMonthYear], (err) => {
        if(err) {
            console.log(err.message);
            interaction.reply("There was an error. Contact Silanah");
        }
        else
            interaction.reply("Result logged successfully. If you made a mistake, contact a Janitor to remove the result.");
    });
}//unused

function selectScrimRecord(interaction, scrimMonthYear) {//unused

    const selectScrimRecordSql = "SELECT team, count(team) as playedCount, sum(wins) as winCount FROM ScrimJimRecord where scrimMonthYear = ? group by team order by winCount desc, playedCount desc, team";

    db.all(selectScrimRecordSql, [scrimMonthYear], (err, rows) => {
        if(err)
            console.log(err.message);
        else {
            
            //40
            //------ 6

            var scrimBoardMessage = "**Scrim leaderboard for "+scrimMonthYear+"**";
            //scrimBoardMessage+= "_________________________________________________________";
            scrimBoardMessage+= "\n|**Team**------------------------------------**Played**------**Won**|";
            rows.forEach((row) => {
                console.log(row.team);
                console.log(row.playedCount);
                console.log(row.winCount);

                var fillerLength = 0;
                if(row.team.length < 40)
                    fillerLength = 40 - row.team.length;

                scrimBoardMessage+= "\n|"+row.team;
                for(var i=0; i<fillerLength; i++)
                    scrimBoardMessage+= "-";
                
                scrimBoardMessage+= ""+row.playedCount+"------------"+row.winCount+"---|";

                console.log(scrimBoardMessage);
                
            })
            interaction.reply(scrimBoardMessage);
        }
    });
}

function selectAllScrimResults() {//unused
    const selectTableSql = "SELECT * FROM ScrimJimResults";
    db.all(selectTableSql, [], (err, rows) => {
        if(err)
            console.log(err.message);
        else {
            rows.forEach((row) => {
                console.log(row);
            })
        }
    });
}

function selectAllScrimRecord() {//unused
    const selectTableSql = "SELECT * FROM ScrimJimRecord";
    db.all(selectTableSql, [], (err, rows) => {
        if(err)
            console.log(err.message);
        else {
            rows.forEach((row) => {
                console.log(row);
            })
        }
    });
}

function addPlayerToReadyList(member) {
    const memberDisplayName = member.displayName;
    var alreadyAdded = false;
    if(readyPlayers.length > 0) {
        for (i = 0; i < readyPlayers.length; i++) {
            if(readyPlayers[i] === memberDisplayName) {
                alreadyAdded = true;
                break;
            }
        }
    }
    if(!alreadyAdded) {
        readyPlayers[readyPlayers.length] = memberDisplayName;
    }
    return;
}

function createInhouseTeams(readyPlayers, interaction) {

    var msgSend = "";
    if(readyPlayers.length > 0) {
        if(readyPlayers.length >= 10) {
            readyPlayersCopy = [];
            for(var i=0;i<readyPlayers.length;i++) {
                readyPlayersCopy[readyPlayersCopy.length] = readyPlayers[i];
            }
            var matchIndex = 1;
            var teams = "";
            while (readyPlayers.length >= 10)
            {
                teams += "__**Match "+matchIndex+"**__";
                teams += "\n**Astra**\n" + returnRandom5Players(readyPlayers, interaction);
                teams += "\n\n**Umbra**\n" + returnRandom5Players(readyPlayers, interaction) + "\n\n";
                matchIndex++;
            }
            
            if(readyPlayers.length > 0) {
                teams += "__**Unmatched players: **__";
                for(var i=0;i<readyPlayers.length;i++) {
                    teams += "\n"+ (i+1) + ") "+ readyPlayers[i];
                }
            }

            for(var i=0;i<readyPlayersCopy.length;i++) {
                readyPlayers[i] = readyPlayersCopy[i];
            }
            return teams;
        }
        else {
            msgSend = "Less than 10 players are ready. User /add or /manage to add more players.";
            return msgSend;
        }
    }
    else {
        msgSend = "No players are ready. User /add or /manage to add players first.";
        return msgSend;
    }
}

function returnRandom5Players(readyPlayers, interaction) {
    //const ccMadnessId = "1015441442178596885"; //old cc madness
    //const ccMadnessId = "1219461048101244938"; //new cc madness
    const ccMadnessId = "550399409863524371"; //shadesmar
    const ccMadnessGuild = client.guilds.cache.find((g) => g.id === ccMadnessId);
    //const ccMadnessGuild = client.guilds.fetch(ccMadnessId);
    console.log("ccMadnessGuild -> "+ccMadnessGuild);

    ccMadnessGuild.members.fetch();
    //const members = await guild.members.fetch();

    var random = Math.floor(Math.random() * readyPlayers.length);
    var playerTemp = readyPlayers[random];
    console.log("playerTemp -> "+playerTemp);
    var member = ccMadnessGuild.members.cache.find(m => m.displayName === playerTemp);
    console.log("member -> "+member);
    console.log("member.roles -> "+member.roles);
    var memberRoles = member.roles.cache
        .filter((roles) => roles.id !== "1219469326017368125" && roles.id !== "1219476248170991619" && roles.id !== "1219465533200535646" && roles.id !== "1219461275663339612" 
        && roles.id !== "1219464796693332078" && roles.id !== "1219461320668352553" && roles.id !== "1305391923615367188" && roles.id !== "1243787225829736571" && roles.id !== "1247687466262069258" 
        && roles.id !== "1219470690600878180" && roles.id !== "1219865081748258857" && roles.id !== "1219471273403613314" && roles.id !== "1219461353224540220" && roles.id !== "1222281821882945588" 
        && roles.id !== "1219476446746116206" && roles.id !== "1219462462290792569" && roles.id !== "1219472322130346075" && roles.id !== "1219462565105504397" && roles.id !== "1219462623918293114" 
        && roles.id !== "1219472247648157696" && roles.id !== "1219462803795083346" && roles.id !== "1221922720741330974" && roles.id !== "1219462663856193536" && roles.id !== "1226302398184558723" 
        && roles.id !== "1219473654723776605" && roles.id !== "1240083595742150755" && roles.id !== "1228554228553748520" && roles.id !== "1243770514032558090" && roles.id !== "1243788297298509859"
        && roles.id !== "550399409863524371"
        //&& roles.id !== "1219461048101244938"
    )
        .map((role) => role.toString());    
    if(memberRoles != null && memberRoles.length > 0) { }
    else
        memberRoles[0] = "";
    var memberGlobalName = ccMadnessGuild.members.cache.find(m => m.displayName === playerTemp).user.globalName;
    var players = "1) "+ memberGlobalName + memberRoles[0];
    readyPlayers.splice(random, 1);

    random = Math.floor(Math.random() * readyPlayers.length);
    playerTemp = readyPlayers[random];
    member = ccMadnessGuild.members.cache.find(m => m.displayName === playerTemp);
    memberRoles = member.roles.cache
        .filter((roles) => roles.id !== "1219469326017368125" && roles.id !== "1219476248170991619" && roles.id !== "1219465533200535646" && roles.id !== "1219461275663339612" 
        && roles.id !== "1219464796693332078" && roles.id !== "1219461320668352553" && roles.id !== "1305391923615367188" && roles.id !== "1243787225829736571" && roles.id !== "1247687466262069258" 
        && roles.id !== "1219470690600878180" && roles.id !== "1219865081748258857" && roles.id !== "1219471273403613314" && roles.id !== "1219461353224540220" && roles.id !== "1222281821882945588" 
        && roles.id !== "1219476446746116206" && roles.id !== "1219462462290792569" && roles.id !== "1219472322130346075" && roles.id !== "1219462565105504397" && roles.id !== "1219462623918293114" 
        && roles.id !== "1219472247648157696" && roles.id !== "1219462803795083346" && roles.id !== "1221922720741330974" && roles.id !== "1219462663856193536" && roles.id !== "1226302398184558723" 
        && roles.id !== "1219473654723776605" && roles.id !== "1240083595742150755" && roles.id !== "1228554228553748520" && roles.id !== "1243770514032558090" && roles.id !== "1243788297298509859"
        && roles.id !== "550399409863524371"
        //&& roles.id !== "1219461048101244938"
    )
        .map((role) => role.toString());
    if(memberRoles != null && memberRoles.length > 0) { }
    else
        memberRoles[0] = "";
    players += "\n2) "+ playerTemp + memberRoles[0];
    readyPlayers.splice(random, 1);

    random = Math.floor(Math.random() * readyPlayers.length);
    playerTemp = readyPlayers[random];
    member = ccMadnessGuild.members.cache.find(m => m.displayName === playerTemp);
    memberRoles = member.roles.cache
        .filter((roles) => roles.id !== "1219469326017368125" && roles.id !== "1219476248170991619" && roles.id !== "1219465533200535646" && roles.id !== "1219461275663339612" 
        && roles.id !== "1219464796693332078" && roles.id !== "1219461320668352553" && roles.id !== "1305391923615367188" && roles.id !== "1243787225829736571" && roles.id !== "1247687466262069258" 
        && roles.id !== "1219470690600878180" && roles.id !== "1219865081748258857" && roles.id !== "1219471273403613314" && roles.id !== "1219461353224540220" && roles.id !== "1222281821882945588" 
        && roles.id !== "1219476446746116206" && roles.id !== "1219462462290792569" && roles.id !== "1219472322130346075" && roles.id !== "1219462565105504397" && roles.id !== "1219462623918293114" 
        && roles.id !== "1219472247648157696" && roles.id !== "1219462803795083346" && roles.id !== "1221922720741330974" && roles.id !== "1219462663856193536" && roles.id !== "1226302398184558723" 
        && roles.id !== "1219473654723776605" && roles.id !== "1240083595742150755" && roles.id !== "1228554228553748520" && roles.id !== "1243770514032558090" && roles.id !== "1243788297298509859"
        && roles.id !== "550399409863524371"
        //&& roles.id !== "1219461048101244938"
    )
        .map((role) => role.toString());
    if(memberRoles != null && memberRoles.length > 0) { }
    else
        memberRoles[0] = "";
    players += "\n3) "+ playerTemp + memberRoles[0];
    readyPlayers.splice(random, 1);

    random = Math.floor(Math.random() * readyPlayers.length);
    playerTemp = readyPlayers[random];
    member = ccMadnessGuild.members.cache.find(m => m.displayName === playerTemp);
    memberRoles = member.roles.cache
        .filter((roles) => roles.id !== "1219469326017368125" && roles.id !== "1219476248170991619" && roles.id !== "1219465533200535646" && roles.id !== "1219461275663339612" 
        && roles.id !== "1219464796693332078" && roles.id !== "1219461320668352553" && roles.id !== "1305391923615367188" && roles.id !== "1243787225829736571" && roles.id !== "1247687466262069258" 
        && roles.id !== "1219470690600878180" && roles.id !== "1219865081748258857" && roles.id !== "1219471273403613314" && roles.id !== "1219461353224540220" && roles.id !== "1222281821882945588" 
        && roles.id !== "1219476446746116206" && roles.id !== "1219462462290792569" && roles.id !== "1219472322130346075" && roles.id !== "1219462565105504397" && roles.id !== "1219462623918293114" 
        && roles.id !== "1219472247648157696" && roles.id !== "1219462803795083346" && roles.id !== "1221922720741330974" && roles.id !== "1219462663856193536" && roles.id !== "1226302398184558723" 
        && roles.id !== "1219473654723776605" && roles.id !== "1240083595742150755" && roles.id !== "1228554228553748520" && roles.id !== "1243770514032558090" && roles.id !== "1243788297298509859"
        && roles.id !== "550399409863524371"
        //&& roles.id !== "1219461048101244938"
    )
        .map((role) => role.toString());
    if(memberRoles != null && memberRoles.length > 0) { }
    else
        memberRoles[0] = "";
    players += "\n4) "+ playerTemp + memberRoles[0];
    readyPlayers.splice(random, 1);

    random = Math.floor(Math.random() * readyPlayers.length);
    playerTemp = readyPlayers[random];
    member = ccMadnessGuild.members.cache.find(m => m.displayName === playerTemp);
    memberRoles = member.roles.cache
        .filter((roles) => roles.id !== "1219469326017368125" && roles.id !== "1219476248170991619" && roles.id !== "1219465533200535646" && roles.id !== "1219461275663339612" 
        && roles.id !== "1219464796693332078" && roles.id !== "1219461320668352553" && roles.id !== "1305391923615367188" && roles.id !== "1243787225829736571" && roles.id !== "1247687466262069258" 
        && roles.id !== "1219470690600878180" && roles.id !== "1219865081748258857" && roles.id !== "1219471273403613314" && roles.id !== "1219461353224540220" && roles.id !== "1222281821882945588" 
        && roles.id !== "1219476446746116206" && roles.id !== "1219462462290792569" && roles.id !== "1219472322130346075" && roles.id !== "1219462565105504397" && roles.id !== "1219462623918293114" 
        && roles.id !== "1219472247648157696" && roles.id !== "1219462803795083346" && roles.id !== "1221922720741330974" && roles.id !== "1219462663856193536" && roles.id !== "1226302398184558723" 
        && roles.id !== "1219473654723776605" && roles.id !== "1240083595742150755" && roles.id !== "1228554228553748520" && roles.id !== "1243770514032558090" && roles.id !== "1243788297298509859"
        && roles.id !== "550399409863524371"
        //&& roles.id !== "1219461048101244938"
    )
        .map((role) => role.toString());
    if(memberRoles != null && memberRoles.length > 0) { }
    else
        memberRoles[0] = "";
    players += "\n5) "+ playerTemp + memberRoles[0];
    readyPlayers.splice(random, 1);

    return players;
}

function getRoleColour() {

}

client.login(token);