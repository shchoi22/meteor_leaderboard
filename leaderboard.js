PlayerList = new Mongo.Collection('players');

if(Meteor.isClient){
  Meteor.subscribe('thePlayers');

  Template.leaderboard.helpers({
    'players': function() {
      return PlayerList.find({},{sort:{score:-1,name:1}});
    },
    'selectedClass': function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerId == selectedPlayer){
        return "selected";
      }
    },
    'showSelectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayerList.findOne(selectedPlayer);
    }
  })

  Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer',playerId);
    },
    'click .increment':function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayerList.update(selectedPlayer,{$inc:{score: 5}});
    },
    'click .decrement':function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayerList.update(selectedPlayer, {$inc:{score: -5}});
    },
    'submit form': function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      var currentUserId = Meteor.userId();
      PlayerList.insert({name: playerNameVar, score: 0, createdby: currentUserId});
    },
    'click .remove':function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayerList.remove(selectedPlayer);
    }
  })
}

if(Meteor.isServer){
  Meteor.publish('thePlayers', function(){
    var currentUserId = this.userId;
    return PlayerList.find({createdby: currentUserId});
  });
}