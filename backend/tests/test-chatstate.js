const { getNextState } = require("../services/chatState.service");
const CHAT_STATES = require("../services/chatState.constants");

const campaign = {
  adBehavior: "QUESTION_BASED",
  chatRules: {
    enableChat: true
  }
};

let state = CHAT_STATES.INIT;

while (state !== CHAT_STATES.COMPLETED) {
  console.log("CURRENT:", state);
  state = getNextState({ currentState: state, campaign });
}

console.log("CURRENT:", state);
