const registeredTeams = [];
const readyTeams = [];
var readyTeamsCombined = [];
const matchedTeams = [];
const matchesInProgress = [];
const matchesInProgressManual = [];
const autoMatchingMakingToggle = false;
const eventRegistrationToggle = false;
var nextSwissDate;
const swissTeams = [];

//Get token from Silanah
const token = ""
const prefix = "/";
const { Client, GatewayIntentBits } = require('discord.js');
const { MessageAttachment } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
})

client.on("ready", ()=> {
    console.log(`Logged in as ${client.user.tag}`);
    //console.log(autocorrect('Primal Accessories of Fending Coffer (IL 240)'));
});

client.on("messageCreate", (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const userMessage = message.content.slice(prefix.length).split(" ");

    if(userMessage[0].toLowerCase() === "test") {
        //console.log(autocorrect('??'));
        //autocorrect('mbryo') // embryo
    }

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
        if(readyTeams.length > 0) {
            var readyTeamsMsg = "";
            for(var i=0;i<readyTeams.length;i++) {
                readyTeamsMsg+="\n"+(i+1)+") "+readyTeams[i];
            }
            message.channel.send("**Ready teams:**\n"+readyTeamsMsg);
        }
        else
        message.channel.send("No teams are ready at present");
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

    if(userMessage[0].toLowerCase() === "scheduleswiss") {
        if(message.content.indexOf(" ") >= 0) {
            var userMessageI = message.content.substring(message.content.indexOf(" ")+1);

            nextSwissDate = userMessageI;
            var scheduleSwissMsg = "New Swiss scrims scheduled for **"+nextSwissDate+"**";
            scheduleSwissMsg+= "\nUse **/scheduleSwiss <date>** again to change the date";
            scheduleSwissMsg+= "\nUse **/cancelSwiss** to cancel";
            message.channel.send(scheduleSwissMsg);
        }
    }

    if(userMessage[0].toLowerCase() === "cancelswiss") {
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

    if(userMessage[0].toLowerCase() === "whenswiss") {
        if(nextSwissDate != null && nextSwissDate != "") {
            var whenSwissMsg = "Next Swiss scrims scheduled for **"+nextSwissDate+"**";
            whenSwissMsg+="\nUse **/registerSwiss <teamname>** to register your team";
            whenSwissMsg+="\nUse **/deregisterSwiss <teamname>** to register your team";
            message.channel.send(whenSwissMsg);
        }
        else
            message.channel.send("No Swiss scrims have been scheduled. Keep an eye out for announcements");
    }
    
    if(userMessage[0].toLowerCase() === "registerswiss") {
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

    if(userMessage[0].toLowerCase() === "deregisterswiss") {
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

    if(userMessage[0].toLowerCase() === "swissteams") {
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

});

client.login(token);