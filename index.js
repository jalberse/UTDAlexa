// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const rp = require('request-promise');
const cheerio = require('cheerio');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome, you can say Hello or Help. Which would you like to try?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// ***********************
// Class description intent handling
// TODO: Replace with Scalley's code
// *******************
// End class description intent handling

const GetLocationIntentHandler = {
    canHandle(handlerInput){
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
           && handlerInput.requestEnvelope.request.intent.name === 'GetLocationIntent';
   },
   handle(handlerInput) {
       const speechText = handlerInput.requestEnvelope.request.intent.slots.LOCATION.value + " is located in ";
       return handlerInput.responseBuilder
           .speak(speechText)
           .getResponse();
 }
};

// *******************
// Parking intent 

const ParkingOptions = {
  uri: `https://www.utdallas.edu/services/transit/garages/_code.php`,
  transform: function (body) {
    return cheerio.load(body);
  }
};

// Get parking information
const FindParkingIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'FindParkingIntent';
    },
    handle(handlerInput){
        var speechText = 'We'

        return rp(ParkingOptions)
            .then(($) => {
                const color = 'orange'; // TODO: Update with slot
                var speechText = 'There are ';
    
              $('tbody').each(function(i,elem){
                    var cnt = 0;
                    if (color === 'green'){
                        $(this).find('.parking_green').next().each(function(j,elem){
                            cnt += parseInt($(this).text(),10);
                        })
                    }
                    if (color === 'gold'){
                        $(this).find('.parking_gold').next().each(function(j,elem){
                            cnt += parseInt($(this).text(),10);
                        })
                    }
                    if (color === 'orange'){
                        $(this).find('.parking_orange').next().each(function(j,elem){
                            cnt += parseInt($(this).text(),10);
                        })
                    }
                    if (color === 'purple'){
                        $(this).find('.parking_purple').next().each(function(j,elem){
                            cnt += parseInt($(this).text(),10);
                        })
                    }
                if (i === 2) {
                    speechText += "and " + cnt + " spots in Parking Structure " + (i + 1) + ".";
                }
                else speechText += cnt + " spots in Parking Structure " + (i + 1) + ",\n";
            })

            speechText += "\n" + $('.centertight','tfoot').first().text();
            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
            })
            .catch((err) => {
                console.log(err);
                speechText = 'We do not have the meats';
                console.log(speechText);
        });
    }
}

// ********
// END PARKING INTENT

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetLocationIntentHandler,
        FindParkingIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();