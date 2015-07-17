
    
//Meteor.publish(name, fn) name - name of the record set server publishes, fn - this is called each time a client subscribes to the recordset
Meteor.publish('tasks', function(){
    return Tasks.find({
        $or: [
            { private: {$ne: true} },
            { owner: this.userId }
        ]
    });
})



//define Meteor methods to seperate database logic from event handlers

Meteor.methods({
    
    addTask: function(text){
        
        if(!Meteor.userId()){
            throw new Meteor.Error("not-authorized");
        }
        
        Tasks.insert({
            text: text,
            createdAt: new Date(),
            owner: Meteor.userId(), //_id of logged in user
            username: Meteor.user().username //username of logged in user
        });
    },
    
    deleteTask: function(taskId){
        
        var task = Tasks.findOne(taskId); 
        
        if(task.private && task.owner != Meteor.userId()){
            //if task is private, only owner can delete it 
            throw new Meteor.Error("not-authorized");
        }
        
        Tasks.remove(taskId);
        
    },
    
    setChecked: function(taskId, setChecked){
        
        var task = Tasks.findOne(taskId); 
        
        if(task.private && task.owner != Meteor.userId()){
            //if task is private, only owner can delete it 
            throw new Meteor.Error("not-authorized");
        }
        
        Tasks.update(taskId, { $set: {checked: setChecked}});
    },
    
    setPrivate: function(taskId, setToPrivate){
        var task = Tasks.findOne(taskId);
        
        if(task.owner != Meteor.userId()){
            throw new Meteor.Error("not-authorized");
        }
        
        Tasks.update(taskId, {$set : {private: setToPrivate}});
    }
    
});
