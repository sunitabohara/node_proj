// "use strict";
//
// const BotEvents = require('viber-bot').Events;
// const TextMessage = require('viber-bot').Message.Text;
//
// module.exports = function(bot, async, Query, Keyboard, Keyword, KeywordMessage, ViberLogReceive, ViberLogSend) {
//
//     bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
//
//         var data = new ViberLogReceive({
//             type: 'message',
//             text: message.text,
//             timestamp: message.timestamp,
//             message_token: message.token,
//             viber_id: response.userProfile.id
//         });
//     data.save((err, result) => {
//         console.log(result);
// });
//
// });
//
//     bot.onTextMessage(/./i, (message, response) => {
//         var textMsg = message.text;
//
//     async.waterfall([
//         function (callback){
//             var parentId;
//
//             if(textMsg.indexOf("BACK-") !== '-1'){
//                 var matches = textMsg.match('/(\d)*$/');
//                 if(matches){
//                     var menuId = matches[0];
//
//                     Keyboard.findOne({
//                         _id: menuId
//                     })
//                         .exec(function(err, result){
//                             if(result){
//                                 parentId = result.parent;
//                             }
//                             callback(err, parentId);
//                         })
//                 }
//             }
//
//             Keyword.findOne({
//                 keyword: textMsg
//             })
//                 .exec(function(err, result){
//                     if(result){
//                         parentId = result.keyboard;
//                     }
//
//                     callback(null, parentId);
//                 })
//         },
//         function(parentId, callback){
//             Query.buildKeyboard(Keyboard, function(err, result) {
//                 if(parentId){
//                     var defaultButtons = Query.buildbackHomeButton(parentId)
//                     result.unshift(defaultButtons[0]);
//                     result.unshift(defaultButtons[1]);
//                 }
//                 var Buttons = {
//                     "Type": "keyboard",
//                     "Buttons": result
//                 };
//                 callback(err, Buttons);
//             }, parentId);
//         },
//         function(Buttons, callback){
//             var msg = [];
//
//             if(textMsg.match(/^hi|hello$/i)){
//                 msg.push(new TextMessage(`Hi there ${response.userProfile.name}.`, Buttons));
//                 callback(null, msg);
//             }else if(textMsg.indexOf("BACK-") !== '-1'){
//                 msg.push(new TextMessage('Please select any option from keyboard.', Buttons));
//                 callback(null, msg);
//             }else{
//                 Keyword.findOne({
//                     keyword: textMsg
//                 })
//                     .populate('message')
//                     .exec(function(err, result){
//                         if(result){
//                             result.message.forEach(function(Message){
//                                 msg.push(new TextMessage(Message.text, Buttons));
//                             });
//                             callback(err, msg);
//                         }else{
//                             msg.push(new TextMessage('Sorry, i could\'t undestand you!!', Buttons));
//                             callback(err, msg);
//                         }
//                     });
//             }
//
//         }
//     ], (err, results) => {
//         if(err){
//             console.log(err);
//         }
//
//         response.send(results)
//         .catch(err => console.log(err))
//
// });
//
// });
//
//     bot.on(BotEvents.MESSAGE_SENT, (message, userProfile) => {
//
//         var data = new ViberLogSend({
//             type: 'text',
//             text: message.text,
//             viber_id: userProfile.id,
//             message_token: message.token,
//             response_data: message.text,
//             response_code: 200
//         });
//     data.save((err, result) => {
//         console.log(result);
// });
//
// });
//
// }