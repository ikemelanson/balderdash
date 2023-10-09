// {
// 	playerState: {
//      connected : Bool
// 		room :  String
// 		name : String
// 		isPlayerOne : Bool
// 		roundState : {
// 			roundItPlayer: String
// 			roundWord: String
// 			roundPhase : String
// 			hasSubmittedDefinition : Bool
// 			hasVoted : Bool
// 		}
// 	}
// }

// {
// 	hostState: {
// 		connected: Bool
// 		room :  String
// 		isHost : true
// 		roundState : {
// 			roundItPlayer: String
// 			roundWord: String
// 			roundPhase : String
// 		}
// 	}
// }

export class HostState {
  connected;
  room;
  players = [];
  isHost = true;
}

export class HostRoundState {
  roundItPlayer;
  roundWord;
  roundPhase;
}

export class Player {
  constructor(newPlayer) {
    this.playerName = newPlayer.name;
    this.isPlayerOne = newPlayer.isPlayerOne;
  }
}

export class PlayerState {
  message;
  connected;
  room;
  isHost = false;
  name;
  isPlayerOne;
  roundState;
}

export class PlayerRoundState {
  roundItPlayer;
  roundWord;
  roundPhase;
  hasSubmittedDefinition = false;
  hasVoted = false;
}

// module.exports = {
//   HostState,
//   HostRoundState,
//   PlayerState,
//   PlayerRoundState,
// };
