const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

//Get token from Silanah
const token = "";
//const ccMadnessId = "1015441442178596885"; //old cc madness
//const ccMadnessId = "1219461048101244938"; //new cc madness
const ccMadnessId = "550399409863524371"; //shadesmar
const botId = "1084259129897533481";

const commands = [
    {//ready
        name: "ready",
        description: "Use this when your team is ready to play either when you first arrive or finish a set",
        options: [
            {
                name: "teamname",
                description: "Team Name",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {//start
        name: "start",
        description: "Use this to change your ready status to playing another team",
        options: [
            {
                name: "team1",
                description: "Team 1",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "team2",
                description: "Team 2",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {//done
        name: "done",
        description: "Use this to remove your ready status and end all your matches",
        options: [
            {
                name: "teamname",
                description: "Team Name",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {//teams
        name: "teams",
        description: "Use this when you want to check the status of all the teams currently ready",
    },
    {//sets
        name: "sets",
        description: "Use this to show the ongoing sets",
    },
    /*{//result
        name: "result",
        description: "Register a scrim result for use in monthly leaderboards",
        options: [
            {
                name: "team1",
                description: "Team 1",
                type: ApplicationCommandOptionType.Role,
                required: true,
            },
            {
                name: "team2",
                description: "Team 2",
                type: ApplicationCommandOptionType.Role,
                required: true,
            },
            {
                name: "winner",
                description: "The team that won the set",
                type: ApplicationCommandOptionType.Role,
                required: true,
            },
            {
                name: "score",
                description: "Optional. The set's score. i.e., 3-0, 1-2, etc",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: '3-0',
                        value: '3-0'
                    },
                    {
                        name: '2-1',
                        value: '2-1'
                    },
                    {
                        name: '0-3',
                        value: '0-3'
                    },
                    {
                        name: '1-2',
                        value: '1-2'
                    }
                ]
            }
        ]
    },
    {//removeresult
        name: "removeresult",
        description: "Remove a scrim result. To be used by Janitors when there was a mistake",
        options: [
            {
                name: "team1",
                description: "Team 1",
                type: ApplicationCommandOptionType.Role,
                required: true,
            },
            {
                name: "team2",
                description: "Team 2",
                type: ApplicationCommandOptionType.Role,
                required: true,
            },
            {
                name: "date",
                description: "The date (mm/dd/yyyy) when the scrim happened. Not the date the result was recorded",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {//scrimboard
        name: "scrimboard",
        description: "Use to view the monthly scrim leaderboard",
        options: [
            {
                name: "month",
                description: "The month you want to view",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: 'January',
                        value: 'January'
                    },
                    {
                        name: 'February',
                        value: 'February'
                    },
                    {
                        name: 'March',
                        value: 'March'
                    },
                    {
                        name: 'April',
                        value: 'April'
                    },
                    {
                        name: 'May',
                        value: 'May'
                    },
                    {
                        name: 'June',
                        value: 'June'
                    },
                    {
                        name: 'July',
                        value: 'July'
                    },
                    {
                        name: 'August',
                        value: 'August'
                    },
                    {
                        name: 'September',
                        value: 'September'
                    },
                    {
                        name: 'October',
                        value: 'October'
                    },
                    {
                        name: 'November',
                        value: 'November'
                    },
                    {
                        name: 'December',
                        value: 'December'
                    }
                ]
            },
            {
                name: "year",
                description: "The year you want to view",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: '2024',
                        value: '2024'
                    }
                ]
            }
        ]
    },*/
    {//24x7comp
        name: "24x7comp",
        description: "Generate 2 random team comps, one each for Astra and Umbra, for your 24x7 needs",
    },
    {//24x7compbalanced
        name: "24x7compbalanced",
        description: "Generate 2 random team comps that are balanced around roles (1 job from each role like feast)",
    },
    {//randomcomp
        name: "randomcomp",
        description: "Generate a random team comp",
    },
    {//gm
        name: "gm",
        description: "Good morning Merlin!"
    },
    {//add
        name: "add",
        description: "Add a member to inhouse waiting (ready) list. Only accessible to Janitors",
        options: [
            {
                name: "playername",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
                required: true,
            }
        ]
    },
    {//addbulk
        name: "addbulk",
        description: "Add multiple members to inhouse waiting (ready) list. Only accessible to Janitors",
        options: [
            {
                name: "player1name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: "player2name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player3name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player4name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player5name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player6name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player7name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player8name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player9name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player10name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player11name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player12name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player13name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player14name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player15name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player16name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player17name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player18name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player19name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player20name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            }
        ]
    },
    {//addfromvc
        name: "addfromvc",
        description: "Adds everyone currently in lobby VC to inhouse waiting list. Only accessible to Janitors",
    },
    {//delete aka remove
        name: "delete",
        description: "Removes a member from inhouse waiting (ready) list. Only accessible to Janitors",
        options: [
            {
                name: "playername",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
                required: true,
            }
        ]
    },
    {//clear
        name: "clear",
        description: "Removes all members from inhouse waiting (ready) list. Only accessible to Janitors",
    },
    {//see
        name: "see",
        description: "View the list of ready members. Only accessible to Janitors"
    },
    {//manage
        name: "manage",
        description: "Manage the list of ready members. Only accessible to Janitors"
    },
    {//createteams
        name: "createteams",
        description: "Create random teams using ready members. Only accessible to Janitors"
    }/*,
    {//247in
        name: "247in",
        description: "Use to mark yourself ready for 24x7 pickup scrims"
    },
    {//247out
        name: "247out",
        description: "Use to mark yourself done for 24x7 pickup scrims"
    },
    {//247letsgo
        name: "247letsgo",
        description: "Use to create 2 teams for 247 scrims using whoever used /247in"
    }*/,
    {//register
        name: "register",
        description: "Use to register your team for next Scrim Jims on Friday",
        options: [
            {
                name: "teamname",
                description: "Team Name",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {//remove
        name: "remove",
        description: "Use to remove your team from next Scrim Jims on Friday",
        options: [
            {
                name: "teamname",
                description: "Team Name",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {//view
        name: "view",
        description: "Use to view teams registered for next Scrim Jims on Friday"
    },
    {//t1
        name: "t1",
        description: "t1"
    }
    
    /*,
    {//testcolour
        name: "testcolour",
        description: "Test colour"
    }
    
    /*,
    {//a (same as add)
        name: "a",
        description: "Add a member to inhouse waiting (ready) list. Same as /add. Only accessible to Janitors",
        options: [
            {
                name: "playername",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
                required: true,
            }
        ]
    },
    {//ab (same as addbulk)
        name: "ab",
        description: "Add multiple members to inhouse waiting (ready) list. Same as /addbulk. Only accessible to Janitors",
        options: [
            {
                name: "player1name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: "player2name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player3name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player4name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player5name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player6name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player7name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player8name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player9name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player10name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player11name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player12name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player13name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player14name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player15name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player16name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player17name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player18name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player19name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "player20name",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
            }
        ]
    },
    {//avc (same as /addfromvc)
        name: "avc",
        description: "Adds everyone currently in lobby VC to inhouse waiting list. Same as /addfromvc"
    },
    {//r (same as remove)
        name: "r",
        description: "Removes a member from inhouse waiting (ready) list. Same as /remove. Only accessible to Janitors",
        options: [
            {
                name: "playername",
                description: "Player name",
                type: ApplicationCommandOptionType.User,
                required: true,
            }
        ]
    },
    {//v (same as view)
        name: "v",
        description: "View the list of ready members. Same as /view. Only accessible to Janitors"
    },
    {//m (same as manage)
        name: "m",
        description: "Manage the list of ready members. Same as /manage. Only accessible to Janitors"
    },
    {//ct (same as ct)
        name: "ct",
        description: "Create random teams using ready members. Same as /createteams. Only accessible to Janitors"
    }*/
    /*,
    {
        name: "ready",
        description: "Use this when your team is ready to play either when you first arrive or finish a set",
    },
    {
        name: "teams",
        description: "Use this when you want to check the status of all the teams currently ready",
    },
    {
        name: "randomcomp",
        description: "Use to generate a random team comp",
    }
    */
];

const rest = new REST({version: '10'}).setToken(token);

(async() => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(botId, ccMadnessId),
            { body: commands }
        )
    } catch (error) {
        console.log(error);
    }
})();