// planned data structure of a game
// {
// 	storage : {
// 		(gameRoomCode) : {
// 			playerOne : (playerName)
// 			gameState : String
//          usedWords : []
// 			players : {
// 				(playerName) : {
// 					//name : String,
//                  score : Int
// 					avatar : "file/path"
// 				}
// 			hasNotBeenIt:[(playerName)],
// 			roundState : {
// 				roundItPlayer : (playerName)
// 				roundWord : {
// 					word : String
// 					definition : String
// 					}
// 				roundNumber : Int
// 				roundPhase : String
// 				submittedAnswers : {
// 					roundAnswer : this.roundWord.definition
// 					(playerName) : String
// 					}
// 				votes: {
// 					answering(playerName) : [voting(playerName)],
// 					roundAnswer : [voting(playerName)]
// 					}
// 				}
// 			},
// 		}
// 	}
// }

// MAY NEED TO ADD ATTRIBUTES THAT START AS NULL

class GameRoom {
  playerOne = null;
  usedWords = [];
  players = {};
  // playerList = [];
  hasNotBeenIt = [];
  gameState = null;
  roundState = null;
}

class Player {
  // constructor() {
  // }
  avatar = null;
}

class RoundState {
  roundItPlayer = null;
  roundWord = null;
  roundNumber = 0;
  roundPhase = null;
  submittedAnswers = null;
  votes = null;
}

class RoundWord {
  constructor(word, definition) {
    this.word = word;
    this.definition = definition;
  }
}

class SubmittedAnswers {
  constructor(roundAnswer) {
    this.roundAnswer = roundAnswer;
  }
}

class Votes {
  roundAnswer = [];
}

module.exports = {
  GameRoom,
  Player,
  RoundState,
  RoundWord,
  SubmittedAnswers,
  Votes,
};
