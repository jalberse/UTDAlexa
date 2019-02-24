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
};

// ********
// END PARKING INTENT

/// **********
// BIG FACTS

var facts = [
    'UT Dallas was founded in 1969.',
    'UT Dallas has more than 570 tenured and tenure-track professors including Nobel laureate Russell A. Hulse and six National Academy members.',
    'UTD offers 50 Bachelor\'s degree programs, 60 Master\'s degree programs, and 30 PhD programs.',
    'UT Dallas has more than 300 campus organizations and 26 national Greek-letter fraternities and sororities.',
    'UTD\'s top undergraduate majors include Computer Science, Biology, Mechanical Engineering, Finance, and Neuroscience.',
    'UT Dallas is home to over 1,300 teaching faculty, and about 29,000 students with more than 100 countries being represented.',
    'UT Dallas has more than 300 student-athletes and 14 intercollegiate teams.',
    'The UT Dallas chess team has won or tied for first place in the Pan-American Intercollegiate Chess Championship 10 times since 2000.',
    'The UTD Mascot Temoc’s name, blue skin and fiery orange hair all come from a single source: Temoc is \'comet\' spelled backwards.',
    'UTD fields 14 intercollegiate teams, and compete in the NCAA Division III American Southwest Conference.',
    'In 2017, over 4,500 internships were awarded to UT Dallas undergraduate and graduate students.',
    'All 10 Fortune 500 most profitable companies hired UT Dallas graduates.',
    'Times Higher Education has ranked UT Dallas among the top universities in the United States less than 50 years old.',
    'The Princeton Review has consistently named UT Dallas to its list of Best Value Colleges — academically outstanding colleges that guide students to rewarding careers without burdening them with excessive debt.'
    ];

var max = facts.length;

const GetFactIntentHandler = {
    canHandle(handlerInput){
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
           && handlerInput.requestEnvelope.request.intent.name === 'getFact';
   },
   handle(handlerInput) {
       const speechText = facts[Math.floor(Math.random() * Math.floor(max))];
       return handlerInput.responseBuilder
           .speak(speechText)
           .getResponse();
    }
};

// **********
// END BIG FACTS


// *****
// CONTACT

var contactInfos = new Array();
contactInfos['to report a bookstore customer service complaint'] = "University of Texas at Dallas Bookstore Manager Brian Weiskopf at (972) 883-2665 (phone), (972) 883-2543 (fax), or via email at u t d@b k s t r.com."; 
contactInfos['to report a food service customer complaint'] = "Please contact the U T Dallas Dining Services at 972- 883-4764, email foodservice@utdallas.e d u, or stop by to see us in 2.902 in the Student Union (SU).";
contactInfos['to reset my net i.d and password'] = "the Help Desk at assist@u t dallas.e d u or (972) 883-2911";
contactInfos['to report a security incident'] = "infosecurity@u t dallas.edu or call the Information Security help line at (972) 883-6810. If this is a matter of public safety, please contact nine one one and/or U T Dallas Police at 972-883-2222. If the concern involves a missing or stolen computer, please contact the UT Dallas Police at 972-883-2222 or file a report at http://u t dallas.e d u/infosecurity/report";
contactInfos['in an emergency'] = "nine one one or (972) 883-2222 or through email at police@u t dallas.e d u";
contactInfos['to report harassment'] = "the Office of Institutional Equity (I E) via email at InstitutionalEquity@u t dallas.e d u or by phone at 972-883-2223."; 
contactInfos['to complain about another student'] = "the Office of the Dean of Students in person by visiting SSB 4.400, via email at gene.fitch@u t dallas.e d u, or by phone at 972-883-6391.";
contactInfos['to report a customer service complain about the tech store'] = "972-883-6500 or email store manager Brian Leadingham at brianl@hied.com.";
contactInfos['if I have additional questions about a contract'] = "the Office of Contract Administration at O C A@u t dallas.e d u, call (972) 883-4889 or visit the O C A website at http://www.u t dallas.e d u/contract/.";
contactInfos['for medical non-emergency'] = "Student Health Center by calling (972)883-2747"
contactInfos['for the school\'s closure information'] = "972-883-7669."
contactInfos['if I smell chemicals'] = "Environmental Health and Safety at 972-883-4111 or U T Dallas police at 972-883-2222.";
contactInfos['if it\'s too cold indoors'] = "Energy management services at 972-883-2147";
contactInfos['if the internet\'s not working'] = "The U T Dallas Help Desk at 972-883-2911";
contactInfos['if there\'s power outage'] = "Facilities management at 972-883-2141";
contactInfos['if there\'s no water'] = "Facilities management at 972-883-2141";
contactInfos['if there\'s gas leak'] = "Facilities management at 972-883-2141";
contactInfos['about sewage failure'] = "Facilities management at 972-883-2141";
contactInfos['about mental health problem'] = "972-883-8255 to access a mental health professional.";
contactInfos['if i\'m raped'] = "the 24-hour rape crisis hotline at 972-641-7273 or U T Dallas Police at 972-883-2222."

const getContactInfoIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
           && handlerInput.requestEnvelope.request.intent.name === 'getContactInfo';
   },
   handle(handlerInput) {
       const situation = handlerInput.requestEnvelope.request.intent.slots.scenario.resolutions.resolutionsPerAuthority[0].values[0].value.name;
       const speechText = "Please contact " + contactInfos[situation];
       return handlerInput.responseBuilder
           .speak(speechText)
           //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
           .getResponse();
   }
};

// *****
// END CONTACT




// **********
// COURSE DESCRIPTION


const getCourseDescriptionIntentHandler = {
    canHandle(handlerInput){
       return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'getCourseDescription';
    },
    handle(handlerInput){
        var course= handlerInput.requestEnvelope.request.intent.slots.COURSE.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        var speechText = course;
        return rp(options)
            .then(($)=> {
                var options = {
                    uri:`https://coursebook.utdallas.edu/search/searchresults/now/` + course,
                    transform: function(body){
                        return cheerio.load(body);
                    }
                  };
                var text = $('#searchresults').text();
                indexParen = text.indexOf('(');
                numClassText = text.substring(indexParen+1,indexParen+2);
                
                speechText='There are ' + numClassText + ' sections available of ' + course;
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .getResponse();
            })
            .catch((err) => {
                console.log(err.message);
                speechText='Sorry, I had some problems getting that course information.';
                console.log(speechText);
            });
    }
 };
 

// ******
// END COURSE DESCRIPTIONS

// ******
// LOCATION INTENT

var locations = new Array();
locations['Bursar office']="SSB 2.300";
locations['ECS advising office']="ECS 2.502";
locations["Office of student volunteerism"]="SSA 14.431";
locations['Office of admission']="SSB 1.300";

const getLocationIntentHandler = {
    canHandle(handlerInput){
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
           && handlerInput.requestEnvelope.request.intent.name === 'getLocation';
   },
   handle(handlerInput) {
       const place = handlerInput.requestEnvelope.request.intent.slots.LOCATION.resolutions.resolutionsPerAuthority[0].values[0].value.name;
       const speechText ="The " + place + " is located in " + locations[place];
       return handlerInput.responseBuilder
           .speak(speechText)
           .getResponse();
 }
};

// ******
// END LOCATION INTENT

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
        FindParkingIntentHandler,
        GetFactIntentHandler,
        getContactInfoIntentHandler,
        getCourseDescriptionIntentHandler,
        getLocationIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
